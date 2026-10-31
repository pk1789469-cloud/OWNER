import React from 'react';
import { PlusCircle, ArrowDownToLine, Settings as SettingsIcon, ShieldCheck, Smartphone } from 'lucide-react';
import { Language } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';

interface BottomBarProps {
  balance: number;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  language: Language;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  balance,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSettings,
  onOpenAdmin,
  language,
}) => {
  const t = getT(language);

  return (
    <div className="sticky bottom-0 z-40 w-full bg-[#0a0e19] border-t border-slate-800 px-3 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        
        {/* Deposit Button (डिपॉजिट) */}
        <button
          type="button"
          onClick={() => {
            sound.playChip();
            onOpenDeposit();
          }}
          className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-emerald-400/30 active:scale-95 whitespace-nowrap"
        >
          <Smartphone className="w-4 h-4 text-emerald-200" />
          <span>{language === 'hi' ? 'डिपॉजिट (Deposit)' : 'Deposit Cash'}</span>
        </button>

        {/* Withdraw Button (विड्रॉवल) */}
        <button
          type="button"
          onClick={() => {
            sound.playChip();
            onOpenWithdraw();
          }}
          className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-cyan-500/30 active:scale-95 whitespace-nowrap"
        >
          <ArrowDownToLine className="w-4 h-4 text-cyan-400" />
          <span>{language === 'hi' ? 'विड्रॉवल (Withdraw)' : 'Withdraw'}</span>
        </button>

        {/* Settings Button (सेटिंग्स) */}
        <button
          type="button"
          onClick={() => {
            sound.playChip();
            onOpenSettings();
          }}
          className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700 active:scale-95 whitespace-nowrap"
        >
          <SettingsIcon className="w-4 h-4 text-amber-400" />
          <span>{language === 'hi' ? 'सेटिंग' : 'Settings'}</span>
        </button>

        {/* VIP Admin Button */}
        <button
          type="button"
          onClick={() => {
            sound.playAdmin();
            onOpenAdmin();
          }}
          title="VIP Admin Control"
          className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/40 transition-all cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
