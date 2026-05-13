import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, sub, color = 'forest', delay = 0 }) {
  const colors = {
    forest: 'bg-forest-50 text-forest-700',
    amber:  'bg-amber-50 text-amber-600',
    blue:   'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="card hover:border-forest-200 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-heading font-semibold text-gray-800 mt-1">{value}</p>
          {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
