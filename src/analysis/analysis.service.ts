import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FightService } from '../fight/fight.service';
import { OpenAIService } from '../ai/openai.service';

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private fightService: FightService,
    private openAIService: OpenAIService,
  ) {}

  private buildAnalysisInput(fight: any) {
    return {
      event: {
        name: fight.event.name,
        startAt: fight.event.startAt,
        endAt: fight.event.endAt,
        location: fight.event.location,
        publicationStatus: fight.event.publicationStatus,
        sources: fight.event.sources,
      },

      fight: {
        id: fight.id,
        cardType: fight.cardType,
        cardOrder: fight.cardOrder,
        status: fight.status,
        sources: fight.sources,
      },

      fighterA: {
        id: fight.fighterA.id,
        name: fight.fighterA.name,
        nickname: fight.fighterA.nickname,
        wins: fight.fighterA.wins,
        losses: fight.fighterA.losses,
        draws: fight.fighterA.draws,
        koWins: fight.fighterA.koWins,
        submissionWins: fight.fighterA.submissionWins,
        decisionWins: fight.fighterA.decisionWins,
        height: fight.fighterA.height,
        reach: fight.fighterA.reach,
        stance: fight.fighterA.stance,
        recentStats: fight.fighterA.fightStats,
        influences: fight.fighterA.influences,
      },

      fighterB: {
        id: fight.fighterB.id,
        name: fight.fighterB.name,
        nickname: fight.fighterB.nickname,
        wins: fight.fighterB.wins,
        losses: fight.fighterB.losses,
        draws: fight.fighterB.draws,
        koWins: fight.fighterB.koWins,
        submissionWins: fight.fighterB.submissionWins,
        decisionWins: fight.fighterB.decisionWins,
        height: fight.fighterB.height,
        reach: fight.fighterB.reach,
        stance: fight.fighterB.stance,
        recentStats: fight.fighterB.fightStats,
        influences: fight.fighterB.influences,
      },

      currentFightStats: fight.stats,

      fightInfluences: fight.influences,
    };
  }

  async generate(fightId: string) {
    const fight = await this.prisma.fight.findUnique({
      where: {
        id: fightId,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    if (fight.status !== 'UPCOMING') {
      throw new BadRequestException(
        'Analysis can only be generated for an upcoming fight',
      );
    }

    const existingAnalysis = await this.prisma.aIAnalysis.findFirst({
      where: {
        fightId: fight.id,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        fight: {
          include: {
            event: true,
            fighterA: true,
            fighterB: true,
          },
        },
        sources: true,
      },
    });

    if (existingAnalysis) {
      return existingAnalysis;
    }

    const fullFight = await this.fightService.getAnalysisContext(fightId);

    const analysisInput = this.buildAnalysisInput(fullFight);

    const aiResult = await this.openAIService.analyze(analysisInput);

    const probabilityTotal =
      aiResult.fighterAProbability + aiResult.fighterBProbability;

    if (Math.abs(probabilityTotal - 100) > 0.01) {
      throw new BadRequestException(
        'AI returned probabilities that do not add up to 100',
      );
    }

    if (
      aiResult.predictedMethod !== 'DRAW' &&
      aiResult.predictedWinnerId !== fight.fighterAId &&
      aiResult.predictedWinnerId !== fight.fighterBId
    ) {
      throw new BadRequestException('AI returned an invalid predicted winner');
    }

    if (
      aiResult.predictedMethod === 'DRAW' &&
      aiResult.predictedWinnerId !== null
    ) {
      throw new BadRequestException('AI returned an invalid winner for a draw');
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 60 * 1000);

    const sourceMap = new Map<
      string,
      {
        type: string;
        title: string | null;
        url: string | null;
        content: string | null;
      }
    >();

    /*
     * Snapshot fight-specific influences.
     */
    for (const influence of fullFight.influences) {
      const key = [
        'INFLUENCE',
        influence.type,
        influence.content,
        influence.sourceUrl ?? '',
      ].join('|');

      sourceMap.set(key, {
        type: `INFLUENCE_${influence.type}`,
        title: influence.source ?? null,
        url: influence.sourceUrl ?? null,
        content: influence.content,
      });
    }

    for (const fighter of [fullFight.fighterA, fullFight.fighterB]) {
      for (const influence of fighter.influences) {
        const key = [
          'FIGHTER_INFLUENCE',
          fighter.id,
          influence.type,
          influence.content,
          influence.sourceUrl ?? '',
        ].join('|');

        sourceMap.set(key, {
          type: `FIGHTER_INFLUENCE_${influence.type}`,
          title: influence.source ?? null,
          url: influence.sourceUrl ?? null,
          content: `${fighter.name}: ${influence.content}`,
        });
      }
    }

    for (const source of fullFight.sources) {
      const key = [
        'FIGHT_SOURCE',
        source.type,
        source.title ?? '',
        source.url ?? '',
        source.content ?? '',
      ].join('|');

      sourceMap.set(key, {
        type: `FIGHT_SOURCE_${source.type}`,
        title: source.title ?? null,
        url: source.url ?? null,
        content: source.content ?? null,
      });
    }

    for (const source of fullFight.event.sources) {
      const key = [
        'EVENT_SOURCE',
        source.type,
        source.title ?? '',
        source.url ?? '',
        source.content ?? '',
      ].join('|');

      sourceMap.set(key, {
        type: `EVENT_SOURCE_${source.type}`,
        title: source.title ?? null,
        url: source.url ?? null,
        content: source.content ?? null,
      });
    }

    const analysis = await this.prisma.aIAnalysis.create({
      data: {
        fightId: fight.id,

        fighterAProbability: aiResult.fighterAProbability,

        fighterBProbability: aiResult.fighterBProbability,

        predictedWinnerId: aiResult.predictedWinnerId,

        predictedMethod: aiResult.predictedMethod,

        reason: aiResult.reason,

        expiresAt,

        sourceVersion: 'openai-v1',

        sources: {
          create: Array.from(sourceMap.values()),
        },
      },

      include: {
        fight: {
          include: {
            event: true,
            fighterA: true,
            fighterB: true,
          },
        },

        sources: true,
      },
    });

    return analysis;
  }

  async findLatest(fightId: string) {
    const fight = await this.prisma.fight.findUnique({
      where: {
        id: fightId,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    const analysis = await this.prisma.aIAnalysis.findFirst({
      where: {
        fightId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sources: true,
      },
    });

    if (!analysis) {
      throw new NotFoundException('No analysis found for this fight');
    }

    return analysis;
  }

  async findValid(fightId: string) {
    const analysis = await this.prisma.aIAnalysis.findFirst({
      where: {
        fightId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sources: true,
      },
    });

    return analysis;
  }

  async findAllForFight(fightId: string) {
    const fight = await this.prisma.fight.findUnique({
      where: {
        id: fightId,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return this.prisma.aIAnalysis.findMany({
      where: {
        fightId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sources: true,
      },
    });
  }

  async remove(id: string) {
    const analysis = await this.prisma.aIAnalysis.findUnique({
      where: {
        id,
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return this.prisma.aIAnalysis.delete({
      where: {
        id,
      },
    });
  }
}
