'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({user}) {
       this.belongsTo(user,{foreignKey:"user_id"})
    }
  }
  otp.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    email_id:DataTypes.STRING,
    otp_number:DataTypes.INTEGER,
    expiration_time:{type:DataTypes.DATE}
  }, {
    sequelize,
    modelName: 'otp',
  });
  return otp;
};