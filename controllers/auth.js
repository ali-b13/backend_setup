const { Op } = require('sequelize');
const {employee,department}=require('../models')
module.exports.signup=async (req,res,next)=>{
  console.log(req.body);
  const user=await employee.findOne({where:{firstName:req.body.firstName}})
  if(user){
    return res.status(422).json({message:"user already exists"})
  }
  const createdUser= await employee.create(req.body);
  const allRows= await employee.findAndCountAll({
    where:{
      firstName:{
        [Op.like]:"w%"
      }
    },
    offset:0,
    limit:4
  })
  console.log(allRows)
  res.status(200).send({message:"successful",user:createdUser})
  next()
}
module.exports.signIn=async(req,res,next)=>{
  console.log(req.body)
  const {username,password}=req.body
  const user=await employee.findOne({where:{firstName:username,lastName:password}})
  if(!user){
    return res.status(403).json({message:"user not found"})
  }
  res.status(201).json({message:"request successful",user})
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