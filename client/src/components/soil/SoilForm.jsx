import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

const FIELDS = [
  { key: 'ph',           label: 'Soil pH',        min: 0, max: 14,  step: 0.1, placeholder: '6.5',  unit: '' },
  { key: 'nitrogen',     label: 'Nitrogen (N)',    min: 0, max: 500, step: 1,   placeholder: '200',  unit: 'kg/ha' },
  { key: 'phosphorus',   label: 'Phosphorus (P)',  min: 0, max: 200, step: 1,   placeholder: '30',   unit: 'kg/ha' },
  { key: 'potassium',    label: 'Potassium (K)',   min: 0, max: 500, step: 1,   placeholder: '150',  unit: 'kg/ha' },
  { key: 'organicMatter',label: 'Organic Matter',  min: 0, max: 10,  step: 0.1, placeholder: '2.0',  unit: '%' },
  { key: 'moisture',     label: 'Moisture',        min: 0, max: 100, step: 1,   placeholder: '35',   unit: '%' },
];

export default function SoilForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    ph: '', nitrogen: '', phosphorus: '', potassium: '',
    organicMatter: '', moisture: '', fieldName: 'Main Field',
  });

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }} className="card">
      <div className="flex items-center gap-2 mb-5">
        <FlaskConical size={20} className="text-forest-700" />
        <h3 className="font-heading text-xl font-semibold text-gray-800">Enter Soil Test Results</h3>
      </div>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-1.5 block">Field Name</label>
        <input value={form.fieldName}
          onChange={e => setForm(f => ({ ...f, fieldName: e.target.value }))}
          className="input" placeholder="e.g. North Field" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {FIELDS.map(({ key, label, min, max, step, placeholder, unit }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              {label} {unit && <span className="text-gray-400 font-normal">({unit})</span>}
            </label>
            <input
              type="number" min={min} max={max} step={step}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="input" placeholder={placeholder} required
            />
          </div>
        ))}
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full text-base">
        {loading ? 'Analyzing with AI...' : '🔬 Analyze Soil & Get AI Recommendations'}
      </button>
    </form>
  );
}
