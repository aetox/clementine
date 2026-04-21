import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { listTeamsQuerySchema } from "../../../shared/schemas";

export default defineEventHandler(async (event) => {
  try {
    const query = listTeamsQuerySchema.parse(getQuery(event));

    return await prisma.team.findMany({
      where: query.tournamentId
        ? { tournamentId: query.tournamentId }
        : undefined,
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ tournamentId: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    handleApiError(error);
  }
});
