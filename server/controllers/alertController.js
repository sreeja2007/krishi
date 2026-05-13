const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Alert.countDocuments({ userId: req.user.id, read: false });
    res.json({ count });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await Alert.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAllRead = async (req, res) => {
  try {
    await Alert.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteAlert = async (req, res) => {
  try {
    await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
