import { Wheat } from 'lucide-react';
import { formatRelative } from '../../utils/formatDate';
import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-5">
      <div className="w-9 h-9 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Wheat size={16} className="text-forest-700" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-2 h-2 bg-forest-400 rounded-full animate-pulse-dot"
              style={{ animationDelay: `${i * 0.16}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-3 mb-5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-9 h-9 bg-forest-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Wheat size={16} className="text-forest-700" />
        </div>
      )}
      <div className={`max-w-[75%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-3.5 rounded-2xl text-base leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-forest-700 text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
        }`}>
          {message.content}
        </div>
        <span className="text-xs text-gray-400 px-1">{formatRelative(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}
