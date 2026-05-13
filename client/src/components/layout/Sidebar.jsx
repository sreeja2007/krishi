import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Sprout, FlaskConical, TrendingUp, CloudSun, LogOut, Wheat } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t, lang, switchLang } = useLang();
  const navigate = useNavigate();

  const NAV = [
    { to: '/',        icon: LayoutDashboard, label: t('dashboard') },
    { to: '/chat',    icon: MessageSquare,   label: t('aiChat') },
    { to: '/crops',   icon: Sprout,          label: t('myCrops') },
    { to: '/soil',    icon: FlaskConical,    label: t('soilAnalysis') },
    { to: '/market',  icon: TrendingUp,      label: t('marketPrices') },
    { to: '/weather', icon: CloudSun,        label: t('weather') },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-forest-700 text-white min-h-screen fixed left-0 top-0 z-30">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-forest-600">
        <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
          <Wheat size={20} className="text-white" />
        </div>
        <div>
          <p className="font-heading font-semibold text-lg leading-tight">KrishiAI</p>
          <p className="text-forest-300 text-xs">Smart Farm Advisor</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                isActive ? 'bg-forest-600 text-white' : 'text-forest-200 hover:bg-forest-600/50 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Language Switcher */}
      <div className="px-4 pb-3">
        <p className="text-forest-400 text-xs uppercase tracking-wider mb-2 px-1">Language / மொழி</p>
        <div className="flex gap-2">
          <button onClick={() => switchLang('en')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              lang === 'en' ? 'bg-amber-500 text-white' : 'bg-forest-600/50 text-forest-200 hover:bg-forest-600'
            }`}>
            EN
          </button>
          <button onClick={() => switchLang('ta')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              lang === 'ta' ? 'bg-amber-500 text-white' : 'bg-forest-600/50 text-forest-200 hover:bg-forest-600'
            }`}>
            தமிழ்
          </button>
        </div>
      </div>

      <div className="px-3 pb-5 border-t border-forest-600 pt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-forest-300 text-xs truncate">{user?.location || 'Farmer'}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-forest-200 hover:bg-forest-600/50 hover:text-white transition-all">
          <LogOut size={18} /> {t('signOut')}
        </button>
      </div>
    </aside>
  );
}
