-- CreateTable
CREATE TABLE "Miet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "strasse" TEXT,
    "hausnummer" TEXT,
    "ort" TEXT,
    "plz" TEXT,
    "groesse" DOUBLE PRECISION,
    "baujahr" INTEGER,
    "nettokalt" DOUBLE PRECISION,

    CONSTRAINT "Miet_pkey" PRIMARY KEY ("id")
);
