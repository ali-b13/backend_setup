const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth')
router.post('/signup',authController.signup)
router.post('/signIn',authController.signIn)
router.delete('/deleteME',authController.deleteAccount)
module.exports=router