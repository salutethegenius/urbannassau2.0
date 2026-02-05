-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FareSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "rideStandardBase" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "ridePremiumBase" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "freeDistance" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "perMileRate" DOUBLE PRECISION NOT NULL DEFAULT 4,
    "passengerFee" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "courierBase" DOUBLE PRECISION NOT NULL DEFAULT 12,
    "errandBase" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "shoppingBase" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "transportBase" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FareSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FareHistory" (
    "id" SERIAL NOT NULL,
    "serviceType" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "passengers" INTEGER NOT NULL,
    "baseFare" DOUBLE PRECISION NOT NULL,
    "distanceFare" DOUBLE PRECISION NOT NULL,
    "passengerFare" DOUBLE PRECISION NOT NULL,
    "totalFare" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FareHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "bookingHour" INTEGER NOT NULL,
    "serviceType" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "dropoffAddress" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "passengers" INTEGER NOT NULL,
    "totalFare" DOUBLE PRECISION NOT NULL,
    "customerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
