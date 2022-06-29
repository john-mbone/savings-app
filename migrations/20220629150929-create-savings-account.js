'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savings_accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_description: {
        type: Sequelize.STRING(250)
      },
      member_id: {
        type: Sequelize.INTEGER
      },
      account_balance: {
        type: Sequelize.FLOAT
      },
      total_deposits_derived: {
        type: Sequelize.FLOAT
      },
      total_withdrawals_derived: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('savings_accounts');
  }
};