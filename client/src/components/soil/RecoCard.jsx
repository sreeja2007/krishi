import { Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export default function RecoCard({ report }) {
  if (!report?.aiRecommendation) return null;
  return (
    <div className="card border-forest-200 bg-gradient-to-br from-forest-50 to-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-forest-700 rounded-xl flex items-center justify-center">
          <Sparkles size={16} className="text-amber-400" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-gray-800">AI Recommendation</h3>
          <p className="text-xs text-gray-400">{report.fieldName} · {formatDate(report.createdAt)}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{report.aiRecommendation}</p>
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
        {[
          { label: 'pH', value: report.ph, ideal: '6.0–7.0', ok: report.ph >= 6 && report.ph <= 7 },
          { label: 'Nitrogen', value: `${report.nitrogen} kg/ha`, ideal: '200–280', ok: report.nitrogen >= 200 },
          { label: 'Potassium', value: `${report.potassium} kg/ha`, ideal: '150–200', ok: report.potassium >= 150 },
        ].map(({ label, value, ideal, ok }) => (
          <div key={label} className="text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-sm font-semibold ${ok ? 'text-forest-700' : 'text-amber-600'}`}>{value}</p>
            <p className="text-[10px] text-gray-300">ideal: {ideal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
