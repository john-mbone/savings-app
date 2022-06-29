'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class savings_account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ members }) {
      // define association here
      this.belongsTo(members, {
        foreignKey: 'member_id',
        as: 'member'
      })
    }
  }
  savings_account.init({
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    account_balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    account_description: {
      type: DataTypes.STRING(250),
      defaultValue: '',
      allowNull: true
    },
    total_deposits_derived: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    total_withdrawals_derived: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'savings_account',
  });
  return savings_account;
};