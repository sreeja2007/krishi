const Query = require('../models/Query');
const { streamAIResponse } = require('../services/aiService');

exports.getConversations = async (req, res) => {
  try {
    const queries = await Query.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('title resolved createdAt updatedAt messages');
    res.json(queries);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getConversation = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.user.id });
    if (!query) return res.status(404).json({ message: 'Conversation not found' });
    res.json(query);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createConversation = async (req, res) => {
  try {
    const query = await Query.create({ userId: req.user.id, messages: [], cropContext: req.body.cropContext || '' });
    res.status(201).json(query);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.sendMessage = async (req, res) => {
  const { message, cropId, lang } = req.body;

  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.user.id });
    if (!query) return res.status(404).json({ message: 'Conversation not found' });
    if (!message || !String(message).trim()) return res.status(400).json({ message: 'Message is required' });

    // Save user message
    query.messages.push({ role: 'user', content: message });
    if (query.messages.length === 1) query.title = message.substring(0, 60);
    await query.save();

    // Build history for AI (all messages so far)
    const historyForAI = query.messages.map(m => ({ role: m.role, content: m.content }));

    // Stream response — this writes SSE and ends the response
    const fullContent = await streamAIResponse(historyForAI, req.user.id, cropId, res, lang || 'en');

    // Save AI reply in background after response is sent
    if (fullContent) {
      Query.findByIdAndUpdate(query._id, {
        $push: { messages: { role: 'assistant', content: fullContent } }
      }).catch(err => console.error('Failed to save AI message:', err.message));
    }

  } catch (err) {
    console.error('sendMessage error:', err.message);
    if (!res.headersSent) {
      return res.status(500).json({ message: err.message || 'Failed to process message' });
    }
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ done: true, suggestions: [], fullContent: 'Sorry, something went wrong. Please try again.' })}\n\n`);
      res.end();
    }
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    await Query.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Query.countDocuments({ userId: req.user.id });
    const resolved = await Query.countDocuments({ userId: req.user.id, resolved: true });
    res.json({ total, resolved });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
