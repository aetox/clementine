import { extractToken, verifyToken } from './auth';

export function getUserFromEvent(event: any) {
  const authHeader = getHeader(event, 'Authorization');
  const token = extractToken(authHeader);
  
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const decoded: any = verifyToken(token);
  if (!decoded || !decoded.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }

  return decoded; // { userId, role, iat, exp }
}

export function requireAdmin(event: any) {
  const user = getUserFromEvent(event);
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
  return user;
}