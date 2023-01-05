export interface User {
  id: string;
  user: string;
  image: string;
}

export interface UserEstimate {
  user: User;
  value: string;
}

export type GameState = "choosing" | "submitted" | "viewing";
export type Users = Record<string, User>;
export type Estimates = Record<string, UserEstimate>;

export interface UseGameChannelProps {
  myId: string;
  room: string | undefined;
  onlineUsers: Users;
  estimates: Estimates;
  gameState: GameState;
  confetti: boolean;
  submit: (estimate: string) => void;
  emitClear: () => void;
  emitContinue: () => void;
}
