const Groq = require('groq-sdk');

const AI_PROVIDER = (process.env.AI_PROVIDER || 'groq').toLowerCase();

// Groq models: llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768, gemma2-9b-it
const AI_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = { groq, AI_PROVIDER, AI_MODEL };
