import React, { useState, useEffect } from 'react';
import {
  GameColor,
  Language,
  RoundResult,
  UserBet,
  LivePlayerBet,
  Transaction,
  UserAccount,
  VipAdminControlState,
} from './types/game';
import { getT } from './utils/translations';
import { sound } from './utils/audio';
import { NeonSidebars } from './components/NeonSidebars';
import { Header } from './components/Header';
import { ColorWheel } from './components/ColorWheel';
import { BettingBoard } from './components/BettingBoard';
import { ChipSelector } from './components/ChipSelector';
import { LiveFeed } from './components/LiveFeed';
import { HistoryTrends } from './components/HistoryTrends';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { SettingsModal } from './components/SettingsModal';
import { VipAdminModal } from './components/VipAdminModal';
import { AuthModal } from './components/AuthModal';
import { WinCelebration } from './components/WinCelebration';
import { BottomBar } from './components/BottomBar';

const INITIAL_ROUNDS: RoundResult[] = [
  { roundId: '20261031088', winningColor: 'RED', multiplier: 2.0, totalPool: 48200, timestamp: Date.now() - 30000 },
  { roundId: '20261031087', winningColor: 'BLUE', multiplier: 3.0, totalPool: 61500, timestamp: Date.now() - 60000 },
  { roundId: '20261031086', winningColor: 'GREEN', multiplier: 2.0, totalPool: 53100, timestamp: Date.now() - 90000 },
  { roundId: '20261031085', winningColor: 'RED', multiplier: 2.0, totalPool: 49000, timestamp: Date.now() - 120000 },
  { roundId: '20261031084', winningColor: 'GREEN', multiplier: 2.0, totalPool: 57400, timestamp: Date.now() - 150000 },
  { roundId: '20261031083', winningColor: 'RED', multiplier: 2.0, totalPool: 46800, timestamp: Date.now() - 180000 },
  { roundId: '20261031082', winningColor: 'BLUE', multiplier: 3.0, totalPool: 64200, timestamp: Date.now() - 210000 },
  { roundId: '20261031081', winningColor: 'GREEN', multiplier: 2.0, totalPool: 51000, timestamp: Date.now() - 240000 },
];

const INITIAL_LIVE_BETS: LivePlayerBet[] = [
  { id: '1', userName: 'rohit_99', avatarSeed: '1', color: 'RED', amount: 500, timeStr: 'Just now' },
  { id: '2', userName: 'vikram_77', avatarSeed: '2', color: 'BLUE', amount: 1000, timeStr: '1s ago' },
  { id: '3', userName: 'akash_king', avatarSeed: '3', color: 'GREEN', amount: 200, timeStr: '2s ago' },
  { id: '4', userName: 'priya_tg', avatarSeed: '4', color: 'RED', amount: 100, timeStr: '2s ago' },
  { id: '5', userName: 'kabir_boss', avatarSeed: '5', color: 'BLUE', amount: 500, timeStr: '3s ago' },
  { id: '6', userName: 'sunil_pro', avatarSeed: '6', color: 'GREEN', amount: 1000, timeStr: '4s ago' },
];

const RANDOM_NAMES = [
  'arun_boss', 'rahul_99', 'deepak_win', 'manoj_star', 'rajesh_tg',
  'vijay_pro', 'amit_king', 'sharma_ji', 'sanjay_delhi', 'anil_super',
  'neha_queen', 'pooja_luck', 'karan_777', 'suraj_top', 'harsh_99'
];

