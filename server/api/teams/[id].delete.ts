import { prisma } from "../../utils/prisma";
import { handleApiError } from "../../utils/api";
import { teamIdParamSchema } from "../../../shared/schemas";

export default defineEventHandler(async (event) => {
  try {
    const { id } = teamIdParamSchema.parse(getRouterParams(event));

    await prisma.team.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    handleApiError(error);
  }
});
