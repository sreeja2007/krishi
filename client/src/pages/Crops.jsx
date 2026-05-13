import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import CropCard from '../components/crops/CropCard';
import CropModal from '../components/crops/CropModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useLang } from '../context/LangContext';

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCrop, setEditCrop] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { t } = useLang();

  useEffect(() => { loadCrops(); }, []);

  const loadCrops = async () => {
    try {
      const { data } = await api.get('/crops');
      setCrops(data);
    } catch { toast.error('Failed to load crops'); }
    finally { setLoading(false); }
  };

  const handleSave = async (form) => {
    try {
      if (editCrop) {
        const { data } = await api.put(`/crops/${editCrop._id}`, form);
        setCrops(prev => prev.map(c => c._id === data._id ? data : c));
        toast.success('Crop updated!');
      } else {
        const { data } = await api.post('/crops', form);
        setCrops(prev => [data, ...prev]);
        toast.success('Crop added! 🌱');
      }
      setModalOpen(false);
      setEditCrop(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this crop?')) return;
    try {
      await api.delete(`/crops/${id}`);
      setCrops(prev => prev.filter(c => c._id !== id));
      toast.success('Crop removed');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = crops.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.variety?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter || c.currentStage === filter;
    return matchSearch && matchFilter;
  });

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-gray-800">{t('cropManager')}</h1>
          <p className="text-gray-500 text-base mt-1">{crops.filter(c => c.status === 'active').length} {t('active')} · {crops.length} {t('total')}</p>
        </div>
        <button onClick={() => { setEditCrop(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> {t('addCrop')}
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchCrops')} className="input pl-11" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input w-auto">
          <option value="all">{t('allStatus')}</option>
          <option value="active">{t('active')}</option>
          <option value="harvested">{t('harvested')}</option>
          <option value="seedling">{t('seedling')}</option>
          <option value="vegetative">{t('vegetative')}</option>
          <option value="flowering">{t('flowering')}</option>
          <option value="fruiting">{t('fruiting')}</option>
          <option value="harvest">{t('readyHarvest')}</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="card h-52 animate-pulse bg-gray-50" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <span className="text-5xl mb-3 block">🌱</span>
          <p className="font-heading font-semibold text-gray-600 text-xl mb-2">{t('noCropsFound')}</p>
          <p className="text-gray-400 text-base mb-5">{search ? 'Try a different search' : t('startAddingCrop')}</p>
          {!search && <button onClick={() => setModalOpen(true)} className="btn-primary">{t('addFirstCropBtn')}</button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((crop, i) => (
            <CropCard key={crop._id} crop={crop} onEdit={c => { setEditCrop(c); setModalOpen(true); }} onDelete={handleDelete} delay={i * 0.04} />
          ))}
        </div>
      )}

      <CropModal open={modalOpen} onClose={() => { setModalOpen(false); setEditCrop(null); }} onSave={handleSave} crop={editCrop} />
    </PageWrapper>
  );
}
