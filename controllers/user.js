const {user,account,transaction} = require("../models");
const {Sequelize}=require('sequelize');
const sequelize=require('sequelize');




module.exports.getUserInfo=async(req,res,next)=>{
  
       const client=await user.findByPk(req.user.userId);
      
       if(!client){
       return res.status(403).json({message:"Error while fetching user "})
       }
    
       const client_account=await account.findByPk(client.account_id);
       if(!client_account){
      return  res.status(403).json({message:"Error while fetching user Account "})
       }
   
      const receivedTransactions=await transaction.sequelize.query(`SELECT 
        DATE_FORMAT(t.createdAt, '%Y-%m') AS formatted_date,
        SUM(t.amount) AS total,
        t.transaction_type as transaction_type

    FROM 
        transactions t
      WHERE 
        t.receiver_id = :user_id and t.userId=:user_id
    GROUP BY 
        formatted_date,transaction_type
    ORDER BY 
        formatted_date; `,{ type: sequelize.QueryTypes.SELECT,replacements:{user_id:req.user.userId} })
      
        const sentTransactions=await transaction.sequelize.query(`SELECT 
        DATE_FORMAT(t.createdAt, '%Y-%m') AS formatted_date,
        SUM(t.amount) AS total,
        t.transaction_type as transaction_type

    FROM 
        transactions t
      WHERE 
        t.sender_id = :user_id and t.userId=:user_id
    GROUP BY 
        formatted_date,transaction_type
    ORDER BY 
        formatted_date; `,{ type: sequelize.QueryTypes.SELECT,replacements:{user_id:req.user.userId} })
     const user_chart_data = [...sentTransactions, ...receivedTransactions];
          console.log(user_chart_data,'daa')
     
       const user_transactions = await transaction.sequelize.query(`
    SELECT 
        t.createdAt as date,
        t.amount as amount,
        t.transaction_type,
        t.id as id,
        t.status as status,
        u.firstName as receiver,
        s.firstName as sender
        
    FROM 
        transactions t
    INNER JOIN 
        users u  ON u.uuid=t.receiver_id
        INNER JOIN users s on s.uuid=t.sender_id
   
    WHERE 
        t.userId= :user_id 
     ORDER BY date;
    
`, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { user_id: req.user.userId }
});

const transfers= await transaction.sequelize.query(`
      SELECT CONCAT(r.firstName, ' ', r.lastName) AS full_name,
          r.uuid AS id,
          a.account_number
    FROM users u
    INNER JOIN accounts a ON u.uuid = a.user_id
    INNER JOIN transactions t ON u.uuid = t.sender_id
    INNER JOIN users r ON r.uuid = t.receiver_id
    WHERE u.uuid = :user_id
    GROUP BY r.uuid, full_name, a.account_number
    ORDER BY SUM(t.amount) DESC
    LIMIT 3;
       
    
`, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { user_id: req.user.userId }
});
console.log(transfers)
      res.status(200).json({message:"fetched successfully",transfers,user:client,account:client_account,user_transactions,user_chart_data})
      next()
}




module.exports.getUserAccount=async(req,res)=>{

  const receiverAccount=await account.findOne({where:{account_number:req.query.account_number}});
  
  if(receiverAccount){
    const receiver=await user.findByPk(receiverAccount.user_id);

    return res.status(200).json({message:" got it",id:receiver.uuid,account_number:receiverAccount.account_number,fullName:receiver.firstName+" "+receiver.middleName+" "+receiver.lastName})
  }else {
    res.status(404).json({message:" No account found",error:"No Account Found associated with this number"})
  }
}