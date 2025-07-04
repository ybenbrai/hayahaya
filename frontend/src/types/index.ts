export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;
}

export interface Goal {
  id: string;
  playerId: string;
  playerName: string;
  minute: number;
  teamId: string;
  isOwnGoal: boolean;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: string;
  endTime: string;
  status: "scheduled" | "live" | "finished";
  homeScore: number;
  awayScore: number;
  goals: Goal[];
  venue: string;
  competition: string;
  currentMinute?: number;
  isHalfTime?: boolean;
}

export interface Lineup {
  homeTeam: {
    starting: Player[];
    substitutes: Player[];
    coach: string;
  };
  awayTeam: {
    starting: Player[];
    substitutes: Player[];
    coach: string;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  gameId: string;
}

export interface User {
  id: string;
  username: string;
  role: "viewer" | "admin";
  avatar?: string;
}

export interface LiveScoreUpdate {
  gameId: string;
  homeScore: number;
  awayScore: number;
  currentMinute: number;
  goals: Goal[];
  isHalfTime: boolean;
}
