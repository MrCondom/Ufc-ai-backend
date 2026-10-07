import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FightStatService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    fightId: string;
    fighterId: string;
    significantStrikesLanded?: number;
    significantStrikesAttempted?: number;
    totalStrikesLanded?: number;
    totalStrikesAttempted?: number;
    takedownsLanded?: number;
    takedownsAttempted?: number;
    submissionAttempts?: number;
    knockdowns?: number;
    reversals?: number;
    controlTimeSeconds?: number;
  }) {
    const fight = await this.prisma.fight.findUnique({
      where: {
        id: data.fightId,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    const fighter = await this.prisma.fighter.findUnique({
      where: {
        id: data.fighterId,
      },
    });

    if (!fighter) {
      throw new NotFoundException('Fighter not found');
    }

    if (
      data.fighterId !== fight.fighterAId &&
      data.fighterId !== fight.fighterBId
    ) {
      throw new BadRequestException(
        'Fighter does not participate in this fight',
      );
    }

    const existing = await this.prisma.fightStat.findUnique({
      where: {
        fightId_fighterId: {
          fightId: data.fightId,
          fighterId: data.fighterId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Statistics already exist for this fighter in this fight',
      );
    }

    return this.prisma.fightStat.create({
      data: {
        fightId: data.fightId,
        fighterId: data.fighterId,
        significantStrikesLanded: data.significantStrikesLanded ?? 0,
        significantStrikesAttempted: data.significantStrikesAttempted ?? 0,
        totalStrikesLanded: data.totalStrikesLanded ?? 0,
        totalStrikesAttempted: data.totalStrikesAttempted ?? 0,
        takedownsLanded: data.takedownsLanded ?? 0,
        takedownsAttempted: data.takedownsAttempted ?? 0,
        submissionAttempts: data.submissionAttempts ?? 0,
        knockdowns: data.knockdowns ?? 0,
        reversals: data.reversals ?? 0,
        controlTimeSeconds: data.controlTimeSeconds ?? 0,
      },
      include: {
        fighter: true,
        fight: true,
      },
    });
  }

  async findForFight(fightId: string) {
    const fight = await this.prisma.fight.findUnique({
      where: {
        id: fightId,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return this.prisma.fightStat.findMany({
      where: {
        fightId,
      },
      include: {
        fighter: true,
      },
    });
  }

  async findForFighter(fighterId: string) {
    const fighter = await this.prisma.fighter.findUnique({
      where: {
        id: fighterId,
      },
    });

    if (!fighter) {
      throw new NotFoundException('Fighter not found');
    }

    return this.prisma.fightStat.findMany({
      where: {
        fighterId,
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
      },
    });
  }

  async remove(id: string) {
    const stat = await this.prisma.fightStat.findUnique({
      where: {
        id,
      },
    });

    if (!stat) {
      throw new NotFoundException('Fight statistics not found');
    }

    return this.prisma.fightStat.delete({
      where: {
        id,
      },
    });
  }
}
