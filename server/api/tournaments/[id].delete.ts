import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { tournamentIdParamSchema } from "../../../shared/schemas";
import { requireAdmin } from "../../utils/protect";

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event);
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));

    await prisma.tournament.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    handleApiError(error);
  }
});
