import { useState } from 'react';
import { Bell, Menu, X, Wheat } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/chat', label: 'AI Chat' },
  { to: '/crops', label: 'My Crops' },
  { to: '/soil', label: 'Soil' },
  { to: '/market', label: 'Market' },
  { to: '/weather', label: 'Weather' },
];

export default function Topbar({ alertCount = 0 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="md:hidden glass text-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-white/70">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center">
          <Wheat size={16} className="text-amber-300" />
        </div>
        <span className="font-heading font-semibold text-slate-800">KrishiAI</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative text-slate-600" onClick={() => navigate('/')}>
          <Bell size={20} />
          {alertCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">{alertCount}</span>}
        </button>
        <button className="text-slate-700" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-200 py-2 z-50 shadow-lg">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `block px-5 py-3 text-sm ${isActive ? 'text-forest-700 font-semibold' : 'text-slate-600'}`}>
              {label}
            </NavLink>
          ))}
          <button onClick={() => { logout(); navigate('/login'); }} className="block w-full text-left px-5 py-3 text-sm text-red-600 border-t border-slate-100 mt-1">
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
