const express=require('express');
const router=express.Router();
const userController=require('../controllers/transfer.js')
const otp=require('../controllers/verifyOtp.js')
router.post('/transaction/deposit',userController.deposit)
// router.post('/transaction/transfer',userController.transferMoney);
router.post("/transaction/getOtp",otp.generateOtp)
router.post("/transaction/verifyOtp",otp.verfiyOtp)
module.exports=router
