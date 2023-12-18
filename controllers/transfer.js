const {user,account,transaction} = require("../models");

module.exports.deposit=async(amount,sender_id,receiver_id,transaction_type,status,message)=>{
  console.log("in deposit",sender_id)
   console.log(await senderHasSufficientBalance(sender_id, amount),'function')
    if (await senderHasSufficientBalance(sender_id, amount)) {
    // Deduct amount from sender's account
    updateAccountBalance(sender_id, amount,"deduct");
    
    // Add amount to receiver's account
    updateAccountBalance(receiver_id, amount,"add");

    // Log transaction details
    const senderAccount=await account.findOne({where:{user_id:sender_id}})
    const receiverAccount=await account.findOne({where:{user_id:receiver_id}})
    const  transaction_id=await logTransaction(senderAccount.id, receiverAccount.id,sender_id,receiver_id, amount, transaction_type,status,message);
    const data=await this.getTransactionInfo(transaction_id)
    return {message:"successful operation",verified:true,data};
  } else {
    return {message:"Insufficent Balance operation",verified:false};;
  }
 

}

async function updateAccountBalance(id,amount,method){
    const customer=await user.findByPk(id);
    const userAccount=await account.findByPk(customer.account_id)
  switch (method) {
    case "deduct":
        const senderBalance=parseFloat(userAccount.balance)-parseFloat(amount);
        console.log(parseFloat(userAccount.balance)-parseFloat(amount))
        console.log(senderBalance)
        console.log(senderBalance,'balance')
        userAccount.balance=parseFloat(senderBalance);
        await userAccount.save()
        break;
    case "add":
  const receiverBalance=parseFloat(userAccount.balance)+parseFloat(amount);
  console.log(receiverBalance,'reciver')
        userAccount.balance=parseFloat(receiverBalance);
      await  userAccount.save()
        break;
    default:
         "No method provided";
  }

}

async function senderHasSufficientBalance(sender_id,amount){
         const sender=await user.findByPk(sender_id);
    if(sender ){
      
      const sender_account= await account.findByPk(sender.account_id);
      if(sender_account){
        if(parseFloat(sender_account.balance)>parseFloat(amount)){
          
          return true;
        }else {
            return false
        }
  }
 }
 return false
 }


async function logTransaction(senderAccountId,receiverAccountId,sender_id,receiver_id,amount,type,status,message){
  
  try {
    // Insert a record for the sender's transaction
  const senderTransactionInfo=  await transaction.create({
      senderAccountId,
      receiverAccountId,
      amount: amount, 
      transaction_type:type,
      status:status,
      message,
      sender_id,
      receiver_id,
      userId:sender_id,
    });
   console.log(senderTransactionInfo,'sender tr')
    // Insert a record for the receiver's transaction
    await transaction.create({
      receiverAccountId:receiverAccountId,
      senderAccountId,
      amount: amount,
      transaction_type: 'Deposit', // Assuming the receiver's side is always a deposit
      status,
      message,
       sender_id,
      receiver_id,
      userId:receiver_id
    });
    console.log('Transactions logged successfully.');
     return await senderTransactionInfo.id
  } catch (error) {
    console.error('Error logging transactions:', error);
  }
}
 module.exports.getTransactionInfo =async function getTransactionInfo(transactionId){
 
  try {
    const transactionInfo=await transaction.findByPk(transactionId);
    const receiver=await user.findByPk(transactionInfo.receiver_id);
   return {transactionInfo,receiverName:receiver.firstName+" "+receiver.middleName+" "+receiver.lastName}
  } catch (error) {
      return null

  }
}
































// const {amount,sender_id,receiver_id,transaction_type,status}=req.body;
//    const sender=await user.findByPk(sender_id,{include:[account]});
//    const receiver=await user.findByPk(receiver_id,{include:[account]});
//     if(sender && receiver){
//       const sender_account= await account.findByPk(sender.account.id);
//         const receiver_account= await account.findByPk(receiver.account.id);
//       if(sender_account && receiver_account){
//         if(sender_account.balance<amount){
//           res.status(422).json({message:"Inefficient amount"})
//         }else{
//          const senderUpdatedBalance= sender_account.balance-parseFloat(amount);
//           sender_account.balance=senderUpdatedBalance;
//           await sender_account.save();
//           const receiverBalance= parseFloat(parseFloat(receiver_account.balance)+parseFloat(amount))
//           console.log(receiverBalance,'receiver b')
//           receiver_account.balance=parseFloat(receiverBalance);
//           await receiver_account.save(); 
//            res.status(200).json({message:"deposited successfully",sender:sender.username,receiver:receiver.username,senderCurrentBalance:sender_account.balance,receiverCurrentBalance:receiver_account.balance})
//            console.log(req.user,'user')
//            const transactionDeposit=await transaction.create({amount:amount,user_id:req.user.userId,sender_id,receiver_id,transaction_type:transaction_type,status:"completed",createdAt:"2023-09-03"})
//                await transactionDeposit.save();
               
//           }

//       }else {
//         res.status(404).json({message:"Error in the server or No Accounts showing"})
//       }
//     }

//   next()