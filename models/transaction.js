'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ savings_account }) {
      // define association here
      this.belongsTo(savings_account, {
        foreignKey: 'savings_id',
        as: 'account'
      })
    }
    
  }
  transaction.init({
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    savings_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    narration: {
      allowNull: true,
      defaultValue: '',
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};