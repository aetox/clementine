import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { createTournamentSchema } from "../../../shared/schemas";
import { requireAdmin } from "../../utils/protect";

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event);
    const body = await readBody(event);
    const input = createTournamentSchema.parse(body);

    return await prisma.tournament.create({
      data: {
        name: input.name,
        date: input.date,
        description: input.description ?? null,
        teams: input.teams?.length
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
  } catch (error) {
    handleApiError(error);
  }
});
