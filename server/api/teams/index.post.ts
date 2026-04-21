import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { createTeamSchema } from "../../../shared/schemas";
import { requireAdmin } from "../../utils/protect";

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event);
    const body = await readBody(event);
    const input = createTeamSchema.parse(body);

    return await prisma.team.create({
      data: {
        name: input.name,
        tournamentId: input.tournamentId,
      },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    handleApiError(error);
  }
});
