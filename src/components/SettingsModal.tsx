import React from 'react';
import { Language } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import {
  X,
  Languages,
  Volume2,
  VolumeX,
  ShieldCheck,
  BookOpen,
  Check,
  Music,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectLanguage,
  isSoundEnabled,
  onToggleSound,
  onOpenAdmin,
}) => {
  const t = getT(language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#101726] border border-slate-700 rounded-2xl p-5 text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-3 border-b border-slate-800">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-amber-300">
            {language === 'hi' ? 'सेटिंग्स (Settings)' : 'Settings'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">TG Gaming Owner</p>
        </div>

        <div className="py-3 space-y-3">
          
          {/* 1. Dedicated Sound Effects Setting (साउंड सेटिंग) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                  {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    {language === 'hi' ? 'गेम साउंड (Sound FX)' : 'Game Audio'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isSoundEnabled 
                      ? (language === 'hi' ? 'साउंड चालू है (ON)' : 'Audio Enabled (ON)') 
                      : (language === 'hi' ? 'साउंड बंद है (MUTE)' : 'Audio Muted (OFF)')}
                  </div>
                </div>
              </div>

              {/* Sound Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  onToggleSound();
                  sound.playChip();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isSoundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    isSoundEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Test sound button */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {language === 'hi' ? 'चिप्स और जीत की ध्वनि' : 'Chips and win fanfare'}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playWin();
                }}
                disabled={!isSoundEnabled}
                className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-amber-300 border border-slate-700 rounded text-[11px] font-semibold cursor-pointer flex items-center gap-1"
              >
                <Music className="w-3 h-3" />
                <span>{language === 'hi' ? 'साउंड चेक करें' : 'Test Sound'}</span>
              </button>
            </div>
          </div>

          {/* 2. Language Selection (भाषा का विकल्प) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Languages className="w-4 h-4 text-cyan-400" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {language === 'hi' ? 'भाषा चुनें (Select Language)' : 'Select Language'}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playChip();
                  onSelectLanguage('hi');
                }}
                className={`py-2 px-3 rounded-lg font-bold text-xs sm:text-sm border flex items-center justify-between transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>🇮🇳</span>
                  <span>हिंदी (Hindi)</span>
                </div>
                {language === 'hi' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playChip();
                  onSelectLanguage('en');
                }}
                className={`py-2 px-3 rounded-lg font-bold text-xs sm:text-sm border flex items-center justify-between transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-black'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>English</span>
                </div>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* 3. VIP Admin Portal Link */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{language === 'hi' ? 'वीआईपी एडमिन कंट्रोल' : 'VIP Admin Control'}</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">PIN: 7777</span>
            </div>

            <p className="text-[11px] text-slate-400 mb-2">
              {language === 'hi'
                ? 'गेम परिणाम तय करने और डिपॉजिट पेमेंट्स अप्रूव/रिजेक्ट करने के लिए एडमिन खोलें।'
                : 'Access owner controls to rig rounds or approve/reject pending deposits.'}
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase rounded-lg transition-all cursor-pointer"
            >
              {language === 'hi' ? '👑 एडमिन कंट्रोल खोलें' : '👑 Open VIP Admin'}
            </button>
          </div>

          {/* 4. Game Rules */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" />
              <h4 className="text-xs font-bold uppercase">
                {language === 'hi' ? 'गेम के नियम' : 'Game Rules'}
              </h4>
            </div>

            <ul className="space-y-1 text-xs text-slate-300">
              <li>🔴 RED (लाल): 2.0x पेआउट</li>
              <li>🟢 GREEN (हरा): 2.0x पेआउट</li>
              <li>🔵 BLUE (नीला): 3.0x जैकपॉट पेआउट</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
