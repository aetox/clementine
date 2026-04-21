import jwt from 'jsonwebtoken';

export function signToken(payload: object) {
  const config = useRuntimeConfig();
  const secret = config.jwtSecret || 'dev_secret_key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    const config = useRuntimeConfig();
    const secret = config.jwtSecret || 'dev_secret_key';
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}