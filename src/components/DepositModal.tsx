import React, { useState } from 'react';
import { Language, Transaction } from '../types/game';
import { getT } from '../utils/translations';
import { sound } from '../utils/audio';
import { X, Copy, Check, QrCode, Smartphone, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDeposit: (amount: number, utr: string) => void;
  recentDeposits: Transaction[];
  userMobile?: string;
  language: Language;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onRequestDeposit,
  recentDeposits,
  userMobile,
  language,
}) => {
  const t = getT(language);
  const upiId = 'tggamingempire@ybl';
  
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [copied, setCopied] = useState<boolean>(false);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submittedUtr, setSubmittedUtr] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset amounts including ₹200 and ₹500 explicitly requested
  const amounts = [100, 200, 300, 500, 1000, 2000];

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    sound.playChip();
    setTimeout(() => setCopied(false), 2000);
  };

  const openPhonePeDirect = (amount: number) => {
    sound.playChip();
    // PhonePe intent and universal UPI intent with exact selected amount
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('TG Gaming Owner')}&am=${amount}&cu=INR&tn=${encodeURIComponent('TG Gaming Deposit')}`;
    const phonePeUrl = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('TG Gaming Owner')}&am=${amount}&cu=INR`;
    
    try {
      window.location.href = phonePeUrl;
      setTimeout(() => {
        window.location.href = upiUrl;
      }, 500);
    } catch {
      window.location.href = upiUrl;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया सही 12-अंकीय UTR / रेफ़रंस नंबर दर्ज करें।'
          : 'Please enter a valid 12-digit UTR / reference number.'
      );
      sound.playLoss();
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    sound.playWin();

    setTimeout(() => {
      setIsSubmitting(false);
      onRequestDeposit(selectedAmount, cleanUtr);
      setSubmittedUtr(cleanUtr);
      setUtrNumber('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#101726] border border-amber-500/40 rounded-2xl p-5 sm:p-6 text-slate-100 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-3 border-b border-slate-800">
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-amber-300">
            {language === 'hi' ? 'पैसे जमा करें (डिपॉजिट)' : 'Deposit Cash'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            PhonePe & UPI Auto Gateway · TG Gaming Owner
          </p>
        </div>

        {/* Selected Amount Grid */}
        <div className="my-3">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            {language === 'hi' ? 'राशि चुनें (रुपये)' : 'Select Amount (INR)'}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {amounts.map((amt) => {
              const isSelected = selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    sound.playChip();
                    setSelectedAmount(amt);
                  }}
                  className={`py-2 px-1 rounded-xl font-mono font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ₹{amt}
                </button>
              );
            })}
          </div>
        </div>

        {/* QR Code & UPI Copy */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3 my-3">
          {/* QR Code Image */}
          <div className="p-1.5 bg-white rounded-xl shrink-0">
            <img
              src="/assets/aistudio/Screenshot_20261031-165524_02660bea.png"
              alt="PhonePe QR Code tggamingempire@ybl"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 w-full text-center sm:text-left">
            <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1">
              UPI ID
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 mb-2">
              <span className="font-mono text-xs font-bold text-amber-300 truncate flex-1">
                {upiId}
              </span>
              <button
                type="button"
                onClick={handleCopyUPI}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              {language === 'hi'
                ? `QR कोड स्कैन करें या नीचे दिए बटन से PhonePe खोलें। पेमेंट के बाद UTR नंबर डालें।`
                : `Scan QR code or click PhonePe button below. Enter UTR after paying.`}
            </p>
          </div>
        </div>

        {/* DYNAMIC AUTO PHONEPE BUTTON FOR ANY SELECTED AMOUNT (200, 500, ETC.) */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => openPhonePeDirect(selectedAmount)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 border border-purple-400/40 cursor-pointer active:scale-95 transition-all"
          >
            <Smartphone className="w-4 h-4 text-purple-200" />
            <span>
              {language === 'hi'
                ? `⚡ PhonePe से सीधे ₹${selectedAmount} पेमेंट करें`
                : `⚡ Pay ₹${selectedAmount} Directly with PhonePe`}
            </span>
          </button>
        </div>

        {/* UTR Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {language === 'hi' ? '12-अंकों का UTR / रेफ़रंस नंबर डालें' : 'Enter 12-digit UTR / Reference No.'}
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 430291827461"
              maxLength={16}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm outline-none focus:border-amber-400"
            />
            {errorMsg && <p className="text-rose-400 text-xs mt-1">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting
                ? (language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...')
                : (language === 'hi' ? `₹${selectedAmount} डिपॉजिट सबमिट करें` : `Submit ₹${selectedAmount} Deposit`)}
            </span>
          </button>
        </form>

        {/* Confirmation banner when request is submitted for Admin approval */}
        {submittedUtr && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-spin" />
            <div>
              <p className="font-bold">
                {language === 'hi'
                  ? 'डिपॉजिट सबमिट हो गया! एडमिन जल्द ही अप्रूव करेंगे।'
                  : 'Deposit submitted! Waiting for Admin approval.'}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">UTR: {submittedUtr}</p>
            </div>
          </div>
        )}

        {/* Recent Deposits status list for this user */}
        {recentDeposits.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-1.5">
              {language === 'hi' ? 'आपकी हालिया डिपॉजिट स्थिति' : 'Recent Deposits Status'}
            </h4>
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {recentDeposits.slice(0, 3).map((dep) => (
                <div
                  key={dep.id}
                  className="flex items-center justify-between bg-slate-950 p-2 rounded-lg text-xs border border-slate-800"
                >
                  <div>
                    <span className="font-mono font-bold text-white">₹{dep.amount}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-mono">UTR: {dep.utr}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      dep.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : dep.status === 'REJECTED'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-amber-500/20 text-amber-300 animate-pulse'
                    }`}
                  >
                    {dep.status === 'COMPLETED'
                      ? (language === 'hi' ? 'अप्रूव्ड' : 'Approved')
                      : dep.status === 'REJECTED'
                      ? (language === 'hi' ? 'रिजेक्ट' : 'Rejected')
                      : (language === 'hi' ? 'पेंडिंग (एडमिन चेक)' : 'Pending')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
