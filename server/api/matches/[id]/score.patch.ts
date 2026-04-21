import { prisma } from "../../../utils/prisma";
import { handleApiError } from "../../../utils/api";
import {
  matchIdParamSchema,
  updateMatchScoreSchema,
} from "../../../../shared/schemas";

export default defineEventHandler(async (event) => {
  try {
    const { id } = matchIdParamSchema.parse(getRouterParams(event));
    const body = await readBody(event);
    const input = updateMatchScoreSchema.parse(body);

    const matchUpdated = await prisma.match.update({
      where: { id },
      data: {
        homeScore: input.homeScore,
        awayScore: input.awayScore,
        played: true,
      },
    });

    // Check if the current round is fully played
    const currentRoundMatches = await prisma.match.findMany({
      where: {
        tournamentId: matchUpdated.tournamentId,
        round: matchUpdated.round,
      },
    });

    const allPlayed = currentRoundMatches.every((m) => m.played);

    if (allPlayed) {
      // Find winners of this round
      const winners = currentRoundMatches.map((m) => {
        return (m.homeScore ?? 0) > (m.awayScore ?? 0) ? m.homeTeamId : m.awayTeamId;
      });

      // If it’s round 1 and we have an odd number of teams overall, we should fetch all teams 
      // and finding the one that didn't play.
      if (matchUpdated.round === 1) {
        const teams = await prisma.team.findMany({
          where: { tournamentId: matchUpdated.tournamentId }
        });
        const teamIds = teams.map(t => t.id);
        const playedIds = new Set<number>();
        currentRoundMatches.forEach(m => {
          playedIds.add(m.homeTeamId);
          playedIds.add(m.awayTeamId);
        });

        // Add the unplayed teams to winners to advance them to round 2
        for (const tId of teamIds) {
          if (!playedIds.has(tId)) {
            winners.push(tId);
          }
        }
      }

      // Shuffle winners to randomize next round or keep ordered
      // If we have at least 2 winners, generate next round
      if (winners.length >= 2) {
        const nextRoundPairings = [];
        for (let i = 0; i < winners.length - 1; i += 2) {
          nextRoundPairings.push({
            tournamentId: matchUpdated.tournamentId,
            round: matchUpdated.round + 1,
            homeTeamId: winners[i],
            awayTeamId: winners[i + 1],
          });
        }

        if (nextRoundPairings.length > 0) {
          await prisma.match.createMany({
            data: nextRoundPairings,
          });
        }
      }
    }

    return matchUpdated;
  } catch (error) {
    handleApiError(error);
  }
});
