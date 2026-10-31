import React, { useState } from 'react';
import { GameColor, Language, VipAdminControlState, Transaction } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import {
  Lock,
  Unlock,
  Zap,
  Clock,
  X,
  Check,
  Crown,
  CheckCircle2,
  XCircle,
  Smartphone,
} from 'lucide-react';

interface VipAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminControl: VipAdminControlState;
  onUpdateAdminControl: (newControl: Partial<VipAdminControlState>) => void;
  poolBets: Record<GameColor, number>;
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  pendingTransactions: Transaction[];
  onApproveDeposit: (txId: string) => void;
  onRejectDeposit: (txId: string) => void;
  language: Language;
}

export const VipAdminModal: React.FC<VipAdminModalProps> = ({
  isOpen,
  onClose,
  adminControl,
  onUpdateAdminControl,
  poolBets,
  balance,
  onUpdateBalance,
  pendingTransactions,
  onApproveDeposit,
  onRejectDeposit,
  language,
}) => {
  const t = getT(language);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const masterPin = '7777';

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === masterPin || pinInput.trim().toUpperCase() === 'TG777') {
      setIsAuthenticated(true);
      setAuthError('');
      sound.playAdmin();
    } else {
      setAuthError(language === 'hi' ? 'गलत पिन! केवल ऑथराइज्ड ओनर के लिए।' : 'Incorrect PIN. Owner access only.');
      sound.playLoss();
    }
  };

  const totalPool = (poolBets.RED || 0) + (poolBets.GREEN || 0) + (poolBets.BLUE || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1422] border-2 border-amber-500/50 rounded-2xl p-5 sm:p-6 text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-amber-500/30">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-amber-400 uppercase tracking-wider">
                {language === 'hi' ? 'वीआईपी एडमिन कंट्रोल पैनल' : 'VIP Admin Control Panel'}
              </h2>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-black uppercase">
                OWNER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'गेम परिणाम एवं पेमेंट अप्रूवल कंट्रोल' : 'Game Rigging & Deposit Approval System'}
            </p>
          </div>
        </div>

        {/* PIN Authentication Gate */}
        {!isAuthenticated ? (
          <form onSubmit={handleUnlock} className="py-6 max-w-sm mx-auto text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-sm font-bold text-white mb-1">
              {language === 'hi' ? 'ओनर सिक्योरिटी पिन दर्ज करें' : 'Enter Owner Master PIN'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Default PIN: <code className="text-amber-400 font-mono font-bold">7777</code>
            </p>

            <div className="mb-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="7777"
                autoFocus
                className="w-full text-center tracking-[0.4em] text-lg font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 text-white outline-none"
              />
              {authError && <p className="text-rose-400 text-xs mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{language === 'hi' ? 'एडमिन पैनल खोलें' : 'Unlock Panel'}</span>
            </button>
          </form>
        ) : (
          /* Unlocked Admin Panel */
          <div className="py-4 space-y-4">
            
            {/* 1. Deposit Approval & Rejection System (Prominent & Real) */}
            <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>
                    {language === 'hi' ? 'डिपॉजिट अप्रूवल एवं रिजेक्शन सिस्टम' : 'Deposit Approval & Rejection System'}
                  </span>
                </h4>
                <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                  {pendingTransactions.length} Pending
                </span>
              </div>

              {pendingTransactions.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                  {language === 'hi'
                    ? 'वर्तमान में कोई पेंडिंग डिपॉजिट नहीं है। जब कोई यूज़र पेमेंट करके UTR सबमिट करेगा, तो यहाँ दिखेगा।'
                    : 'No pending deposit requests right now.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pendingTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300 text-sm">₹{tx.amount}</span>
                          <span className="text-slate-300 text-[11px] font-mono">📱 {tx.userMobile || 'Player'}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          UTR: <strong className="text-white">{tx.utr}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playWin();
                            onApproveDeposit(tx.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'अप्रूव करें' : 'Approve'}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            sound.playLoss();
                            onRejectDeposit(tx.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'रिजेक्ट' : 'Reject'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Next Round Result Override */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {language === 'hi' ? 'अगले राउंड का विजेता रंग सेट करें' : 'Override Next Round Winner'}
                  </h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-400">
                  {adminControl.forcedColor}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    sound.playAdmin();
                    onUpdateAdminControl({ forcedColor: 'RANDOM' });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    adminControl.forcedColor === 'RANDOM'
                      ? 'bg-slate-200 text-slate-950 border-white'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Fair Random
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playAdmin();
                    onUpdateAdminControl({ forcedColor: 'RED' });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    adminControl.forcedColor === 'RED'
                      ? 'bg-red-600 text-white border-red-400'
                      : 'bg-red-950/40 text-red-300 border-red-900/60'
                  }`}
                >
                  🔴 Force RED
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playAdmin();
                    onUpdateAdminControl({ forcedColor: 'GREEN' });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    adminControl.forcedColor === 'GREEN'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60'
                  }`}
                >
                  🟢 Force GREEN
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playAdmin();
                    onUpdateAdminControl({ forcedColor: 'BLUE' });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    adminControl.forcedColor === 'BLUE'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-blue-950/40 text-blue-300 border-blue-900/60'
                  }`}
                >
                  🔵 Force BLUE
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playAdmin();
                    onUpdateAdminControl({ forcedColor: 'LEAST_BET' });
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                    adminControl.forcedColor === 'LEAST_BET'
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                  }`}
                >
                  ⚡ Auto Profit
                </button>
              </div>
            </div>

            {/* 3. Live Pool Breakdown & Balance Adjustment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">
                  Live Round Pool: ₹{totalPool.toLocaleString()}
                </h5>
                <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs">
                  <div className="bg-red-950/50 p-1 rounded text-red-300">
                    <div>RED</div>
                    <div className="font-bold">₹{poolBets.RED || 0}</div>
                  </div>
                  <div className="bg-emerald-950/50 p-1 rounded text-emerald-300">
                    <div>GREEN</div>
                    <div className="font-bold">₹{poolBets.GREEN || 0}</div>
                  </div>
                  <div className="bg-blue-950/50 p-1 rounded text-blue-300">
                    <div>BLUE</div>
                    <div className="font-bold">₹{poolBets.BLUE || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">
                  Player Balance: ₹{balance.toLocaleString()}
                </h5>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playWin();
                      onUpdateBalance(balance + 1000);
                    }}
                    className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold cursor-pointer"
                  >
                    +₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playWin();
                      onUpdateBalance(balance + 5000);
                    }}
                    className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 rounded text-xs font-bold cursor-pointer"
                  >
                    +₹5,000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playChip();
                      onUpdateBalance(500);
                    }}
                    className="py-1 px-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Timer Speed */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {language === 'hi' ? 'राउंड टाइमर गति' : 'Round Timer'}
              </span>
              <div className="flex gap-1">
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      sound.playAdmin();
                      onUpdateAdminControl({ roundDurationSeconds: sec });
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold border transition-all cursor-pointer ${
                      adminControl.roundDurationSeconds === sec
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
