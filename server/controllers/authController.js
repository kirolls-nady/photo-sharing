const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'كلمات المرور غير متطابقة' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, secret, { expiresIn });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'فشل في إنشاء الحساب', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'بيانات الاعتماد غير صحيحة' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات الاعتماد غير صحيحة' });
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'فشل في تسجيل الدخول', error: err.message });
  }
};