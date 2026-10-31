import React, { useState } from 'react';
import { Language, UserAccount } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Smartphone, Lock, User, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
}) => {
  const t = getT(language);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [mobile, setMobile] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanMobile = mobile.trim();
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया सही 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit Indian mobile number.'
      );
      sound.playLoss();
      return;
    }

    if (password.length < 4) {
      setErrorMsg(
        language === 'hi'
          ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।'
          : 'Password must be at least 4 characters.'
      );
      sound.playLoss();
      return;
    }

    // Load registered users from localStorage
    const savedUsersRaw = localStorage.getItem('tg_gaming_users');
    const users: Record<string, UserAccount> = savedUsersRaw ? JSON.parse(savedUsersRaw) : {};

    if (mode === 'register') {
      if (users[cleanMobile]) {
        setErrorMsg(
          language === 'hi'
            ? 'यह मोबाइल नंबर पहले से रजिस्टर्ड है। कृपया लॉगिन करें।'
            : 'This mobile number is already registered. Please login.'
        );
        sound.playLoss();
        return;
      }

      const newUser: UserAccount = {
        mobile: cleanMobile,
        password,
        name: name.trim() || `Player_${cleanMobile.slice(-4)}`,
        balance: 500, // Initial bonus
        createdAt: Date.now(),
      };

      users[cleanMobile] = newUser;
      localStorage.setItem('tg_gaming_users', JSON.stringify(users));

      setSuccessMsg(
        language === 'hi'
          ? 'रजिस्ट्रेशन सफल! ₹500 वेलकम बोनस दिया गया।'
          : 'Registration successful! ₹500 welcome bonus added.'
      );
      sound.playWin();

      setTimeout(() => {
        onAuthSuccess(newUser);
        onClose();
      }, 700);
    } else {
      // Login
      const existingUser = users[cleanMobile];
      if (!existingUser) {
        // If not found, create or inform
        const fallbackUser: UserAccount = {
          mobile: cleanMobile,
          password,
          name: `Player_${cleanMobile.slice(-4)}`,
          balance: 500,
          createdAt: Date.now(),
        };
        users[cleanMobile] = fallbackUser;
        localStorage.setItem('tg_gaming_users', JSON.stringify(users));
        sound.playWin();
        onAuthSuccess(fallbackUser);
        onClose();
        return;
      }

      if (existingUser.password && existingUser.password !== password) {
        setErrorMsg(
          language === 'hi' ? 'गलत पासवर्ड! कृपया दोबारा जांचें।' : 'Incorrect password! Please recheck.'
        );
        sound.playLoss();
        return;
      }

      sound.playWin();
      onAuthSuccess(existingUser);
      onClose();
    }
  };

  const handleQuickDemoLogin = () => {
    sound.playChip();
    const demoMobile = '9876543210';
    const demoUser: UserAccount = {
      mobile: demoMobile,
      password: 'password',
      name: 'TG VIP Gamer',
      balance: 1000,
      createdAt: Date.now(),
    };
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#101726] border border-slate-700 rounded-2xl p-5 sm:p-6 text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <h2 className="text-xl font-bold uppercase tracking-wider text-amber-300">
            TG GAMING OWNER
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi' ? 'अपने मोबाइल नंबर से लॉगिन करें' : 'Login with your Mobile Number'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 my-4 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'नया खाता (रजिस्टर)' : 'Register'}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {language === 'hi' ? 'खिलाड़ी का नाम' : 'Player Name'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Kumar"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 text-xs font-mono font-bold">+91</span>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full pl-12 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{language === 'hi' ? 'रजिस्टर करें' : 'Register Now'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Access */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
          >
            {language === 'hi' ? '⚡ टेस्ट के लिए तुरंत डेमो लॉगिन करें' : '⚡ Quick 1-Click Demo Login'}
          </button>
        </div>

      </div>
    </div>
  );
};
