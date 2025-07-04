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

export interface WebSocketMessage {
  type: string;
  payload: string;
}

export interface PlayerStats {
  id: string;
  name: string;
  number: number;
  position: string;
  teamId: string;
  photo: string;
  goals: number;
  assists: number;
  rating: number;
  minutesPlayed: number;
  yellowCards: number;
  redCards: number;
  shots: number;
  passes: number;
  passAccuracy: number;
}

export interface MatchEvent {
  id: string;
  type: string;
  minute: number;
  playerId?: string;
  playerName?: string;
  teamId: string;
  description: string;
  cardType?: string;
  isHomeTeam: boolean;
  timestamp: string;
}

export interface StreamInfo {
  id: string;
  url: string;
  type: string;
  quality: string;
  language: string;
  isLive: boolean;
  fallbackImage: string;
}

export interface FieldPosition {
  x: number;
  y: number;
  playerId: string;
  isBall: boolean;
}

export interface TeamStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  offsides: number;
  passes: number;
  passAccuracy: number;
}

export interface EnhancedGame extends Game {
  events: MatchEvent[];
  streams: StreamInfo[];
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  fieldPositions: FieldPosition[];
  attendance?: number;
  weather?: string;
  referee?: string;
}

export interface EnhancedTeamLineup {
  starting: PlayerStats[];
  substitutes: PlayerStats[];
  coach: string;
  formation: string;
}

export interface EnhancedLineup {
  homeTeam: EnhancedTeamLineup;
  awayTeam: EnhancedTeamLineup;
}
