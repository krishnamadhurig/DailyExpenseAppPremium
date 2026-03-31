const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Expense = sequelize.define('Expense', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  category: { 
    type: DataTypes.ENUM('food','salary','vocation','shopping','fuel','other'), 
    allowNull: false 
  }
});

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = Expense;