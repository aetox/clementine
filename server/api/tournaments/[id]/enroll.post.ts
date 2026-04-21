import { prisma } from '../../../utils/prisma';
import { handleApiError } from '../../../utils/api';
import { tournamentIdParamSchema } from '../../../../shared/schemas';
import { getUserFromEvent } from '../../../utils/protect';

export default defineEventHandler(async (event) => {
  try {
    const user = getUserFromEvent(event);
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!tournament) {
      throw createError({ statusCode: 404, statusMessage: 'Tournament not found' });
    }

    if (tournament.users.some((u) => u.id === user.userId)) {
      throw createError({ statusCode: 400, statusMessage: 'Already enrolled' });
    }

    await prisma.tournament.update({
      where: { id },
      data: {
        users: { connect: { id: user.userId } },
      },
    });

    return { success: true };
  } catch (error) {
    handleApiError(error);
  }
});