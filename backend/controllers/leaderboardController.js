const { User, Expense } = require('../models');
const { Sequelize } = require('sequelize');

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Expense.findAll({
      attributes: [
        'UserId',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
      ],
      group: ['UserId'],
      include: [{ model: User, attributes: ['name'] }],
      order: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'DESC']]
    });
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};