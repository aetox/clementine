import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
prisma.tournament.findMany().then(console.log).catch(console.error).finally(() => prisma.$disconnect())
