-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "location" TEXT,
    "publicationStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" TEXT NOT NULL,
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
    "dateOfBirth" TIMESTAMP(3),
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fighter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fighterAId" TEXT NOT NULL,
    "fighterBId" TEXT NOT NULL,
    "cardType" TEXT NOT NULL DEFAULT 'MAIN_CARD',
    "cardOrder" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "winnerId" TEXT,
    "method" TEXT,
    "round" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FightStat" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FightStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Influence" (
    "id" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "fightId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "content" TEXT NOT NULL,
    "source" TEXT,
    "sourceUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Influence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FightSource" (
    "id" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FightSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSource" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIAnalysis" (
    "id" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "fighterAProbability" DOUBLE PRECISION NOT NULL,
    "fighterBProbability" DOUBLE PRECISION NOT NULL,
    "predictedWinnerId" TEXT,
    "predictedMethod" TEXT,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sourceVersion" TEXT,

    CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisSource" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fighter_name_key" ON "Fighter"("name");

-- CreateIndex
CREATE INDEX "Fight_eventId_cardOrder_idx" ON "Fight"("eventId", "cardOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Fight_eventId_fighterAId_fighterBId_key" ON "Fight"("eventId", "fighterAId", "fighterBId");

-- CreateIndex
CREATE INDEX "FightStat_fighterId_idx" ON "FightStat"("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "FightStat_fightId_fighterId_key" ON "FightStat"("fightId", "fighterId");

-- CreateIndex
CREATE INDEX "FightSource_fightId_idx" ON "FightSource"("fightId");

-- CreateIndex
CREATE INDEX "EventSource_eventId_idx" ON "EventSource"("eventId");

-- CreateIndex
CREATE INDEX "AIAnalysis_fightId_expiresAt_idx" ON "AIAnalysis"("fightId", "expiresAt");

-- CreateIndex
CREATE INDEX "AnalysisSource_analysisId_idx" ON "AnalysisSource"("analysisId");

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_fighterAId_fkey" FOREIGN KEY ("fighterAId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_fighterBId_fkey" FOREIGN KEY ("fighterBId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FightStat" ADD CONSTRAINT "FightStat_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FightStat" ADD CONSTRAINT "FightStat_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Influence" ADD CONSTRAINT "Influence_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Influence" ADD CONSTRAINT "Influence_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FightSource" ADD CONSTRAINT "FightSource_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSource" ADD CONSTRAINT "EventSource_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIAnalysis" ADD CONSTRAINT "AIAnalysis_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalysisSource" ADD CONSTRAINT "AnalysisSource_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AIAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
