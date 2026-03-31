const { Expense, User } = require('../models');

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expense = await Expense.create({
      amount, description, category, UserId: req.user.id
    });
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { UserId: req.user.id }, order: [['createdAt','DESC']] });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id, UserId: req.user.id } });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};