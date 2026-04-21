import { prisma } from '../../utils/prisma';
import { verifyToken, extractToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization');
  const token = extractToken(authHeader);

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const decoded: any = verifyToken(token);
  if (!decoded || !decoded.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return { user };
});