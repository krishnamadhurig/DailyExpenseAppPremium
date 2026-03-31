// controllers/premiumController.js
const { User } = require('../models');

exports.buyPremium = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 1000) {
      return res.status(400).json({ message: "Pay at least 1000 to become premium" });
    }

    // Find the user from JWT
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mark user as premium
    user.isPremium = true;
    await user.save();

    return res.json({ message: "You are now a premium user!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};