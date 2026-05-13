import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Search } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatDate';
import { useLang } from '../context/LangContext';

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={16} className="text-green-500" />;
  if (trend === 'down') return <TrendingDown size={16} className="text-red-500" />;
  return <Minus size={16} className="text-gray-400" />;
};

export default function Market() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const { t } = useLang();

  useEffect(() => { loadPrices(); }, []);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/market/latest');
      setPrices(data);
      setLastUpdated(new Date());
    } catch { toast.error('Failed to load market prices'); }
    finally { setLoading(false); }
  };

  const filtered = prices.filter(p =>
    p.crop.toLowerCase().includes(search.toLowerCase()) ||
    p.market.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-gray-800">{t('mandiPrices')}</h1>
          <p className="text-gray-500 text-base mt-1">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : t('liveRates')}
          </p>
        </div>
        <button onClick={loadPrices} disabled={loading} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {t('refresh')}
        </button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchMarket')} className="input pl-11" />
      </div>

      {loading ? (
        <div className="card animate-pulse h-64" />
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Crop', 'Price', 'Unit', 'Market', 'State', 'Trend', '7-Day Chart', 'Date'].map(h => (
                    <th key={h} className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wide px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id} className={`border-b border-gray-50 hover:bg-forest-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-base text-gray-800">{p.crop}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-bold text-base ${p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-600' : 'text-gray-800'}`}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">/{p.unit}</td>
                    <td className="px-5 py-4 text-base text-gray-600">{p.market}</td>
                    <td className="px-5 py-4 text-base text-gray-500">{p.state}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={p.trend} />
                        <span className={`text-sm font-medium ${p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-600' : 'text-gray-400'}`}>
                          {p.trend}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {p.priceHistory?.length > 1 && (
                        <ResponsiveContainer width={90} height={36}>
                          <LineChart data={p.priceHistory.slice().reverse()}>
                            <Line type="monotone" dataKey="price" stroke={p.trend === 'up' ? '#16a34a' : p.trend === 'down' ? '#dc2626' : '#6b7280'} strokeWidth={2} dot={false} />
                            <Tooltip formatter={v => [`₹${Math.round(v)}`, 'Price']} contentStyle={{ fontSize: 12, padding: '4px 8px', borderRadius: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{formatDate(p.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-14 text-gray-400 text-base">No prices found</div>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-700">{t('disclaimer2')}</p>
      </div>
    </PageWrapper>
  );
}
