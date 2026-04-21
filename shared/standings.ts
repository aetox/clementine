import type { MatchDTO, StandingEntry, TeamDTO } from "./types";

export function computeStandings(
  teams: TeamDTO[],
  matches: MatchDTO[],
): StandingEntry[] {
  const table = new Map<number, StandingEntry>();

  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalAverage: 0,
      points: 0,
    });
  }

  for (const match of matches) {
    if (!match.played || match.homeScore === null || match.awayScore === null) {
      continue;
    }

    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);

    if (!home || !away) {
      continue;
    }

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.wins += 1;
      home.points += 3;
      away.losses += 1;
    } else if (match.homeScore < match.awayScore) {
      away.wins += 1;
      away.points += 3;
      home.losses += 1;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const standings = [...table.values()].map((entry) => ({
    ...entry,
    goalAverage: entry.goalsFor - entry.goalsAgainst,
  }));

  standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.goalAverage !== a.goalAverage) {
      return b.goalAverage - a.goalAverage;
    }

    if (b.goalsFor !== a.goalsFor) {
      return b.goalsFor - a.goalsFor;
    }

    return a.teamName.localeCompare(b.teamName);
  });

  return standings;
}
