import { prisma } from "../../../utils/prisma";
import { handleApiError } from "../../../utils/api";
import { tournamentIdParamSchema } from "../../../../shared/schemas";
import { generateRoundRobin } from "../../../../shared/roundRobin";
import { requireAdmin } from "../../../utils/protect";

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event);
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
    teamIds.sort(() => 0.5 - Math.random());
    const pairings = generateRoundRobin(teamIds);

    await prisma.$transaction(async (tx) => {
      await tx.match.deleteMany({ where: { tournamentId: id } });
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
