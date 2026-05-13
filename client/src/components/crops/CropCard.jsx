import { motion } from 'framer-motion';
import { Calendar, MapPin, Edit2, Trash2 } from 'lucide-react';
import { STAGE_LABELS, STAGE_COLORS, CROP_ICONS, getStageProgress, getAllStages } from '../../utils/getCropStage';
import { formatDate } from '../../utils/formatDate';

export default function CropCard({ crop, onEdit, onDelete, delay = 0 }) {
  const stages = getAllStages();
  const currentIdx = stages.indexOf(crop.currentStage);
  const progress = getStageProgress(crop.currentStage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="card hover:border-forest-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{CROP_ICONS[crop.name] || '🌱'}</span>
          <div>
            <h3 className="font-heading font-semibold text-gray-800">{crop.name}</h3>
            <p className="text-xs text-gray-400">{crop.variety || 'Standard variety'}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(crop)} className="p-1.5 text-gray-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(crop._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
        <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(crop.sowingDate)}</span>
        <span className="flex items-center gap-1"><MapPin size={12} />{crop.fieldArea} acres</span>
      </div>

      <GrowthBar stages={stages} currentIdx={currentIdx} />

      <div className="flex items-center justify-between mt-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[crop.currentStage]}`}>
          {STAGE_LABELS[crop.currentStage]}
        </span>
        <span className="text-xs text-gray-400">{Math.round(progress)}% complete</span>
      </div>
    </motion.div>
  );
}

function GrowthBar({ stages, currentIdx }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1.5">
        {stages.map((stage, i) => (
          <div key={stage} className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full border-2 transition-all ${
              i < currentIdx ? 'bg-forest-600 border-forest-600' :
              i === currentIdx ? 'bg-amber-500 border-amber-500 ring-2 ring-amber-200 animate-pulse' :
              'bg-white border-gray-200'
            }`} />
          </div>
        ))}
      </div>
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-forest-500 to-amber-500 rounded-full transition-all duration-700"
          style={{ width: `${((currentIdx) / (stages.length - 1)) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {stages.map((s, i) => (
          <span key={s} className={`text-[9px] ${i === currentIdx ? 'text-amber-600 font-semibold' : 'text-gray-300'}`}>
            {s.slice(0, 3)}
          </span>
        ))}
      </div>
    </div>
  );
}
