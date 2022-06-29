'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }

    toJSON() {
      return { ...this.get(), updatedAt: undefined }
    }
  }
  members.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      get() {
        const rawValue = this.getDataValue('username');
        return rawValue ? rawValue.toLowerCase() : '';
      },
      set(value) {
        this.setDataValue('username', value.toLowerCase());
      }
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'members',
  });
  return members;
};