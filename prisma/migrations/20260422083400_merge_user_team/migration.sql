-- DropForeignKey
ALTER TABLE "_UserTournaments" DROP CONSTRAINT "_UserTournaments_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTournaments" DROP CONSTRAINT "_UserTournaments_B_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "userId" INTEGER;

-- DropTable
DROP TABLE "_UserTournaments";

-- CreateIndex
CREATE UNIQUE INDEX "Team_tournamentId_userId_key" ON "Team"("tournamentId", "userId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
