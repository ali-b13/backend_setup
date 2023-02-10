'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class employee extends Model {

    static associate({department}) {
     this.hasOne(department,{foreignKey:"depId"})
    }
  }
 Model.prototype.toJSON=function(){
  return {...this.get(),id:undefined,password:undefined}
 }
  employee.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username:DataTypes.STRING,
    mobileNo: DataTypes.INTEGER,
    country: DataTypes.STRING,
    departmentId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'employee',
  });
  return employee;
};