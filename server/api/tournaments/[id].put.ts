import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import {
  tournamentIdParamSchema,
  updateTournamentSchema,
} from "../../../shared/schemas";

export default defineEventHandler(async (event) => {
  try {
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));
    const body = await readBody(event);
    const input = updateTournamentSchema.parse(body);

    const existing = await prisma.tournament.findUnique({ where: { id } });
    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tournament not found",
      });
    }

    return await prisma.$transaction(async (tx) => {
      if (input.teams) {
        await tx.team.deleteMany({ where: { tournamentId: id } });
      }

      return tx.tournament.update({
        where: { id },
        data: {
          name: input.name,
          date: input.date,
          description: input.description,
          teams: input.teams
            ? {
                create: input.teams.map((teamName) => ({ name: teamName })),
              }
            : undefined,
        },
        include: {
          teams: { orderBy: { name: "asc" } },
          matches: { orderBy: [{ round: "asc" }, { id: "asc" }] },
        },
      });
    });
  } catch (error) {
    handleApiError(error);
  }
});
