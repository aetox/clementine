import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' });
  }

  const token = signToken({ userId: user.id, role: user.role });
  
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
});