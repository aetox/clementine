import { prisma } from "../../../utils/prisma";
import { handleApiError } from "../../../utils/api";
import {
  matchIdParamSchema,
  updateMatchScoreSchema,
} from "../../../../shared/schemas";
import { requireAdmin } from "../../../utils/protect";

export default defineEventHandler(async (event) => {
  try {
    requireAdmin(event);
    const { id } = matchIdParamSchema.parse(getRouterParams(event));
    const body = await readBody(event);
    const input = updateMatchScoreSchema.parse(body);

    const matchUpdated = await prisma.match.update({
      where: { id },
      data: {
        homeScore: input.homeScore,
        awayScore: input.awayScore,
        played: true,
      },
    });

    return matchUpdated;
  } catch (error) {
    handleApiError(error);
  }
});
