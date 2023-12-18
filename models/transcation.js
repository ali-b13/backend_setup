'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate({ user, account }) {
      // Each transaction has a sender account
      this.belongsTo(account, {
        foreignKey: 'senderAccountId',
        as: 'senderAccount',
      });

      // Each transaction has a receiver account
      this.belongsTo(account, {
        foreignKey: 'receiverAccountId',
        as: 'receiverAccount',
      });

      // Each transaction is associated with a user (through sender account)
      this.belongsTo(user, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Transaction.init(
    {
      id: {
        type:DataTypes.UUID,
     defaultValue:DataTypes.UUIDV4,
        primaryKey: true
        
      },
      amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: 'Pending' },
      transaction_type: DataTypes.STRING,
      sender_id:DataTypes.STRING,
      receiver_id:DataTypes.STRING,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'transaction',
    }
  );

  return Transaction;
};
