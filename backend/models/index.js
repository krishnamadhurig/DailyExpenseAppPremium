const sequelize = require('../config/db');
const User = require('./User');
const Expense = require('./Expense');

module.exports = { sequelize, User, Expense };