import React, { useEffect } from 'react';
import { GameColor, Language } from '../types/game';
import { getT } from '../utils/translations';
import { Trophy, Sparkles, X } from 'lucide-react';

interface WinCelebrationProps {
  winningColor: GameColor;
  winAmount: number;
  onDismiss: () => void;
  language: Language;
}

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  winningColor,
  winAmount,
  onDismiss,
  language,
}) => {
  const t = getT(language);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getColorConfig = (color: GameColor) => {
    switch (color) {
      case 'RED':
        return {
          glow: 'shadow-[0_0_80px_rgba(239,68,68,0.8)]',
          border: 'border-red-400',
          gradient: 'from-red-600 via-rose-600 to-amber-600',
        };
      case 'GREEN':
        return {
          glow: 'shadow-[0_0_80px_rgba(34,197,94,0.8)]',
          border: 'border-emerald-400',
          gradient: 'from-emerald-500 via-green-600 to-amber-500',
        };
      case 'BLUE':
        return {
          glow: 'shadow-[0_0_90px_rgba(59,130,246,0.9)]',
          border: 'border-cyan-300',
          gradient: 'from-blue-600 via-cyan-500 to-indigo-600',
        };
    }
  };

  const config = getColorConfig(winningColor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 text-center text-white border-2 ${config.border} bg-gradient-to-b ${config.gradient} ${config.glow} shadow-2xl animate-scale-up`}
      >
        {/* Dismiss Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Sparks */}
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center mb-3 animate-bounce">
          <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.winToast}</span>
        </div>

        <div className="text-4xl sm:text-5xl font-mono font-black text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] my-2">
          +₹{winAmount.toLocaleString()}
        </div>

        <p className="text-sm font-semibold text-white/90">
          {language === 'hi'
            ? `${winningColor} रंग पर दांव लगाने के लिए आपका बहुत-बहुत धन्यवाद!`
            : `Glorious payout on ${winningColor}! Funds credited directly.`}
        </p>

        <button
          onClick={onDismiss}
          className="mt-5 w-full py-3 rounded-xl bg-white text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:bg-amber-100 transition-all cursor-pointer"
        >
          {language === 'hi' ? 'अगला राउंड खेलें' : 'Play Next Round'}
        </button>
      </div>
    </div>
  );
};
