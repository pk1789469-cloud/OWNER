import React from 'react';
import { GameColor, Language } from '../types/game';
import { getT } from '../utils/translations';
import { Flame, Clock, Sparkles } from 'lucide-react';

interface ColorWheelProps {
  currentRoundId: string;
  timeLeft: number;
  totalRoundTime: number;
  isLocked: boolean;
  isSpinning: boolean;
  winningColor: GameColor | null;
  language: Language;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  currentRoundId,
  timeLeft,
  totalRoundTime,
  isLocked,
  isSpinning,
  winningColor,
  language,
}) => {
  const t = getT(language);
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalRoundTime) * 100));

  const getColorTheme = (color: GameColor | null) => {
    switch (color) {
      case 'RED':
        return {
          bg: 'bg-red-600',
          border: 'border-red-400',
          text: 'text-red-400',
          label: language === 'hi' ? 'लाल (RED)' : 'RED',
        };
      case 'GREEN':
        return {
          bg: 'bg-emerald-600',
          border: 'border-emerald-400',
          text: 'text-emerald-400',
          label: language === 'hi' ? 'हरा (GREEN)' : 'GREEN',
        };
      case 'BLUE':
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-400',
          text: 'text-blue-400',
          label: language === 'hi' ? 'नीला (BLUE)' : 'BLUE',
        };
      default:
        return {
          bg: 'bg-slate-900',
          border: 'border-slate-700',
          text: 'text-white',
          label: '...',
        };
    }
  };

  const winTheme = getColorTheme(winningColor);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl p-4 bg-[#0d1322] border border-slate-800">
      
      {/* Top Info Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {t.period}
            </div>
            <div className="text-sm font-mono font-bold text-amber-300">
              #{currentRoundId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${isLocked ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
          <span className="text-xs uppercase font-bold text-slate-400">
            {t.countdown}:
          </span>
          <span className={`font-mono font-black text-xl tabular-nums ${isLocked ? 'text-red-400' : 'text-cyan-300'}`}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>
      </div>

      {/* Center Interactive Orb */}
      <div className="relative py-4 flex flex-col items-center justify-center">
        
        {/* Outer Circular Progress Ring */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
          
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-800"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-300 ease-linear ${isLocked ? 'text-red-500' : 'text-cyan-400'}`}
              strokeWidth="5"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* The Inner Orb */}
          <div 
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10 border-2 ${
              isSpinning 
                ? 'animate-spin border-amber-400 bg-gradient-to-tr from-red-600 via-green-600 to-blue-600' 
                : winningColor 
                  ? `${winTheme.bg} ${winTheme.border}`
                  : 'bg-slate-900 border-slate-750'
            }`}
          >
            {isSpinning ? (
              <div className="text-center text-white px-2">
                <Sparkles className="w-6 h-6 mx-auto animate-spin text-amber-300 mb-0.5" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {language === 'hi' ? 'ड्रॉ जारी...' : 'DRAWING...'}
                </span>
              </div>
            ) : winningColor ? (
              <div className="text-center text-white">
                <div className="text-[9px] font-bold uppercase text-white/80">
                  {language === 'hi' ? 'विजेता' : 'WINNER'}
                </div>
                <div className="text-lg sm:text-xl font-black uppercase">
                  {winTheme.label}
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-200">
                  {winningColor === 'BLUE' ? '3.0X' : '2.0X'}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
                  {timeLeft}s
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${isLocked ? 'text-red-400' : 'text-slate-400'}`}>
                  {isLocked ? t.lockBets : (language === 'hi' ? 'दांव चालू' : 'BETS OPEN')}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Status Ticker */}
      <div className="text-center">
        {isLocked ? (
          <span className="inline-block px-3 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
            {t.lockBets}
          </span>
        ) : (
          <p className="text-[11px] text-slate-400">
            {language === 'hi' 
              ? 'लाल (2x) · हरा (2x) · नीला (3x जैकपॉट)' 
              : 'Red (2x) · Green (2x) · Blue (3x Jackpot)'}
          </p>
        )}
      </div>

    </div>
  );
};
