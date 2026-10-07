/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.
  - Added the required column `startAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "FightSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fightId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FightSource_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventSource_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME,
    "location" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "id", "name", "startAt", "endAt", "location", "publicationStatus", "publishedAt", "updatedAt")
SELECT
    "createdAt",
    "id",
    "name",
    "date",
    NULL,
    NULL,
    CASE
        WHEN "status" = 'upcoming' THEN 'PUBLISHED'
        WHEN "status" = 'cancelled' THEN 'CANCELLED'
        ELSE 'DRAFT'
    END,
    CASE
        WHEN "status" = 'upcoming' THEN "createdAt"
        ELSE NULL
    END,
    "updatedAt"
FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Fight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "fighterAId" TEXT NOT NULL,
    "fighterBId" TEXT NOT NULL,
    "cardType" TEXT NOT NULL DEFAULT 'MAIN_CARD',
    "cardOrder" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "winnerId" TEXT,
    "method" TEXT,
    "round" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Fight_fighterAId_fkey" FOREIGN KEY ("fighterAId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fight_fighterBId_fkey" FOREIGN KEY ("fighterBId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Fight" ("createdAt", "eventId", "fighterAId", "fighterBId", "id", "method", "round", "status", "updatedAt", "winnerId") SELECT "createdAt", "eventId", "fighterAId", "fighterBId", "id", "method", "round", "status", "updatedAt", "winnerId" FROM "Fight";
DROP TABLE "Fight";
ALTER TABLE "new_Fight" RENAME TO "Fight";
CREATE INDEX "Fight_eventId_cardOrder_idx" ON "Fight"("eventId", "cardOrder");
CREATE UNIQUE INDEX "Fight_eventId_fighterAId_fighterBId_key" ON "Fight"("eventId", "fighterAId", "fighterBId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "FightSource_fightId_idx" ON "FightSource"("fightId");

-- CreateIndex
CREATE INDEX "EventSource_eventId_idx" ON "EventSource"("eventId");

-- CreateIndex
CREATE INDEX "AnalysisSource_analysisId_idx" ON "AnalysisSource"("analysisId");
