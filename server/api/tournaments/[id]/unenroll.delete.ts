import { prisma } from '../../../utils/prisma';
import { handleApiError } from '../../../utils/api';
import { tournamentIdParamSchema } from '../../../../shared/schemas';
import { getUserFromEvent } from '../../../utils/protect';

export default defineEventHandler(async (event) => {
  try {
    const user = getUserFromEvent(event);
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));

    const team = await prisma.team.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId: id,
          userId: user.userId,
        },
      },
    });

    if (!team) {
      throw createError({ statusCode: 400, statusMessage: 'Vous n\'avez pas d\'équipe dans ce tournoi' });
    }

    await prisma.team.delete({
      where: { id: team.id },
    });

    return { success: true };
  } catch (error) {
    handleApiError(error);
  }
});