const express=require('express');
const cors=require('cors');
const app=express();
app.use(express.json())
app.use(cors());
const port=process.env.PORT||2400;
const signupRouter=require('./routes/authrouter')
app.use(signupRouter);


const {sequelize}=require('./models');



app.listen(port,async()=>{
  console.log("server is listening on",port)
  await sequelize.sync();
})