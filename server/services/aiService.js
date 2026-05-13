const { groq, AI_PROVIDER, AI_MODEL } = require('../config/openai');
const Alert = require('../models/Alert');

const SYSTEM_PROMPT_EN = `You are KrishiAI, an expert agricultural advisor for Indian farmers. You have deep knowledge of Indian crops (paddy, wheat, cotton, sugarcane, vegetables), regional pests, soil types, government schemes, and local farming practices. Always give practical, actionable advice with specific dosages, timing, and locally available solutions. Be concise but complete. If the farmer mentions a location, tailor advice to that region's climate. After your main answer, suggest 2-3 follow-up questions the farmer might ask, formatted as JSON at the end like: {"suggestions":["question1","question2","question3"]}`;

const SYSTEM_PROMPT_TA = `நீங்கள் KrishiAI, இந்திய விவசாயிகளுக்கான நிபுணர் விவசாய ஆலோசகர். உங்களுக்கு இந்திய பயிர்கள் (நெல், கோதுமை, பருத்தி, கரும்பு, காய்கறிகள்), பூச்சிகள், மண் வகைகள், அரசு திட்டங்கள் மற்றும் உள்ளூர் விவசாய நடைமுறைகள் பற்றி ஆழமான அறிவு உள்ளது. எப்போதும் குறிப்பிட்ட அளவுகள், நேரம் மற்றும் உள்ளூரில் கிடைக்கும் தீர்வுகளுடன் நடைமுறை ஆலோசனை வழங்கவும். சுருக்கமாக ஆனால் முழுமையாக பதிலளிக்கவும். விவசாயி ஒரு இடத்தை குறிப்பிட்டால், அந்த பகுதியின் காலநிலைக்கு ஏற்ப ஆலோசனை வழங்கவும். உங்கள் பதிலுக்கு பிறகு, விவசாயி கேட்கக்கூடிய 2-3 தொடர்ச்சியான கேள்விகளை இந்த JSON வடிவத்தில் இறுதியில் சேர்க்கவும்: {"suggestions":["கேள்வி1","கேள்வி2","கேள்வி3"]}. எல்லா பதில்களும் தமிழிலேயே இருக்க வேண்டும்.`;

const getSystemPrompt = (lang) => lang === 'ta' ? SYSTEM_PROMPT_TA : SYSTEM_PROMPT_EN;

const URGENCY_KEYWORDS = ['disease', 'pest', 'drought', 'flood', 'attack', 'dying', 'wilting', 'blight', 'fungus', 'infestation', 'நோய்', 'பூச்சி', 'வறட்சி', 'रोग', 'कीट', 'सूखा'];

const detectUrgency = (text) =>
  URGENCY_KEYWORDS.some(kw => text.toLowerCase().includes(kw));

const extractSuggestions = (content) => {
  try {
    const match = content.match(/\{"suggestions":\s*\[.*?\]\}/s);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return { cleanContent: content.replace(match[0], '').trim(), suggestions: parsed.suggestions };
    }
  } catch {}
  return { cleanContent: content, suggestions: [] };
};

const buildLocalAdvice = (messages, lang = 'en') => {
  if (lang === 'ta') {
    return {
      content: 'இன்று வயல் கண்காணிப்பு தொடங்குங்கள்: 4 மூலைகள் மற்றும் மையத்தில் 20 செடிகளை ஆய்வு செய்யுங்கள்.\n\nஅடுத்த படிகள்:\n1) பயிர் பெயர், நிலை மற்றும் இடத்தை தெரிவிக்கவும்.\n2) பாதிக்கப்பட்ட இலைகளின் புகைப்படங்களை பகிரவும்.\n3) கடந்த 10 நாட்களில் பயன்படுத்திய மருந்துகளை தெரிவிக்கவும்.',
      suggestions: ['இது பூச்சியா அல்லது நோயா என்று எப்படி உறுதிப்படுத்துவது?', 'ஒரு ஏக்கருக்கு சரியான அளவு என்ன?', 'அடுத்த 3 நாட்களில் என்ன செய்ய வேண்டும்?'],
    };
  }
  return {
    content: 'Start with field scouting today: inspect 20 plants across 4 corners and the center.\n\nNext steps:\n1) Share crop name, stage, and location.\n2) Share photos of affected leaves/stems.\n3) Tell me what spray/fertilizer was used in last 10 days.',
    suggestions: ['How do I confirm if this is pest or disease?', 'What exact dosage should I use per acre?', 'What should I do in the next 3 days?'],
  };
};

const sendSSE = (res, data) => {
  if (!res.writableEnded) res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const streamAIResponse = async (messages, userId, cropId, res, lang = 'en') => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const systemPrompt = getSystemPrompt(lang);

  if (AI_PROVIDER === 'local') {
    const local = buildLocalAdvice(messages, lang);
    sendSSE(res, { delta: local.content });
    sendSSE(res, { done: true, suggestions: local.suggestions, fullContent: local.content });
    res.end();
    return local.content;
  }

  let fullContent = '';
  try {
    const stream = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) { fullContent += delta; sendSSE(res, { delta }); }
    }

    const { cleanContent, suggestions } = extractSuggestions(fullContent);

    if (detectUrgency(messages[messages.length - 1]?.content || '')) {
      Alert.create({
        userId,
        type: 'pest',
        severity: 'warning',
        message: `Urgent query: ${messages[messages.length - 1].content.substring(0, 100)}`,
        cropId: cropId || undefined,
      }).catch(() => {});
    }

    sendSSE(res, { done: true, suggestions, fullContent: cleanContent });
    res.end();
    return cleanContent;

  } catch (err) {
    console.error('Groq stream error:', err?.message || err);
    const fallback = buildLocalAdvice(messages, lang);
    sendSSE(res, { delta: fallback.content });
    sendSSE(res, { done: true, suggestions: fallback.suggestions, fullContent: fallback.content });
    if (!res.writableEnded) res.end();
    return fallback.content;
  }
};

const getAIResponse = async (messages, lang = 'en') => {
  const systemPrompt = getSystemPrompt(lang);
  if (AI_PROVIDER === 'local') return buildLocalAdvice(messages, lang).content;
  try {
    const response = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 600,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (err) {
    console.error('Groq getAIResponse error:', err?.message);
    return buildLocalAdvice(messages, lang).content;
  }
};

module.exports = { streamAIResponse, getAIResponse, extractSuggestions };
