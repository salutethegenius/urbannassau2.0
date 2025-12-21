-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingDate" DATETIME NOT NULL,
    "bookingHour" INTEGER NOT NULL,
    "serviceType" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "passengers" INTEGER NOT NULL,
    "totalFare" REAL NOT NULL,
    "customerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
