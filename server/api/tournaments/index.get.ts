import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";

export default defineEventHandler(async () => {
  try {
    return await prisma.tournament.findMany({
      orderBy: { date: "asc" },
      include: {
        teams: { orderBy: { name: "asc" } },
        matches: { orderBy: [{ round: "asc" }, { id: "asc" }] },
      },
    });
  } catch (error) {
    handleApiError(error);
  }
});
