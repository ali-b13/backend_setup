
const jwt=require('jsonwebtoken')
module.exports.isAuth=async(req,res,next)=>{
  try {
    const authHeader=req.headers["authorization"]
  const token=authHeader.split(' ')[1]
  if(!token){
    const error=new Error("No Token is provided")
    error.status=422;
    throw error
  } 
    jwt.verify(token,process.env.ACCESS_JWT_TOKEN_SECRET,(err,user)=>{
      if(err){
        const error=new Error("The Token is invalid")
        error.status=422;
        throw error
      }
      console.log(user,'user from token')
      req.user=user
      next()
    })
  } catch (error) {
     return res.status(404).json({message:"Wrong jwt token or not available"})
  }
}