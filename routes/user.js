const express=require('express');
const router=express.Router();
const userController=require('../controllers/user')
router.get('/getUserInfo',userController.getUserInfo)
router.get("/getUserAccount",userController.getUserAccount)
module.exports=router