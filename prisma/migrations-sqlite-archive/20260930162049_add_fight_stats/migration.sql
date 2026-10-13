-- CreateTable
CREATE TABLE "FightStat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fightId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "significantStrikesLanded" INTEGER NOT NULL DEFAULT 0,
    "significantStrikesAttempted" INTEGER NOT NULL DEFAULT 0,
    "totalStrikesLanded" INTEGER NOT NULL DEFAULT 0,
    "totalStrikesAttempted" INTEGER NOT NULL DEFAULT 0,
    "takedownsLanded" INTEGER NOT NULL DEFAULT 0,
    "takedownsAttempted" INTEGER NOT NULL DEFAULT 0,
    "submissionAttempts" INTEGER NOT NULL DEFAULT 0,
    "knockdowns" INTEGER NOT NULL DEFAULT 0,
    "reversals" INTEGER NOT NULL DEFAULT 0,
    "controlTimeSeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FightStat_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FightStat_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "FightStat_fighterId_idx" ON "FightStat"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "FightStat_fightId_fighterId_key" ON "FightStat"("fightId", "fighterId");
