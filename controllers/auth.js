const { Op } = require('sequelize');
const {user,account,branch}=require('../models');
const jwt=require('jsonwebtoken')
module.exports.signup=async (req,res,next)=>{
  console.log(req.body);
  try {
    let client=await user.findOne({where:{username:req.body.username}})
  if(client){
    return res.status(422).json({message:"user already exists"})
  }
  client=await user.create(req.body);
  const branchInfo={branch_name:"Tolichowki",branch_code:"Hyd_211"}
  const branch_account= await branch.create(branchInfo)
  const account_branch= await branch.findOne({where:{branch_id:branch_account.branch_id}})
  console.log(account_branch,'branch')
  const client_Account= await account.create({account_type:req.body.accountType,branch_id:account_branch.branch_id,user_id:client.uuid})
   client.account_id=client_Account.id
  await client.save()
   res.status(201).json({message:"created successfully",client_Account})
  next()
  } catch (error) {
    res.status(422).json({message:error.message})
  }
}
module.exports.signIn=async(req,res,next)=>{
  console.log(req.body,'body')
  const {username,password}=req.body
  const client=await user.findOne({where:{username:username,password:password}})
  if(!client){
    return res.status(403).json({message:"user not found"})
  }
  
  const token=jwt.sign({userId:client.uuid,isLoggedIn:true},process.env.ACCESS_JWT_TOKEN_SECRET,{expiresIn:"365d"})
  res.status(201).json({message:"request successful",client,token})
  next()
}

module.exports.deleteAccount=async(req,res,next)=>{
  const employeeWithDepartment=await department.findAll({
    include:[
      {
        model:employee,
      }
    ]
  })
  res.status(202).json({message:"successful",employeeWithDepartment})
}