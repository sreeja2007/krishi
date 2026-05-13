import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const IDEAL = { ph: 6.5, nitrogen: 280, phosphorus: 50, potassium: 200, organicMatter: 3, moisture: 50 };
const MAX = { ph: 14, nitrogen: 500, phosphorus: 200, potassium: 500, organicMatter: 10, moisture: 100 };
const LABELS = { ph: 'pH', nitrogen: 'Nitrogen', phosphorus: 'Phosphorus', potassium: 'Potassium', organicMatter: 'Organic Matter', moisture: 'Moisture' };

export default function NutrientChart({ report }) {
  if (!report) return null;

  const data = Object.keys(IDEAL).map(key => ({
    nutrient: LABELS[key],
    actual: Math.round((report[key] / MAX[key]) * 100),
    ideal: Math.round((IDEAL[key] / MAX[key]) * 100),
  }));

  return (
    <div className="card">
      <h3 className="font-heading font-semibold text-gray-800 mb-1">Nutrient Profile</h3>
      <p className="text-xs text-gray-400 mb-4">Your soil vs ideal values</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <Radar name="Ideal" dataKey="ideal" stroke="#e9a825" fill="#e9a825" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 2" />
          <Radar name="Your Soil" dataKey="actual" stroke="#1a5c38" fill="#1a5c38" fillOpacity={0.25} strokeWidth={2} />
          <Tooltip formatter={(v, n) => [`${v}%`, n]} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-forest-700 inline-block rounded" />Your Soil</div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-amber-500 inline-block rounded border-dashed" />Ideal</div>
      </div>
    </div>
  );
}
