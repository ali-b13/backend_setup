const express=require('express');
const router=express.Router();
const successAndFailController=require('../controllers/successAndFail')
router.get('/transfer/success/:transaction_id',successAndFailController.getSuccessPage)
router.get('/transfer/error/:error',successAndFailController.getFailPage)

module.exports=router