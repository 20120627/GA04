const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '3541871.png'
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false 
  });

  return User;
};