const SoilReport = require('../models/SoilReport');
const { getAIResponse } = require('../services/aiService');

exports.getReports = async (req, res) => {
  try {
    const reports = await SoilReport.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLatestReport = async (req, res) => {
  try {
    const report = await SoilReport.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createReport = async (req, res) => {
  try {
    const { ph, nitrogen, phosphorus, potassium, organicMatter, moisture, fieldName } = req.body;
    if (!ph || !nitrogen || !phosphorus || !potassium) return res.status(400).json({ message: 'pH, N, P, K values are required' });
    const prompt = `Soil analysis: pH=${ph}, N=${nitrogen}kg/ha, P=${phosphorus}kg/ha, K=${potassium}kg/ha, Organic Matter=${organicMatter || 0}%. Give specific fertilizer recommendations, amendments needed, and suitable crops for this soil. Be concise.`;
    const aiRecommendation = await getAIResponse([{ role: 'user', content: prompt }]);
    const report = await SoilReport.create({ userId: req.user.id, ph, nitrogen, phosphorus, potassium, organicMatter, moisture, fieldName, aiRecommendation });
    res.status(201).json(report);
  } catch (err) { res.status(500).json({ message: err.message || 'Soil analysis failed' }); }
};

exports.deleteReport = async (req, res) => {
  try {
    await SoilReport.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
