import { useState, useEffect } from 'react';
import { Search, Droplets, Sparkles } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { CurrentWeatherCard, ForecastRow } from '../components/weather/WeatherCard';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';

export default function Weather() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(user?.location || '');
  const [searchInput, setSearchInput] = useState(user?.location || '');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const { t } = useLang();

  useEffect(() => { if (location) fetchWeather(location); }, []);

  const fetchWeather = async (loc) => {
    if (!loc.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/weather?location=${encodeURIComponent(loc)}`);
      setWeather(data);
      setLocation(loc);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Location not found');
    } finally { setLoading(false); }
  };

  const fetchAdvice = async () => {
    if (!location) return;
    setAdviceLoading(true);
    try {
      const { data } = await api.get(`/weather/irrigation-advice?location=${encodeURIComponent(location)}&crop=general`);
      setAdvice(data.advice);
    } catch { toast.error('Failed to get advice'); }
    finally { setAdviceLoading(false); }
  };

  return (
    <PageWrapper>
      <div className="mb-7">
        <h1 className="font-heading text-3xl font-semibold text-gray-800">{t('weatherIrrigation')}</h1>
        <p className="text-gray-500 text-base mt-1">{t('weatherDesc')}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchWeather(searchInput); }} className="flex gap-3 mb-7 max-w-lg">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder={t('searchLocation')} className="input pl-11" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary px-6">
          {loading ? 'Searching...' : t('search')}
        </button>
      </form>

      {loading && <div className="card h-48 animate-pulse" />}

      {weather && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <CurrentWeatherCard current={weather.current} />
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Droplets size={18} className="text-blue-500" />
                <h3 className="font-heading text-xl font-semibold text-gray-700">{t('irrigationAdvisory')}</h3>
              </div>
              {advice ? (
                <p className="text-base text-gray-600 leading-relaxed">{advice}</p>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-gray-400 text-base mb-4">{t('weatherDesc')}</p>
                  <button onClick={fetchAdvice} disabled={adviceLoading} className="btn-primary flex items-center gap-2">
                    <Sparkles size={16} />
                    {adviceLoading ? t('analyzing') : t('getIrrigationAdvice')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold text-gray-700 mb-4">{t('sevenDayForecast')}</h3>
            <div className="space-y-2">
              {weather.forecast.map((day, i) => (
                <motion.div key={day.date} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <ForecastRow day={day} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {!weather && !loading && (
        <div className="card text-center py-20">
          <span className="text-6xl mb-4 block">🌤️</span>
          <p className="font-heading font-semibold text-gray-600 text-xl mb-2">{t('searchYourLocation')}</p>
          <p className="text-gray-400 text-base">{t('enterCity')}</p>
        </div>
      )}
    </PageWrapper>
  );
}
