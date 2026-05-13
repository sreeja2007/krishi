const MarketPrice = require('../models/MarketPrice');

exports.getPrices = async (req, res) => {
  try {
    const { state, crop } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (crop) filter.crop = new RegExp(crop, 'i');
    const prices = await MarketPrice.find(filter).sort({ date: -1 });
    res.json(prices);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getLatestPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.aggregate([
      { $sort: { date: -1 } },
      { $group: { _id: '$crop', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { crop: 1 } },
    ]);
    res.json(prices);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createPrice = async (req, res) => {
  try {
    const price = await MarketPrice.create(req.body);
    res.status(201).json(price);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
