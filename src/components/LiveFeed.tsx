import React from 'react';
import { LivePlayerBet, Language, GameColor } from '../types/game';
import { getT } from '../utils/translations';
import { Radio, Users } from 'lucide-react';

interface LiveFeedProps {
  liveBets: LivePlayerBet[];
  onlineCount: number;
  language: Language;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({
  liveBets,
  onlineCount,
  language,
}) => {
  const t = getT(language);

  const getColorPill = (color: GameColor) => {
    switch (color) {
      case 'RED':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'GREEN':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'BLUE':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {t.liveBets}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-bold">{onlineCount.toLocaleString()}</span>
          <span>{language === 'hi' ? 'खिलाड़ी खेल रहे हैं' : 'playing now'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
        {liveBets.slice(0, 9).map((bet) => (
          <div
            key={bet.id}
            className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl px-2.5 py-1.5 text-xs animate-fade-in"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-[10px] text-amber-400 shrink-0">
                {bet.userName[0].toUpperCase()}
              </div>
              <span className="text-slate-300 font-medium truncate text-[11px]">
                {bet.userName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getColorPill(bet.color)}`}>
                {bet.color}
              </span>
              <span className="font-mono font-bold text-amber-300 text-[11px]">
                ₹{bet.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
