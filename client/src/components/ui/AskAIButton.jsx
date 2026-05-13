import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AskAIButton() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/queries', {});
      navigate(`/chat/${data._id}`, { state: { initialMessage: question } });
      setOpen(false);
      setQuestion('');
    } catch {
      toast.error('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed bottom-20 right-5 z-50 w-80 card border-forest-200"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-heading font-semibold text-forest-700">Quick Ask KrishiAI</p>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAsk} className="flex gap-2">
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask about crops, pests, soil..."
                className="input flex-1 text-sm"
                autoFocus
              />
              <button type="submit" disabled={loading || !question.trim()} className="btn-primary px-3 py-2.5">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-gradient-to-br from-forest-700 to-forest-600 text-white rounded-2xl flex items-center justify-center hover:from-forest-800 hover:to-forest-700 transition-colors"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </motion.button>
    </>
  );
}
