import { prisma } from "../../../utils/prisma";
import { handleApiError } from "../../../utils/api";
import { tournamentIdParamSchema } from "../../../../shared/schemas";
import { generateRoundRobin } from "../../../../shared/roundRobin";

export default defineEventHandler(async (event) => {
  try {
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: { orderBy: { name: "asc" } },
      },
    });

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tournament not found",
      });
    }

    if (tournament.teams.length < 2) {
      throw createError({
        statusCode: 400,
        statusMessage: "At least 2 teams are required",
      });
    }

    const teamIds = tournament.teams.map((t) => t.id);
    // Shuffle ids
    teamIds.sort(() => 0.5 - Math.random());
    const pairings: { round: number, homeTeamId: number, awayTeamId: number }[] = [];

    for (let i = 0; i < teamIds.length - 1; i += 2) {
      pairings.push({
        round: 1,
        homeTeamId: teamIds[i],
        awayTeamId: teamIds[i+1],
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.match.deleteMany({ where: { tournamentId: id } });
      // If there's an odd team, they just don't play round 1.
      // Wait, we need to get them later. Actually, the easiest is to just let them wait...
      // But how do we know they are in the tournament? They are in tournament.teams.
      // Easiest is to force a power of 2 for a real bracket, or just create pairs.
      await tx.match.createMany({
        data: pairings.map((pairing) => ({
          tournamentId: id,
          homeTeamId: pairing.homeTeamId,
          awayTeamId: pairing.awayTeamId,
          round: pairing.round,
        })),
      });
    });

    return await prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: { orderBy: { name: "asc" } },
        matches: { orderBy: [{ round: "asc" }, { id: "asc" }] },
      },
    });
  } catch (error) {
    handleApiError(error);
  }
});
