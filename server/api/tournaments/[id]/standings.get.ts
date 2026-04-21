import { prisma } from "../../../utils/prisma";
import { handleApiError } from "../../../utils/api";
import { tournamentIdParamSchema } from "../../../../shared/schemas";
import { computeStandings } from "../../../../shared/standings";

export default defineEventHandler(async (event) => {
  try {
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: { orderBy: { name: "asc" } },
        matches: { orderBy: [{ round: "asc" }, { id: "asc" }] },
      },
    });

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tournament not found",
      });
    }

    return {
      tournamentId: id,
      standings: computeStandings(tournament.teams, tournament.matches),
    };
  } catch (error) {
    handleApiError(error);
  }
});
