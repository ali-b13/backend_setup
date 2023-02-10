const {Sequelize}=require('sequelize');
const sequelize=new Sequelize('booking_db','root','alib13',{host:"localhost",dialect:'mysql'});
sequelize.authenticate().then(()=>{
  console.log("connection successful")
}).catch((err)=>console.log(err))

module.exports=sequelize