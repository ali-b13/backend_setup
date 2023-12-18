'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class account extends Model {

    static associate({user,branch}) {
     this.hasOne(user,{foreignKey:"account_id"})
     this.belongsTo(branch,{foreignKey:"branch_id"})
    }
  }
 Model.prototype.toJSON=function(){
  return {...this.get()}
 }
  account.init({
    id:{
      type:DataTypes.UUID,
     defaultValue:DataTypes.UUIDV4,
     primaryKey:true
    },
    account_number:{type:DataTypes.UUID,allowNull:false},
    account_type:{type:DataTypes.STRING,allowNull:false},
    balance:{type:DataTypes.DECIMAL(10,2),defaultValue:0.00,allowNull:false}
  }, {
    sequelize,
    modelName: 'account',
  });
  return account;
};