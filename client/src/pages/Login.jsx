import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Wheat, Phone, Lock, User, MapPin } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', password: '', location: '', farmSize: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data.token, data.user);
      toast.success(`Welcome${data.user.name ? `, ${data.user.name}` : ''}! 🌾`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { phone: '9876543210', password: 'demo1234' });
      login(data.token, data.user);
      toast.success('Welcome back, Rajan! 🌾');
      navigate('/');
    } catch {
      toast.error('Demo login failed. Please run seed data first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f8faf8] to-[#eef4ef]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-forest-800 via-forest-700 to-forest-600 p-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
              <Wheat size={26} className="text-white" />
            </div>
            <span className="font-heading text-white text-3xl font-semibold">KrishiAI</span>
          </div>
          <h1 className="font-heading text-white text-5xl font-semibold leading-tight mb-5">
            Smart farming<br />starts with<br /><span className="text-amber-400">smart advice.</span>
          </h1>
          <p className="text-forest-200 text-lg leading-relaxed max-w-sm">
            Get AI-powered crop advisory, real-time weather alerts, soil analysis, and market prices — all in one place.
          </p>
        </div>

        {/* Farmer illustration SVG */}
        <div className="relative z-10 flex justify-center">
          <svg viewBox="0 0 320 280" className="w-80 opacity-90">
            <rect width="320" height="280" fill="none" />
            <circle cx="260" cy="50" r="28" fill="#e9a825" opacity="0.8" />
            {[0,45,90,135,180,225,270,315].map((a,i) => (
              <line key={i} x1={260+Math.cos(a*Math.PI/180)*32} y1={50+Math.sin(a*Math.PI/180)*32}
                x2={260+Math.cos(a*Math.PI/180)*42} y2={50+Math.sin(a*Math.PI/180)*42}
                stroke="#e9a825" strokeWidth="2.5" opacity="0.6" />
            ))}
            <ellipse cx="160" cy="240" rx="150" ry="20" fill="#2a6b4c" opacity="0.4" />
            <rect x="10" y="230" width="300" height="50" fill="#2a6b4c" opacity="0.3" rx="4" />
            {[60,100,140,180,220,260].map((x,i) => (
              <g key={i}>
                <line x1={x} y1="230" x2={x} y2={190-i*3} stroke="#5da37f" strokeWidth="2" />
                <ellipse cx={x} cy={185-i*3} rx="8" ry="12" fill="#3a8660" opacity="0.8" />
                <line x1={x-6} y1={205-i*3} x2={x-16} y2={195-i*3} stroke="#5da37f" strokeWidth="1.5" />
                <line x1={x+6} y1={205-i*3} x2={x+16} y2={195-i*3} stroke="#5da37f" strokeWidth="1.5" />
              </g>
            ))}
            <circle cx="160" cy="120" r="22" fill="#f5c842" />
            <circle cx="160" cy="118" r="14" fill="#fde68a" />
            <ellipse cx="160" cy="106" rx="20" ry="5" fill="#8B5E3C" />
            <rect x="148" y="92" width="24" height="16" fill="#8B5E3C" rx="3" />
            <rect x="145" y="142" width="30" height="40" fill="#1a5c38" rx="6" />
            <line x1="145" y1="150" x2="125" y2="170" stroke="#1a5c38" strokeWidth="8" strokeLinecap="round" />
            <line x1="175" y1="150" x2="195" y2="165" stroke="#1a5c38" strokeWidth="8" strokeLinecap="round" />
            <line x1="195" y1="165" x2="210" y2="200" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="210" cy="202" rx="8" ry="4" fill="#8B5E3C" />
            <rect x="148" y="180" width="10" height="35" fill="#2a6b4c" rx="4" />
            <rect x="162" y="180" width="10" height="35" fill="#2a6b4c" rx="4" />
            <ellipse cx="153" cy="215" rx="9" ry="5" fill="#1a3a28" />
            <ellipse cx="167" cy="215" rx="9" ry="5" fill="#1a3a28" />
            <path d="M154 122 Q160 128 166 122" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="155" cy="116" r="2" fill="#92400e" />
            <circle cx="165" cy="116" r="2" fill="#92400e" />
          </svg>
        </div>

        <div className="relative z-10 flex gap-8">
          {[['10K+', 'Farmers'], ['50+', 'Crops'], ['24/7', 'AI Support']].map(([v, l]) => (
            <div key={l}>
              <p className="text-amber-400 font-heading font-semibold text-2xl">{v}</p>
              <p className="text-forest-300 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md glass rounded-3xl p-8 md:p-10">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-forest-700 rounded-xl flex items-center justify-center">
              <Wheat size={20} className="text-amber-400" />
            </div>
            <span className="font-heading text-forest-700 text-2xl font-semibold">KrishiAI</span>
          </div>

          <h2 className="font-heading text-3xl font-semibold text-gray-800 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-gray-500 text-base mb-8">
            {mode === 'login' ? 'Sign in to your farm dashboard' : 'Join thousands of smart farmers'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <InputField icon={User} placeholder="Full name" value={form.name} onChange={v => set('name', v)} required />
                <InputField icon={MapPin} placeholder="Location (e.g. Pune, Maharashtra)" value={form.location} onChange={v => set('location', v)} />
              </>
            )}
            <InputField icon={Phone} placeholder="Phone number" value={form.phone} onChange={v => set('phone', v)} type="tel" required />
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                className="input pl-11 pr-11"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 text-base py-3.5">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-gray-400">or</span></div>
          </div>

          <button onClick={demoLogin} disabled={loading} className="btn-secondary w-full text-base py-3.5">
            🌾 Try Demo Account
          </button>

          <p className="text-center text-base text-gray-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-forest-700 font-medium hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, placeholder, value, onChange, type = 'text', required }) {
  return (
    <div className="relative">
      <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="input pl-11" required={required} />
    </div>
  );
}
