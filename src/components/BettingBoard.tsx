import React from 'react';
import { GameColor, Language } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import { Check } from 'lucide-react';

interface BettingBoardProps {
  selectedColor: GameColor | null;
  onSelectColor: (color: GameColor) => void;
  myBets: Record<GameColor, number>;
  poolBets: Record<GameColor, number>;
  isLocked: boolean;
  language: Language;
}

export const BettingBoard: React.FC<BettingBoardProps> = ({
  selectedColor,
  onSelectColor,
  myBets,
  poolBets,
  isLocked,
  language,
}) => {
  const t = getT(language);

  const colors: Array<{
    id: GameColor;
    nameEn: string;
    nameHi: string;
    multiplier: string;
    bgSelected: string;
    bgDefault: string;
    borderSelected: string;
    borderDefault: string;
    textAccent: string;
  }> = [
    {
      id: 'RED',
      nameEn: 'RED',
      nameHi: 'लाल',
      multiplier: '2.0X',
      bgSelected: 'bg-red-600',
      bgDefault: 'bg-red-950/40 hover:bg-red-900/50',
      borderSelected: 'border-red-400 ring-2 ring-red-400',
      borderDefault: 'border-red-800/60',
      textAccent: 'text-red-400',
    },
    {
      id: 'GREEN',
      nameEn: 'GREEN',
      nameHi: 'हरा',
      multiplier: '2.0X',
      bgSelected: 'bg-emerald-600',
      bgDefault: 'bg-emerald-950/40 hover:bg-emerald-900/50',
      borderSelected: 'border-emerald-400 ring-2 ring-emerald-400',
      borderDefault: 'border-emerald-800/60',
      textAccent: 'text-emerald-400',
    },
    {
      id: 'BLUE',
      nameEn: 'BLUE',
      nameHi: 'नीला',
      multiplier: '3.0X',
      bgSelected: 'bg-blue-600',
      bgDefault: 'bg-blue-950/40 hover:bg-blue-900/50',
      borderSelected: 'border-blue-400 ring-2 ring-blue-400',
      borderDefault: 'border-blue-800/60',
      textAccent: 'text-blue-400',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-3">
      {/* Three colors in ONE single horizontal line (लेटी हुई एक लाइन में, कॉम्पैक्ट और क्लीन) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {colors.map((c) => {
          const isSelected = selectedColor === c.id;
          const myAmount = myBets[c.id] || 0;
          const poolAmount = poolBets[c.id] || 0;

          return (
            <button
              key={c.id}
              disabled={isLocked}
              onClick={() => {
                if (isLocked) return;
                sound.playChip();
                onSelectColor(c.id);
              }}
              className={`relative rounded-xl py-3 px-2 sm:py-3.5 sm:px-4 text-center transition-all cursor-pointer border ${
                isLocked ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              } ${
                isSelected
                  ? `${c.bgSelected} ${c.borderSelected} text-white font-bold`
                  : `${c.bgDefault} ${c.borderDefault} text-slate-200`
              }`}
            >
              {/* Checkmark badge when active */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white text-slate-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Title & Multiplier */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm sm:text-base font-black uppercase tracking-wider">
                  {language === 'hi' ? c.nameHi : c.nameEn}
                </span>

                <span className={`text-[11px] sm:text-xs font-mono font-bold mt-0.5 px-2 py-0.5 rounded ${
                  isSelected ? 'bg-black/30 text-amber-300' : 'bg-slate-900/70 text-amber-400'
                }`}>
                  {c.multiplier}
                </span>
              </div>

              {/* Stake info */}
              <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="text-white/70">Pool: ₹{(poolAmount / 1000).toFixed(1)}k</span>
                <span className="font-mono font-bold text-yellow-300">
                  {myAmount > 0 ? `₹${myAmount}` : '₹0'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
