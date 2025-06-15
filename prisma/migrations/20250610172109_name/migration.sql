-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Availabiltiy" DROP CONSTRAINT "Availabiltiy_doctorId_fkey";

-- AlterTable
ALTER TABLE "Availabiltiy" ADD COLUMN     "status" "SlotStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AddForeignKey
ALTER TABLE "Availabiltiy" ADD CONSTRAINT "Availabiltiy_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
