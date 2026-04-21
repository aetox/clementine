import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { tournamentIdParamSchema } from "../../../shared/schemas";

export default defineEventHandler(async (event) => {
  try {
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        teams: { orderBy: { name: "asc" } },
        matches: { orderBy: [{ round: "asc" }, { id: "asc" }] },
        users: { select: { id: true, name: true } },
      },
    });

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tournament not found",
      });
    }

    return tournament;
  } catch (error) {
    handleApiError(error);
  }
});
