const { Sequelize } = require("sequelize");
const {user,account,transaction,otp} = require("../models");
const transfer=require('./transfer')
const mailgun = require('mailgun-js')({
  apiKey: process.env.API_KEY_MAILGUN,
  domain: process.env.DOMAIN_MAILGUN,
});

module.exports.generateOtp=async(req,res)=>{
 try {
    const userId=req.user.userId;
 const currentUser=await user.findByPk(userId);
    function otpNumber() {
  // Generate a random six-digit number
  const min = 100000; // Minimum value for a six-digit number
  const max = 999999; // Maximum value for a six-digit number
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return number;

}
const generatedOtp=otpNumber();
const expirationTime = Date.now() + 5 * 60 * 1000;
 await otp.create({otp_number:generatedOtp,email_id:currentUser.email,user_id:req.user.userId,expiration_time:expirationTime})
 cleanupExpiredOtps();

const htmlContent = `
  <html>
    <head>
      <style>
        /* Add CSS styles here */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .otp {
          font-weight: bold;
          font-size: 1.2em;
          color: #ff6600; /* Orange color for emphasis */
        }
      </style>
    </head>
    <body>
      <p>Hello,</p>
      <p>The OTP code is:</p>
      <p class="otp">${generatedOtp}</p>
      <p>Please make sure to write it down or use it as required.</p>
      <p>Thank you!</p>
    </body>
  </html>
`;
const data = {
  from: 'ABC BANK <yemeni.programmer13@gmail.com>',
  to: currentUser.email,
  subject: 'Verify Your transaction on ABC BANK',
  html: htmlContent
};

mailgun.messages().send(data, (error, body) => {
  if (error) {
    console.error('Error occurred:', error);
  } else {
    console.log('Email sent:', body);
  }
});


res.status(200).json({message:"sent otp successfully"})
 } catch (error) {
    console.log(error);
    res.status(424).json({message:"Error in server"})
 }
}

module.exports.verfiyOtp=async(req,res)=>{
  
 try {
    const {otpNumber,amount,receiver_id,transaction_type,status,message}=req.body;
 const otpIsThere=await otp.findOne({where:{user_id:req.user.userId,otp_number:otpNumber,createdAt:{[Sequelize.Op.gt]: new Date(new Date() - 5 * 60 * 1000)}}});
 if(otpIsThere){
    
    await otp.destroy({where:{otp_number:otpNumber,user_id:req.user.userId}})
    const transferStatus=await transfer.deposit(amount,req.user.userId,receiver_id,transaction_type,status,message);
    
    if(transferStatus.verified){
        res.status(201).json({isverified:transferStatus.verified,transaction_id:transferStatus.data.transactionInfo.id,redirect:"success",message:transferStatus.message});
    }else {

       res.status(201).json({isverified:transferStatus.verified,redirect:"Failed",message:transferStatus.message});
    }
 }else {
     res.status(201).json({isverified:false,redirect:"failed",message:"Otp verification is incorrect"});
 }
 } catch (error) {
    console.log(error)
     res.status(422).json({isverified:false,redirect:"failed",message:"something went wrong on the Server"});
 }
}



const cleanupExpiredOtps = async () => {
  try {
    const currentTimestamp = Date.now();
    await otp.destroy({
      where: {
        expiration_time: {
          [Sequelize.Op.lt]: currentTimestamp,
        },
      },
    });
    console.log('Expired OTPs cleaned up.');
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
};







