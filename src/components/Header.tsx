import React from 'react';
import { Crown, PlusCircle, ArrowDownToLine, Settings as SettingsIcon, User, LogIn, LogOut } from 'lucide-react';
import { Language, UserAccount } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';

interface HeaderProps {
  balance: number;
  onlineCount: number;
  currentUser: UserAccount | null;
  language: Language;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  onlineCount,
  currentUser,
  language,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSettings,
  onOpenAdmin,
  onOpenAuth,
  onLogout,
}) => {
  const t = getT(language);

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b101d] border-b border-slate-800 px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand Identity & Live Count */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={onOpenAdmin}
            title="VIP Admin Gate"
            className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center cursor-pointer hover:bg-amber-500/30 transition-all shrink-0"
          >
            <Crown className="w-4 h-4 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-xs sm:text-base font-black tracking-wider text-amber-300 uppercase whitespace-nowrap">
                TG GAMING OWNER
              </h1>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tabular-nums font-mono font-bold">{onlineCount.toLocaleString()}</span>
                <span>{language === 'hi' ? 'लाइव' : 'Online'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Corner: Compact Full Balance & Clear Settings Button */}
        <div className="flex items-center gap-2">
          
          {/* User Auth Profile */}
          {currentUser ? (
            <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-slate-300">{currentUser.mobile}</span>
              <button
                onClick={onLogout}
                title="Logout"
                className="ml-1 text-slate-500 hover:text-rose-400 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playChip();
                onOpenAuth();
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3 h-3" />
              <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
            </button>
          )}

          {/* Compact Full Balance Box (छोटा लेकिन पूरा बैलेंस) */}
          <div className="flex items-center bg-slate-900 border border-amber-500/40 rounded-lg px-2.5 py-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 mr-1 hidden xs:inline">
              {t.balance}:
            </span>
            <div className="flex items-center font-mono font-bold text-amber-300 text-xs sm:text-sm tabular-nums whitespace-nowrap">
              <span className="text-[11px] text-amber-400 font-sans mr-0.5">₹</span>
              <span>{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Quick Header Deposit */}
          <button
            onClick={() => {
              sound.playChip();
              onOpenDeposit();
            }}
            className="hidden xs:flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.deposit}</span>
          </button>

          {/* Quick Header Withdraw */}
          <button
            onClick={() => {
              sound.playChip();
              onOpenWithdraw();
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.withdraw}</span>
          </button>

          {/* Explicit Settings Button (सेटिंग का बटन) */}
          <button
            onClick={() => {
              sound.playChip();
              onOpenSettings();
            }}
            title={t.settings}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.settings}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
