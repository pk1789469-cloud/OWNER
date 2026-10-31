import React from 'react';
import { Language, GameColor } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import { Coins, Zap, RotateCcw } from 'lucide-react';

interface ChipSelectorProps {
  selectedAmount: number;
  onSelectAmount: (amount: number) => void;
  onPlaceBet: () => void;
  onClearBets: () => void;
  onDoubleBet: () => void;
  onMaxBet: () => void;
  balance: number;
  selectedColor: GameColor | null;
  isLocked: boolean;
  language: Language;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  selectedAmount,
  onSelectAmount,
  onPlaceBet,
  onClearBets,
  onDoubleBet,
  onMaxBet,
  balance,
  selectedColor,
  isLocked,
  language,
}) => {
  const t = getT(language);

  const chips = [
    { value: 10, color: 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 border-slate-300' },
    { value: 50, color: 'bg-gradient-to-b from-blue-400 to-blue-600 text-white border-blue-300' },
    { value: 100, color: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-300' },
    { value: 500, color: 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-amber-200' },
    { value: 1000, color: 'bg-gradient-to-b from-purple-500 to-purple-700 text-white border-purple-300' },
    { value: 5000, color: 'bg-gradient-to-b from-rose-500 to-rose-700 text-white border-rose-300' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      
      {/* Header & Quick Modifiers */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t.quickChips}
          </span>
        </div>

        {/* Action modifiers (Double, Max, Clear) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              sound.playChip();
              onDoubleBet();
            }}
            disabled={isLocked || selectedAmount * 2 > balance}
            className="px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
          >
            {t.double}
          </button>
          <button
            onClick={() => {
              sound.playChip();
              onMaxBet();
            }}
            disabled={isLocked || balance <= 0}
            className="px-2.5 py-1 text-xs font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
          >
            {t.max}
          </button>
          <button
            onClick={() => {
              sound.playChip();
              onClearBets();
            }}
            disabled={isLocked}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.clear}</span>
          </button>
        </div>
      </div>

      {/* Chips Selection Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        {chips.map((chip) => {
          const isSelected = selectedAmount === chip.value;
          const isAffordable = balance >= chip.value;

          return (
            <button
              key={chip.value}
              disabled={isLocked || !isAffordable}
              onClick={() => {
                sound.playChip();
                onSelectAmount(chip.value);
              }}
              className={`flex-1 min-w-[52px] h-[52px] sm:min-w-[62px] sm:h-[62px] rounded-full border-2 flex flex-col items-center justify-center font-black transition-all cursor-pointer relative shrink-0 ${chip.color} ${
                isSelected 
                  ? 'scale-110 ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] -translate-y-1' 
                  : 'hover:scale-105 opacity-90'
              } ${(!isAffordable || isLocked) ? 'opacity-30 cursor-not-allowed hover:scale-100' : ''}`}
            >
              {/* Inner Chip Grooves */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-dashed border-black/30 flex items-center justify-center">
                <span className="text-[11px] sm:text-xs font-mono font-black drop-shadow-sm">
                  ₹{chip.value >= 1000 ? `${chip.value / 1000}k` : chip.value}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Big Place Bet CTA Button */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          {selectedColor ? (
            <span>
              {language === 'hi' ? 'चयनित:' : 'Selected:'}{' '}
              <strong className="text-amber-400 font-bold uppercase">{selectedColor}</strong>{' '}
              · ₹{selectedAmount}
            </span>
          ) : (
            <span className="text-amber-400 font-medium">
              {language === 'hi' ? 'कृपया ऊपर दिए गए लाल, हरे या नीले कार्ड पर क्लिक करें' : 'Please select a color above to bet'}
            </span>
          )}
        </div>

        <button
          onClick={() => {
            sound.playChip();
            onPlaceBet();
          }}
          disabled={!selectedColor || selectedAmount <= 0 || isLocked || balance < selectedAmount}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            !selectedColor || selectedAmount <= 0 || isLocked || balance < selectedAmount
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 hover:scale-[1.02] active:scale-95'
          }`}
        >
          <Zap className="w-5 h-5 fill-current" />
          <span>
            {t.placeBet} (₹{selectedAmount})
          </span>
        </button>
      </div>

    </div>
  );
};
