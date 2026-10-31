import React, { useState } from 'react';
import { Language, Transaction } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, ArrowDownToLine, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onWithdrawSuccess: (amount: number, upiId: string) => void;
  pastWithdrawals: Transaction[];
  language: Language;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  balance,
  onWithdrawSuccess,
  pastWithdrawals,
  language,
}) => {
  const t = getT(language);
  const [amount, setAmount] = useState<string>('500');
  const [upiAddress, setUpiAddress] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickAmounts = [100, 300, 500, 1000, 2000, 5000];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < 100) {
      setErrorMsg(language === 'hi' ? 'न्यूनतम विड्रॉवल ₹100 है।' : 'Minimum withdrawal is ₹100.');
      sound.playLoss();
      return;
    }

    if (numAmount > balance) {
      setErrorMsg(language === 'hi' ? 'अपर्याप्त बैलेंस।' : 'Insufficient balance.');
      sound.playLoss();
      return;
    }

    if (!upiAddress.trim() || !upiAddress.includes('@')) {
      setErrorMsg(language === 'hi' ? 'कृपया मान्य UPI आईडी दर्ज करें (उदा. name@upi)।' : 'Please enter a valid UPI ID (e.g. name@upi).');
      sound.playLoss();
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);
    sound.playChip();

    setTimeout(() => {
      setIsProcessing(false);
      onWithdrawSuccess(numAmount, upiAddress.trim());
      sound.playWin();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0e1627] via-[#0a0f1d] to-[#060a12] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>{t.withdrawSubtitle}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400">
            {t.withdrawTitle}
          </h2>
        </div>

        {/* Available Balance Banner */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 my-4 flex items-center justify-between">
          <span className="text-xs text-slate-400 uppercase font-semibold">
            {language === 'hi' ? 'उपलब्ध बैलेंस' : 'Withdrawable Balance'}
          </span>
          <span className="text-lg sm:text-xl font-mono font-black text-amber-300">
            ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {t.enterWithdrawAmount}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">₹</span>
              <input
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono text-sm outline-none"
              />
            </div>

            {/* Quick Amounts */}
            <div className="grid grid-cols-6 gap-1.5 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    sound.playChip();
                    setAmount(q.toString());
                  }}
                  className={`py-1 rounded-lg text-xs font-mono font-semibold border ${
                    amount === q.toString()
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  ₹{q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              {t.enterUpiOrBank}
            </label>
            <input
              type="text"
              value={upiAddress}
              onChange={(e) => setUpiAddress(e.target.value)}
              placeholder="e.g. mobileNumber@ybl / upi"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono text-sm outline-none"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || balance < 100}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (language === 'hi' ? 'प्रोसेसिंग...' : 'Processing...') : t.withdrawSubmit}
          </button>
        </form>

        {/* Withdrawal History */}
        {pastWithdrawals.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'हालिया विड्रॉवल हिस्ट्री' : 'Recent Withdrawals'}
            </h4>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {pastWithdrawals.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between text-xs bg-slate-950/50 border border-slate-800/80 rounded-xl px-3 py-2"
                >
                  <div>
                    <div className="font-mono font-bold text-white">₹{tx.amount}</div>
                    <div className="text-[10px] text-slate-500">{tx.upiId || 'UPI'}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
