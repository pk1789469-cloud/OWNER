export type GameColor = 'RED' | 'GREEN' | 'BLUE';

export type Language = 'hi' | 'en';

export interface UserAccount {
  mobile: string;
  password?: string;
  name: string;
  balance: number;
  createdAt: number;
}

export interface UserBet {
  color: GameColor;
  amount: number;
  timestamp: number;
}

export interface RoundResult {
  roundId: string;
  winningColor: GameColor;
  multiplier: number;
  totalPool: number;
  timestamp: number;
}

export interface LivePlayerBet {
  id: string;
  userName: string;
  avatarSeed: string;
  color: GameColor;
  amount: number;
  timeStr: string;
}

export interface Transaction {
  id: string;
  userMobile: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  utr?: string;
  upiId?: string;
  accountNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  timestamp: number;
  method: string;
}

export interface VipAdminControlState {
  forcedColor: GameColor | 'RANDOM' | 'LEAST_BET';
  roundDurationSeconds: number;
  isAutoRiggingEnabled: boolean;
  houseWinRateTarget: number;
}
