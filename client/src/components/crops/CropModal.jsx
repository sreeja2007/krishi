import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { getAllStages, STAGE_LABELS } from '../../utils/getCropStage';

const CROP_NAMES = ['Paddy', 'Wheat', 'Cotton', 'Sugarcane', 'Tomato', 'Onion', 'Soybean', 'Maize', 'Groundnut', 'Chilli', 'Turmeric', 'Banana', 'Mango', 'Brinjal', 'Okra', 'Mustard', 'Chickpea', 'Lentil', 'Sunflower', 'Potato', 'Other'];

const EMPTY = { name: '', variety: '', sowingDate: '', fieldArea: '', currentStage: 'seedling', notes: '' };

export default function CropModal({ open, onClose, onSave, crop }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (crop) {
      setForm({ ...crop, sowingDate: crop.sowingDate?.split('T')[0] || '' });
    } else {
      setForm(EMPTY);
    }
  }, [crop, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose} title={crop ? 'Edit Crop' : 'Add New Crop'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Crop Name *</label>
            <select value={form.name} onChange={e => set('name', e.target.value)} className="input" required>
              <option value="">Select crop</option>
              {CROP_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Variety</label>
            <input value={form.variety} onChange={e => set('variety', e.target.value)} className="input" placeholder="e.g. IR-64" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Sowing Date *</label>
            <input type="date" value={form.sowingDate} onChange={e => set('sowingDate', e.target.value)} className="input" required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Field Area (acres) *</label>
            <input type="number" step="0.1" min="0.1" value={form.fieldArea} onChange={e => set('fieldArea', e.target.value)} className="input" placeholder="e.g. 2.5" required />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Current Growth Stage</label>
          <div className="grid grid-cols-5 gap-1.5">
            {getAllStages().map(s => (
              <button key={s} type="button" onClick={() => set('currentStage', s)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${form.currentStage === s ? 'bg-forest-700 text-white border-forest-700' : 'bg-white text-gray-500 border-gray-200 hover:border-forest-300'}`}>
                {STAGE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="input resize-none" rows={2} placeholder="Any observations..." />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : crop ? 'Update Crop' : 'Add Crop'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
