import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { teamIdParamSchema } from "../../../shared/schemas";
import { requireAdmin } from "../../utils/protect";

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event);
    const { id } = teamIdParamSchema.parse(getRouterParams(event));

    await prisma.team.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    handleApiError(error);
  }
});
