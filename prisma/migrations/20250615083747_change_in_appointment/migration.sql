-- DropIndex
DROP INDEX "Appointment_startTime_status_doctorId_idx";

-- CreateIndex
CREATE INDEX "Appointment_startTime_status_doctorId_patientId_idx" ON "Appointment"("startTime", "status", "doctorId", "patientId");
