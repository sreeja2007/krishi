import { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SoilForm from '../components/soil/SoilForm';
import NutrientChart from '../components/soil/NutrientChart';
import RecoCard from '../components/soil/RecoCard';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function Soil() {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLang();

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const { data } = await api.get('/soil');
      setReports(data);
      if (data.length > 0) setActiveReport(data[0]);
    } catch {}
  };

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      const { data } = await api.post('/soil', form);
      setReports(prev => [data, ...prev]);
      setActiveReport(data);
      toast.success('Soil analysis complete! 🧪');
    } catch (err) { toast.error(err.response?.data?.message || 'Analysis failed'); }
    finally { setLoading(false); }
  };

  return (
    <PageWrapper>
      <div className="mb-7">
        <h1 className="font-heading text-3xl font-semibold text-gray-800">{t('soilAnalysisLab')}</h1>
        <p className="text-gray-500 text-base mt-1">{t('soilDesc')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <SoilForm onSubmit={handleSubmit} loading={loading} />
        <NutrientChart report={activeReport} />
      </div>

      {activeReport && <RecoCard report={activeReport} />}

      {reports.length > 1 && (
        <div className="mt-6">
            <h3 className="flex items-center gap-2 mb-4"><History size={18} className="text-gray-400" /><span className="font-heading text-xl font-semibold text-gray-700">{t('analysisHistory')}</span></h3>
          <div className="space-y-2">
            {reports.slice(1).map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className={`card flex items-center justify-between cursor-pointer hover:border-forest-200 transition-colors ${activeReport?._id === r._id ? 'border-forest-300' : ''}`}
                onClick={() => setActiveReport(r)}>
                <div>
                  <p className="text-base font-medium text-gray-700">{r.fieldName}</p>
                  <p className="text-sm text-gray-400">{formatDate(r.createdAt)}</p>
                </div>
                <div className="flex gap-5 text-sm text-gray-500">
                  <span>pH {r.ph}</span>
                  <span>N {r.nitrogen}</span>
                  <span>P {r.phosphorus}</span>
                  <span>K {r.potassium}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
