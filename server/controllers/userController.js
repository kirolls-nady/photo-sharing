const User = require('../models/User');

exports.getUserImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'فشل في جلب الصور', error: err.message });
  }
};