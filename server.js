const express=require('express');
const cors=require('cors');
const path=require('path')
const app=express();
require('dotenv').config()
app.use(express.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('public', path.join(__dirname, '/views'));
const port=process.env.PORT||2400;
const Authentication=require("./middleware/Authentication")
const signupRouter=require('./routes/authrouter')
const userRouter=require('./routes/user')
const transferRouter=require('./routes/transfer')
const getPages=require('./routes/getPages')
app.use(signupRouter);
app.use("/user",Authentication.isAuth,userRouter);
app.use("/money",Authentication.isAuth,transferRouter)
app.use('/transaction',getPages)
app.use((error,req,res,next)=>{
  console.log(error.message,error.status)
  next()
})

const {sequelize}=require('./models');



app.listen(port,async()=>{
  console.log("server is listening on",port)
  await sequelize.sync();
})