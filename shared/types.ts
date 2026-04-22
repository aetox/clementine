export type MatchOutcomePoints = 3 | 1 | 0;

export interface TeamDTO {
  id: number;
  name: string;
  tournamentId: number;
  userId?: number | null;
  user?: { id: number; name: string | null; email: string } | null;
}

export interface MatchDTO {
  id: number;
  tournamentId: number;
  homeTeamId: number;
  awayTeamId: number;
  round: number;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}

export interface TournamentDTO {
  id: number;
  name: string;
  date: string;
  description: string | null;
  teams: TeamDTO[];
  matches: MatchDTO[];
}

export interface StandingEntry {
  teamId: number;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalAverage: number;
  points: number;
}

export interface RoundRobinPairing {
  round: number;
  homeTeamId: number;
  awayTeamId: number;
}
