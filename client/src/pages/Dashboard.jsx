import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, MessageSquare, CloudSun, FlaskConical, Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/layout/PageWrapper';
import StatCard from '../components/ui/StatCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getGreeting, formatRelative } from '../utils/formatDate';
import { CROP_ICONS, STAGE_LABELS, STAGE_COLORS } from '../utils/getCropStage';
import { useLang } from '../context/LangContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [data, setData] = useState({ crops: [], alerts: [], queryStats: { total: 0, resolved: 0 }, weather: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [crops, alerts, queryStats] = await Promise.all([
          api.get('/crops').then(r => r.data),
          api.get('/alerts').then(r => r.data),
          api.get('/queries/stats').then(r => r.data),
        ]);
        let weather = null;
        if (user?.location) {
          try { weather = await api.get(`/weather?location=${encodeURIComponent(user.location)}`).then(r => r.data.current); } catch {}
        }
        setData({ crops, alerts, queryStats, weather });
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  const activeCrops = data.crops.filter(c => c.status === 'active');
  const unreadAlerts = data.alerts.filter(a => !a.read);

  return (
    <PageWrapper>
      {/* Hero header */}
      <div className="bg-gradient-to-br from-forest-700 to-forest-800 rounded-2xl p-7 md:p-9 mb-7 overflow-hidden relative text-white">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-amber-300/30 to-transparent rounded-full -translate-y-1/3 translate-x-1/3" />
        <div>
          <p className="text-sm uppercase tracking-widest text-forest-200/80 mb-2">{t('dashboardTitle')}</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]} 🌾
          </h1>
          <p className="text-forest-200 text-base mt-2">
            {user?.location || 'Your farm dashboard'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          {data.weather && (
            <div className="flex items-center gap-2 bg-white/20 text-white px-4 py-2.5 rounded-xl">
              <CloudSun size={20} className="text-amber-300" />
              <span className="font-semibold text-lg">{data.weather.temp}°C</span>
              <span className="text-forest-100 text-sm capitalize">{data.weather.description}</span>
            </div>
          )}
          <button onClick={() => navigate('/chat')} className="bg-white text-forest-700 font-medium px-5 py-2.5 rounded-xl hover:bg-forest-50 transition-colors text-base">
            {t('askKrishiAI')}
          </button>
          <button onClick={() => navigate('/crops')} className="bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors text-base">
            {t('manageCrops')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard icon={Sprout}        label={t('activeCrops')}     value={activeCrops.length}       sub={`${data.crops.length} ${t('total')}`}        color="forest"  delay={0}    />
        <StatCard icon={MessageSquare} label={t('queriesResolved')} value={data.queryStats.resolved} sub={`${data.queryStats.total} ${t('total')}`}    color="blue"    delay={0.05} />
        <StatCard icon={Bell}          label={t('unreadAlerts')}    value={unreadAlerts.length}      sub={t('needsAttention')}                         color="amber"   delay={0.1}  />
        <StatCard icon={FlaskConical}  label={t('soilScore')}       value="72/100"                   sub={t('lastAnalysis')}                           color="purple"  delay={0.15} />
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        {/* Crops */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-semibold text-gray-800">{t('cropHealthOverview')}</h2>
            <button onClick={() => navigate('/crops')} className="text-sm text-forest-700 hover:underline flex items-center gap-1">
              {t('viewAll')} <ArrowRight size={14} />
            </button>
          </div>
          {loading ? (
            <div className="card flex items-center justify-center h-36">
              <div className="w-7 h-7 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeCrops.length === 0 ? (
            <div className="card text-center py-12">
              <Sprout size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-base">{t('noActiveCrops')}{' '}
                <button onClick={() => navigate('/crops')} className="text-forest-700 hover:underline">{t('addFirstCrop')}</button>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCrops.slice(0, 4).map((crop, i) => (
                <motion.div key={crop._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="card flex items-center gap-4 hover:border-forest-200 transition-colors cursor-pointer" onClick={() => navigate('/crops')}>
                  <span className="text-3xl">{CROP_ICONS[crop.name] || '🌱'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-base text-gray-800">
                        {crop.name} <span className="text-gray-400 font-normal text-sm">· {crop.variety}</span>
                      </p>
                      <span className={`text-sm px-2.5 py-0.5 rounded-full font-medium ${STAGE_COLORS[crop.currentStage]}`}>
                        {STAGE_LABELS[crop.currentStage]}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-forest-500 to-amber-500 rounded-full transition-all"
                        style={{ width: `${(['seedling','vegetative','flowering','fruiting','harvest'].indexOf(crop.currentStage)+1)/5*100}%` }} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 whitespace-nowrap">{crop.fieldArea} ac</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl font-semibold text-gray-800">{t('alerts')}</h2>
            {unreadAlerts.length > 0 && (
              <span className="text-sm bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-medium">{unreadAlerts.length} {t('new')}</span>
            )}
          </div>
          <div className="space-y-3">
            {data.alerts.slice(0, 5).map((alert, i) => (
              <motion.div key={alert._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`card border-l-4 ${alert.severity === 'critical' ? 'border-l-red-500' : alert.severity === 'warning' ? 'border-l-amber-500' : 'border-l-forest-500'}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{alert.message}</p>
                  {alert.severity === 'critical' && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-gray-400 mt-2">{formatRelative(alert.createdAt)}</p>
              </motion.div>
            ))}
            {data.alerts.length === 0 && (
              <div className="card text-center py-10">
                <Bell size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-base">{t('noAlertsYet')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
