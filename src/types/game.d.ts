export type UserRole = "spectator" | "estimator";
export interface User {
  id: string;
  user: string;
  image?: string;
  role: UserRole;
}

export interface UserEstimate {
  user: User;
  value: string;
}

export type GameState = "choosing" | "submitted" | "viewing";
export type Users = Record<string, User>;
export type Estimates = Record<string, UserEstimate>;

export interface UseGameChannelProps {
  myUser: User | undefined;
  room: string | undefined;
  onlineUsers: Users;
  estimates: Estimates;
  gameState: GameState;
  confetti: boolean;
  submit: (estimate: string) => void;
  emitClear: () => void;
  emitContinue: () => void;
  emitRole: (role: UserRole) => void;
}
