const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, location, farmSize, preferredLanguage } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: 'Name, phone, and password are required' });
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Phone number already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, email, password: hashed, location, farmSize, preferredLanguage });
    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, location: user.location } });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: 'Phone and password are required' });
    const user = await User.findOne({ phone });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: generateToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, location: user.location, farmSize: user.farmSize, preferredLanguage: user.preferredLanguage } });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = (({ name, email, location, farmSize, preferredLanguage }) => ({ name, email, location, farmSize, preferredLanguage }))(req.body);
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
