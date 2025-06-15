-- DropIndex
DROP INDEX "Appointment_doctorId_key";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "patientDescription" DROP NOT NULL;
