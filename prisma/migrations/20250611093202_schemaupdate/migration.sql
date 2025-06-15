/*
  Warnings:

  - A unique constraint covering the columns `[doctorId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_key" ON "Appointment"("doctorId");
