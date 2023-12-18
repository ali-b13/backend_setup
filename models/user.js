'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {

    static associate({account}) {
     this.hasOne(account,{foreignKey:"user_id"})
    }
  }
 Model.prototype.toJSON=function(){
  return {...this.get()}
 }
  user.init({
    uuid:{
      type:DataTypes.UUID,
     defaultValue:DataTypes.UUIDV4,
     primaryKey:true
    },
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    username:DataTypes.STRING,
    email:DataTypes.STRING,
    phone_number:DataTypes.INTEGER,
    age:{type:DataTypes.INTEGER,defaultValue:null},
    country: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};