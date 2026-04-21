import { prisma } from '../../utils/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw createError({ statusCode: 400, statusMessage: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Make the first user an admin automatically for convenience
  const isFirstUser = (await prisma.user.count()) === 0;

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: isFirstUser ? 'ADMIN' : 'USER',
    },
  });

  const token = signToken({ userId: user.id, role: user.role });
  
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
});