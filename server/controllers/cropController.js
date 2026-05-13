const Crop = require('../models/Crop');

exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getCrop = async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user.id });
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createCrop = async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, userId: req.user.id });
    res.status(201).json(crop);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true, runValidators: true });
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateStage = async (req, res) => {
  try {
    const { stage, note } = req.body;
    if (!stage) return res.status(400).json({ message: 'Stage is required' });
    const crop = await Crop.findOne({ _id: req.params.id, userId: req.user.id });
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    crop.stageHistory.push({ stage: crop.currentStage, date: new Date(), note: note || '' });
    crop.currentStage = stage;
    await crop.save();
    res.json(crop);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteCrop = async (req, res) => {
  try {
    await Crop.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
