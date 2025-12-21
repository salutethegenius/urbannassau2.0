-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FareSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "rideStandardBase" REAL NOT NULL DEFAULT 15,
    "ridePremiumBase" REAL NOT NULL DEFAULT 20,
    "freeDistance" REAL NOT NULL DEFAULT 5,
    "perMileRate" REAL NOT NULL DEFAULT 4,
    "passengerFee" REAL NOT NULL DEFAULT 5,
    "courierBase" REAL NOT NULL DEFAULT 12,
    "errandBase" REAL NOT NULL DEFAULT 25,
    "shoppingBase" REAL NOT NULL DEFAULT 50,
    "transportBase" REAL NOT NULL DEFAULT 20,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FareHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serviceType" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "distance" REAL NOT NULL,
    "passengers" INTEGER NOT NULL,
    "baseFare" REAL NOT NULL,
    "distanceFare" REAL NOT NULL,
    "passengerFare" REAL NOT NULL,
    "totalFare" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
