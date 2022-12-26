export interface User {
  user: string;
  image: string;
}

export interface UserEstimate {
  user: User;
  value: string;
}

export enum GameState {
  CHOOSING,
  SUBMITTED,
  VIEWING,
}
