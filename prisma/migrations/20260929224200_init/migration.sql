-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "koWins" INTEGER NOT NULL DEFAULT 0,
    "submissionWins" INTEGER NOT NULL DEFAULT 0,
    "decisionWins" INTEGER NOT NULL DEFAULT 0,
    "height" TEXT,
    "reach" TEXT,
    "stance" TEXT,
    "dateOfBirth" DATETIME,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "fighterAId" TEXT NOT NULL,
    "fighterBId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "winnerId" TEXT,
    "method" TEXT,
    "round" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Fight_fighterAId_fkey" FOREIGN KEY ("fighterAId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fight_fighterBId_fkey" FOREIGN KEY ("fighterBId") REFERENCES "Fighter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fightId" TEXT NOT NULL,
    "fighterAProbability" REAL NOT NULL,
    "fighterBProbability" REAL NOT NULL,
    "predictedWinnerId" TEXT,
    "predictedMethod" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "sourceVersion" TEXT,
    CONSTRAINT "AIAnalysis_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "content" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalysisSource_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AIAnalysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Influence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fighterId" TEXT NOT NULL,
    "fightId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "content" TEXT NOT NULL,
    "source" TEXT,
    "sourceUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Influence_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Influence_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Fighter_name_key" ON "Fighter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Fight_eventId_fighterAId_fighterBId_key" ON "Fight"("eventId", "fighterAId", "fighterBId");

-- CreateIndex
CREATE INDEX "AIAnalysis_fightId_expiresAt_idx" ON "AIAnalysis"("fightId", "expiresAt");
