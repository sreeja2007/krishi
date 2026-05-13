import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Send, Plus, Trash2, MessageSquare, Wheat } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import MessageBubble, { TypingIndicator } from '../components/chat/MessageBubble';
import SuggestedQuestions from '../components/chat/SuggestedQuestions';
import { useLang } from '../context/LangContext';

const STARTER_QUESTIONS = {
  en: [
    'My paddy leaves are turning yellow. What should I do?',
    'Best fertilizer schedule for wheat in Punjab?',
    'How to control bollworm in cotton organically?',
    'What crops are suitable for black soil in Maharashtra?',
    'Signs of nitrogen deficiency in sugarcane?',
    'When to irrigate tomatoes for maximum yield?',
  ],
  ta: [
    'என் நெல் இலைகள் மஞ்சளாக மாறுகின்றன. என்ன செய்வது?',
    'கோதுமைக்கு சிறந்த உர அட்டவணை என்ன?',
    'பருத்தியில் காய்ப்புழுவை இயற்கையாக கட்டுப்படுத்துவது எப்படி?',
    'தமிழ்நாட்டில் கருப்பு மண்ணுக்கு ஏற்ற பயிர்கள் எவை?',
    'கரும்பில் நைட்ரஜன் குறைபாட்டின் அறிகுறிகள் என்ன?',
    'தக்காளிக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?',
  ],
};

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { t, lang } = useLang();

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => {
    if (id) loadConversation(id);
    else { setActiveConv(null); setMessages([]); setSuggestions([]); }
  }, [id]);
  useEffect(() => {
    if (location.state?.initialMessage && activeConv) {
      sendMessage(location.state.initialMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [activeConv]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streamingContent]);

  const loadConversations = async () => {
    try { const { data } = await api.get('/queries'); setConversations(data); } catch {}
  };
  const loadConversation = async (convId) => {
    try {
      const { data } = await api.get(`/queries/${convId}`);
      setActiveConv(data); setMessages(data.messages); setSuggestions([]);
    } catch { toast.error('Failed to load conversation'); }
  };
  const newConversation = async () => {
    try {
      const { data } = await api.post('/queries', {});
      setConversations(prev => [data, ...prev]);
      navigate(`/chat/${data._id}`);
    } catch { toast.error('Failed to create conversation'); }
  };
  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/queries/${convId}`);
      setConversations(prev => prev.filter(c => c._id !== convId));
      if (id === convId) navigate('/chat');
    } catch { toast.error('Failed to delete'); }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || streaming) return;
    setInput(''); setSuggestions([]);

    let convId = id;
    if (!convId) {
      const { data } = await api.post('/queries', {});
      convId = data._id;
      setConversations(prev => [data, ...prev]);
      navigate(`/chat/${convId}`, { replace: true });
      setActiveConv(data);
    }

    setMessages(prev => [...prev, { role: 'user', content: msg, timestamp: new Date() }]);
    setStreaming(true); setStreamingContent('');

    try {
      const token = localStorage.getItem('token');
      const BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${BASE}/api/queries/${convId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: msg, lang }),
      });
      if (!response.ok || !response.body) {
        let errMsg = 'Unable to get AI response';
        try { const d = await response.json(); if (d?.message) errMsg = d.message; } catch {}
        throw new Error(errMsg);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '', finalSuggestions = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.delta) { fullContent += parsed.delta; setStreamingContent(fullContent); }
            if (parsed.done) { finalSuggestions = parsed.suggestions || []; fullContent = parsed.fullContent || fullContent; }
          } catch {}
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: fullContent, timestamp: new Date() }]);
      setSuggestions(finalSuggestions);
      loadConversations();
    } catch (err) { toast.error(err.message || 'Failed to get AI response'); }
    finally { setStreaming(false); setStreamingContent(''); }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-100 flex flex-col bg-gray-50`}>
        <div className="p-4 border-b border-gray-100">
          <button onClick={newConversation} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={18} /> {t('newChat')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => (
            <div key={conv._id} onClick={() => navigate(`/chat/${conv._id}`)}
              className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-colors ${id === conv._id ? 'bg-forest-100 text-forest-800' : 'hover:bg-gray-100 text-gray-600'}`}>
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare size={15} className="flex-shrink-0" />
                <span className="text-sm truncate">{conv.title || 'New conversation'}</span>
              </div>
              <button onClick={(e) => deleteConversation(conv._id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-0.5">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-white">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100">
            <MessageSquare size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-forest-100 rounded-full flex items-center justify-center">
              <Wheat size={18} className="text-forest-700" />
            </div>
            <div>
              <p className="font-semibold text-base text-gray-800">KrishiAI Assistant</p>
              <p className="text-sm text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />{t('onlineGroq')}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && !streaming && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-forest-50 rounded-2xl flex items-center justify-center mb-5">
                <Wheat size={40} className="text-forest-700" />
              </div>
              <h3 className="font-heading font-semibold text-gray-700 text-2xl mb-2">{t('askAnything')}</h3>
              <p className="text-gray-400 text-base mb-8 max-w-sm">{t('chatDesc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {(STARTER_QUESTIONS[lang] || STARTER_QUESTIONS.en).map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-left text-sm bg-forest-50 text-forest-700 border border-forest-100 px-4 py-3 rounded-xl hover:bg-forest-100 transition-colors leading-snug">
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
          {streaming && (streamingContent
            ? <MessageBubble message={{ role: 'assistant', content: streamingContent, timestamp: new Date() }} />
            : <TypingIndicator />
          )}
          <div ref={bottomRef} />
        </div>

        <SuggestedQuestions questions={suggestions} onSelect={sendMessage} />

        {/* Input */}
        <div className="px-6 py-5 border-t border-gray-100 bg-white">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              placeholder={t('askPlaceholder')}
              className="input flex-1 text-base" disabled={streaming} />
            <button type="submit" disabled={streaming || !input.trim()}
              className="btn-primary px-5 flex items-center gap-2">
              <Send size={18} />
              <span className="hidden sm:inline">{t('send')}</span>
            </button>
          </form>
          <p className="text-xs text-gray-300 text-center mt-2">{t('disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
