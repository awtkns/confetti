export interface User {
  user: string;
  image: string;
}

export interface UserEstimate {
  user: User;
  value: number;
}

export enum GameState {
  CHOOSING,
  SUBMITTED,
  VIEWING,
}
