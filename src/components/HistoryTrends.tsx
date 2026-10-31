import React, { useState } from 'react';
import { RoundResult, UserBet, Language, GameColor } from '../types/game';
import { getT } from '../utils/translations';
import { History, TrendingUp, UserCheck } from 'lucide-react';

interface HistoryTrendsProps {
  roundHistory: RoundResult[];
  myBetHistory: Array<UserBet & { roundId: string; win: boolean; payout: number }>;
  language: Language;
}

export const HistoryTrends: React.FC<HistoryTrendsProps> = ({
  roundHistory,
  myBetHistory,
  language,
}) => {
  const t = getT(language);
  const [activeTab, setActiveTab] = useState<'trends' | 'myBets'>('trends');

  // Compute color distribution
  const totalRounds = roundHistory.length || 1;
  const redCount = roundHistory.filter((r) => r.winningColor === 'RED').length;
  const greenCount = roundHistory.filter((r) => r.winningColor === 'GREEN').length;
  const blueCount = roundHistory.filter((r) => r.winningColor === 'BLUE').length;

  const redPercent = Math.round((redCount / totalRounds) * 100);
  const greenPercent = Math.round((greenCount / totalRounds) * 100);
  const bluePercent = Math.round((blueCount / totalRounds) * 100);

  const getColorBadge = (color: GameColor) => {
    switch (color) {
      case 'RED':
        return 'bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]';
      case 'GREEN':
        return 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(34,197,94,0.8)]';
      case 'BLUE':
        return 'bg-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.8)]';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t.recentTrends}</span>
          </button>

          <button
            onClick={() => setActiveTab('myBets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'myBets'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.betHistory}</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-mono">
          {totalRounds} {language === 'hi' ? 'राउंड्स' : 'Rounds'}
        </span>
      </div>

      {activeTab === 'trends' ? (
        <div>
          {/* Color Ratio Progress Bar */}
          <div className="mb-4 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-semibold">{t.statistics}</span>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-red-400">RED: {redPercent}%</span>
                <span className="text-emerald-400">GREEN: {greenPercent}%</span>
                <span className="text-blue-400">BLUE: {bluePercent}%</span>
              </div>
            </div>

            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800">
              <div style={{ width: `${redPercent}%` }} className="h-full bg-red-500 transition-all duration-500" />
              <div style={{ width: `${greenPercent}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
              <div style={{ width: `${bluePercent}%` }} className="h-full bg-blue-500 transition-all duration-500" />
            </div>
          </div>

          {/* Winning Beads Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {roundHistory.slice(0, 20).map((r, i) => (
              <div
                key={r.roundId + i}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-700 transition-all"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${getColorBadge(r.winningColor)}`}>
                  {r.winningColor[0]}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  ...{r.roundId.slice(-3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* My Bet History Table */
        <div className="overflow-x-auto">
          {myBetHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              {language === 'hi' ? 'आपने अभी तक कोई दांव नहीं लगाया है।' : 'No bets placed yet. Join the action above!'}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="py-2 px-2">{t.period}</th>
                  <th className="py-2 px-2">Color</th>
                  <th className="py-2 px-2 text-right">Stake</th>
                  <th className="py-2 px-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {myBetHistory.slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2 text-slate-300">#{item.roundId}</td>
                    <td className="py-2.5 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${getColorBadge(item.color)}`}>
                        {item.color}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-300">₹{item.amount}</td>
                    <td className="py-2.5 px-2 text-right">
                      {item.win ? (
                        <span className="text-emerald-400 font-bold">+₹{item.payout}</span>
                      ) : (
                        <span className="text-rose-400">-₹{item.amount}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};