export default function App() {
  // Current User Auth
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('tg_gaming_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Balance
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('tg_gaming_balance');
    return saved ? parseFloat(saved) : 500;
  });

  const [language, setLanguage] = useState<Language>('hi');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  
  // Game Round State
  const [roundCounter, setRoundCounter] = useState<number>(89);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningColor, setWinningColor] = useState<GameColor | null>(null);

  // Betting State
  const [selectedColor, setSelectedColor] = useState<GameColor | null>('RED');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [myBets, setMyBets] = useState<Record<GameColor, number>>({ RED: 0, GREEN: 0, BLUE: 0 });
  const [poolBets, setPoolBets] = useState<Record<GameColor, number>>({ RED: 18400, GREEN: 22100, BLUE: 12500 });
  
  // History & Online Stats
  const [roundHistory, setRoundHistory] = useState<RoundResult[]>(INITIAL_ROUNDS);
  const [myBetHistory, setMyBetHistory] = useState<Array<UserBet & { roundId: string; win: boolean; payout: number }>>([]);
  const [liveBets, setLiveBets] = useState<LivePlayerBet[]>(INITIAL_LIVE_BETS);
  const [onlineCount, setOnlineCount] = useState<number>(1428);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tg_gaming_txs');
    return saved ? JSON.parse(saved) : [];
  });

  // VIP Admin Control State
  const [adminControl, setAdminControl] = useState<VipAdminControlState>({
    forcedColor: 'RANDOM',
    roundDurationSeconds: 30,
    isAutoRiggingEnabled: false,
    houseWinRateTarget: 70,
  });

  // Modal Visibility State
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [winCelebration, setWinCelebration] = useState<{ open: boolean; color: GameColor; amount: number }>({
    open: false,
    color: 'RED',
    amount: 0,
  });

  const isLocked = timeLeft <= 5 || isSpinning;
  const currentRoundId = `202610310${roundCounter < 100 ? roundCounter : roundCounter}`;
  const t = getT(language);

  // Sync balance & transactions with localStorage
  useEffect(() => {
    localStorage.setItem('tg_gaming_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('tg_gaming_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    sound.enabled = isSoundEnabled;
  }, [isSoundEnabled]);

  // Online Players & Live Multiplayer Bets Simulator
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1200, Math.min(2200, prev + delta));
      });

      if (timeLeft > 5 && !isSpinning) {
        const colors: GameColor[] = ['RED', 'GREEN', 'BLUE'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const amounts = [100, 200, 500, 1000];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];

        setLiveBets((prev) => [
          {
            id: Date.now().toString(),
            userName: randomName,
            avatarSeed: Math.random().toString(),
            color: randomColor,
            amount: randomAmount,
            timeStr: 'Just now',
          },
          ...prev.slice(0, 11),
        ]);

        setPoolBets((prev) => ({
          ...prev,
          [randomColor]: (prev[randomColor] || 0) + randomAmount,
        }));
      }
    }, 2500);

    return () => clearInterval(liveInterval);
  }, [timeLeft, isSpinning]);

  // Round Timer Countdown Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          if (prev <= 6) {
            sound.playTick(true);
          }
          return prev - 1;
        }

        resolveRound();
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [adminControl, myBets, poolBets, roundCounter, balance]);

  // Resolve Round Outcome with VIP Admin override support
  const resolveRound = () => {
    setIsSpinning(true);
    sound.playLaser();

    let resultColor: GameColor;

    if (adminControl.forcedColor === 'RED') {
      resultColor = 'RED';
    } else if (adminControl.forcedColor === 'GREEN') {
      resultColor = 'GREEN';
    } else if (adminControl.forcedColor === 'BLUE') {
      resultColor = 'BLUE';
    } else if (adminControl.forcedColor === 'LEAST_BET') {
      const redTotal = poolBets.RED || 0;
      const greenTotal = poolBets.GREEN || 0;
      const blueTotal = poolBets.BLUE || 0;
      if (blueTotal <= redTotal && blueTotal <= greenTotal) {
        resultColor = 'BLUE';
      } else if (redTotal <= greenTotal) {
        resultColor = 'RED';
      } else {
        resultColor = 'GREEN';
      }
    } else {
      const rand = Math.random();
      if (rand < 0.42) {
        resultColor = 'RED';
      } else if (rand < 0.82) {
        resultColor = 'GREEN';
      } else {
        resultColor = 'BLUE';
      }
    }

    setTimeout(() => {
      setIsSpinning(false);
      setWinningColor(resultColor);

      const playerBetOnWinner = myBets[resultColor] || 0;
      const totalPlayerBet = (myBets.RED || 0) + (myBets.GREEN || 0) + (myBets.BLUE || 0);
      const multiplier = resultColor === 'BLUE' ? 3.0 : 2.0;

      if (playerBetOnWinner > 0) {
        const totalWinnings = playerBetOnWinner * multiplier;
        setBalance((prev) => prev + totalWinnings);
        sound.playWin();

        setWinCelebration({
          open: true,
          color: resultColor,
          amount: totalWinnings,
        });

        setMyBetHistory((prev) => [
          {
            color: resultColor,
            amount: playerBetOnWinner,
            timestamp: Date.now(),
            roundId: currentRoundId,
            win: true,
            payout: totalWinnings,
          },
          ...prev,
        ]);
      } else if (totalPlayerBet > 0) {
        sound.playLoss();
        const betColor = (myBets.RED > 0 ? 'RED' : myBets.GREEN > 0 ? 'GREEN' : 'BLUE') as GameColor;
        setMyBetHistory((prev) => [
          {
            color: betColor,
            amount: totalPlayerBet,
            timestamp: Date.now(),
            roundId: currentRoundId,
            win: false,
            payout: 0,
          },
          ...prev,
        ]);
      }

      const totalRoundPool = (poolBets.RED || 0) + (poolBets.GREEN || 0) + (poolBets.BLUE || 0);
      setRoundHistory((prev) => [
        {
          roundId: currentRoundId,
          winningColor: resultColor,
          multiplier,
          totalPool: totalRoundPool,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 19),
      ]);

      setTimeout(() => {
        setWinningColor(null);
        setMyBets({ RED: 0, GREEN: 0, BLUE: 0 });
        setRoundCounter((prev) => prev + 1);
        setTimeLeft(adminControl.roundDurationSeconds || 30);
        setPoolBets({
          RED: Math.floor(14000 + Math.random() * 8000),
          GREEN: Math.floor(15000 + Math.random() * 8000),
          BLUE: Math.floor(9000 + Math.random() * 6000),
        });
      }, 4000);

    }, 2200);
  };

  // Place Bet Handler
  const handlePlaceBet = () => {
    if (!selectedColor || isLocked || selectedAmount <= 0) return;
    if (balance < selectedAmount) {
      sound.playLoss();
      setIsDepositOpen(true);
      return;
    }

    setBalance((prev) => prev - selectedAmount);

    setMyBets((prev) => ({
      ...prev,
      [selectedColor]: (prev[selectedColor] || 0) + selectedAmount,
    }));

    setPoolBets((prev) => ({
      ...prev,
      [selectedColor]: (prev[selectedColor] || 0) + selectedAmount,
    }));

    sound.playChip();
  };

  const handleDoubleBet = () => {
    if (selectedAmount * 2 <= balance) {
      setSelectedAmount((prev) => prev * 2);
    }
  };

  const handleMaxBet = () => {
    if (balance > 0) {
      setSelectedAmount(Math.min(5000, Math.floor(balance)));
    }
  };

  const handleClearBets = () => {
    setSelectedAmount(100);
  };

  // User submits a deposit request -> Status is PENDING until Admin Approves!
  const handleRequestDeposit = (amount: number, utr: string) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      userMobile: currentUser?.mobile || '9876543210',
      type: 'DEPOSIT',
      amount,
      utr,
      status: 'PENDING', // Admin must approve
      timestamp: Date.now(),
      method: 'PhonePe / UPI (tggamingempire@ybl)',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Admin approves a pending deposit -> Balance is credited!
  const handleApproveDeposit = (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (tx && tx.status === 'PENDING') {
      setBalance((prev) => prev + tx.amount);
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, status: 'COMPLETED' } : t))
      );
    }
  };

  // Admin rejects a pending deposit
  const handleRejectDeposit = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'REJECTED' } : t))
    );
  };

  // Withdraw Handler
  const handleWithdrawSuccess = (amount: number, upiId: string) => {
    setBalance((prev) => Math.max(0, prev - amount));
    const newTx: Transaction = {
      id: Date.now().toString(),
      userMobile: currentUser?.mobile || 'Player',
      type: 'WITHDRAW',
      amount,
      upiId,
      status: 'COMPLETED',
      timestamp: Date.now(),
      method: 'Instant UPI Payout',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setBalance(user.balance || 500);
    localStorage.setItem('tg_gaming_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tg_gaming_current_user');
  };

  const pendingDeposits = transactions.filter((t) => t.type === 'DEPOSIT' && t.status === 'PENDING');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col relative">
      
      {/* Sleek Crisp Accent Sidebars */}
      <NeonSidebars />

      {/* Header with Title, User Mobile State, Balance, Deposit, Settings Icon */}
      <Header
        balance={balance}
        onlineCount={onlineCount}
        currentUser={currentUser}
        language={language}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
      />

      {/* Main Game Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3">
        
        {/* Pending Deposit Notification for User */}
        {pendingDeposits.length > 0 && (
          <div className="max-w-2xl mx-auto mb-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span>
              ⏳ {language === 'hi' 
                ? `आपका ₹${pendingDeposits[0].amount} का डिपॉजिट एडमिन अप्रूवल के लिए पेंडिंग है।` 
                : `Your deposit of ₹${pendingDeposits[0].amount} is pending Admin Approval.`}
            </span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="font-bold underline text-[11px] text-amber-400 hover:text-white cursor-pointer ml-2"
            >
              {language === 'hi' ? 'एडमिन में चेक करें' : 'Admin Panel'}
            </button>
          </div>
        )}

        {/* 1. Dynamic Countdown Wheel */}
        <ColorWheel
          currentRoundId={currentRoundId}
          timeLeft={timeLeft}
          totalRoundTime={adminControl.roundDurationSeconds || 30}
          isLocked={isLocked}
          isSpinning={isSpinning}
          winningColor={winningColor}
          language={language}
        />

        {/* 2. Three Colors in a Single Horizontal Row (लेटी हुई एक लाइन में, कॉम्पैक्ट) */}
        <BettingBoard
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          myBets={myBets}
          poolBets={poolBets}
          isLocked={isLocked}
          language={language}
        />

        {/* 3. Chip Selector & Quick Modifiers */}
        <ChipSelector
          selectedAmount={selectedAmount}
          onSelectAmount={setSelectedAmount}
          onPlaceBet={handlePlaceBet}
          onClearBets={handleClearBets}
          onDoubleBet={handleDoubleBet}
          onMaxBet={handleMaxBet}
          balance={balance}
          selectedColor={selectedColor}
          isLocked={isLocked}
          language={language}
        />

        {/* 4. Live Multiplayer Feed */}
        <LiveFeed
          liveBets={liveBets}
          onlineCount={onlineCount}
          language={language}
        />

        {/* 5. Win Trends & History */}
        <HistoryTrends
          roundHistory={roundHistory}
          myBetHistory={myBetHistory}
          language={language}
        />

      </main>

      {/* Bottom Sticky Action Bar (डिपॉजिट, विड्रॉवल, सेटिंग नीचे की साइड) */}
      <BottomBar
        balance={balance}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        language={language}
      />

      {/* Footer */}
      <footer className="w-full py-3 text-center border-t border-slate-900 bg-[#080c14] text-xs text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>TG GAMING OWNER</span>
          <span>·</span>
          <span>PhonePe UPI: <strong className="text-amber-400 font-mono">tggamingempire@ybl</strong></span>
        </p>
      </footer>

      {/* Login & Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        language={language}
      />

      {/* Deposit Modal (Dynamic PhonePe for any amount & admin queue) */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onRequestDeposit={handleRequestDeposit}
        recentDeposits={transactions.filter((t) => t.type === 'DEPOSIT')}
        userMobile={currentUser?.mobile}
        language={language}
      />

      {/* Withdrawal Modal */}
      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        balance={balance}
        onWithdrawSuccess={handleWithdrawSuccess}
        pastWithdrawals={transactions.filter((t) => t.type === 'WITHDRAW')}
        language={language}
      />

      {/* Settings Modal (Language & Sound) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        onSelectLanguage={setLanguage}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* VIP Admin Master Control Modal (Deposit Approval & Next Round Outcome) */}
      <VipAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminControl={adminControl}
        onUpdateAdminControl={(updates) => setAdminControl((prev) => ({ ...prev, ...updates }))}
        poolBets={poolBets}
        balance={balance}
        onUpdateBalance={setBalance}
        pendingTransactions={pendingDeposits}
        onApproveDeposit={handleApproveDeposit}
        onRejectDeposit={handleRejectDeposit}
        language={language}
      />

      {/* Win Celebration */}
      {winCelebration.open && (
        <WinCelebration
          winningColor={winCelebration.color}
          winAmount={winCelebration.amount}
          onDismiss={() => setWinCelebration((prev) => ({ ...prev, open: false }))}
          language={language}
        />
      )}

    </div>
  );
}
