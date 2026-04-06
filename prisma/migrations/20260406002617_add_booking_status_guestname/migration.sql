-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "guestName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'confirmed';

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
