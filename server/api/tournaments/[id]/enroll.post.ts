import { prisma } from '../../../utils/prisma';
import { handleApiError } from '../../../utils/api';
import { tournamentIdParamSchema } from '../../../../shared/schemas';
import { getUserFromEvent } from '../../../utils/protect';
import { z } from 'zod';

const enrollBodySchema = z.object({
  teamName: z.string().trim().min(1).max(80),
});

export default defineEventHandler(async (event) => {
  try {
    const user = getUserFromEvent(event);
    const { id } = tournamentIdParamSchema.parse(getRouterParams(event));
    const body = await readBody(event);
    const { teamName } = enrollBodySchema.parse(body);

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { teams: true },
    });

    if (!tournament) {
      throw createError({ statusCode: 404, statusMessage: 'Tournament not found' });
    }

    // Check if the user already has a team in this tournament
    const existingTeam = tournament.teams.find((t) => t.userId === user.userId);
    if (existingTeam) {
      throw createError({ statusCode: 400, statusMessage: 'Vous avez déjà une équipe dans ce tournoi' });
    }

    // Check if team name is already taken in this tournament
    const nameTaken = tournament.teams.find(
      (t) => t.name.toLowerCase() === teamName.toLowerCase(),
    );
    if (nameTaken) {
      throw createError({ statusCode: 400, statusMessage: 'Ce nom d\'équipe est déjà pris dans ce tournoi' });
    }

    await prisma.team.create({
      data: {
        name: teamName,
        tournamentId: id,
        userId: user.userId,
      },
    });

    return { success: true };
  } catch (error) {
    handleApiError(error);
  }
});