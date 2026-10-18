import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

type FightResult = {
  fighterAId: string;
  fighterBId: string;
  status: string;
  winnerId: string | null;
  method: string | null;
};

type RecordContribution = {
  wins: number;
  losses: number;
  draws: number;
  koWins: number;
  submissionWins: number;
  decisionWins: number;
};

const ZERO_CONTRIBUTION: RecordContribution = {
  wins: 0,
  losses: 0,
  draws: 0,
  koWins: 0,
  submissionWins: 0,
  decisionWins: 0,
};

function normalizeMethod(
  method: string | null | undefined,
): string {
  if (!method) {
    return '';
  }

  return method
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/-/g, '_')
    .replace(/\//g, '_');
}

function getFightContribution(
  fight: FightResult,
  fighterId: string,
): RecordContribution {
  const contribution = { ...ZERO_CONTRIBUTION };

  if (fight.status.toUpperCase() !== 'COMPLETED') {
    return contribution;
  }

  const method = normalizeMethod(fight.method);

  // A draw contributes one draw to each fighter.
  if (method === 'DRAW' && fight.winnerId === null) {
    contribution.draws = 1;
    return contribution;
  }

  // A no-contest does not affect fighter records.
  if (
    method === 'NO_CONTEST' ||
    method === 'NOCONTEST'
  ) {
    return contribution;
  }

  // A completed fight without a valid winner is not counted.
  if (
    !fight.winnerId ||
    ![fight.fighterAId, fight.fighterBId].includes(
      fight.winnerId,
    )
  ) {
    return contribution;
  }

  const isWinner = fight.winnerId === fighterId;

  contribution.wins = isWinner ? 1 : 0;
  contribution.losses = isWinner ? 0 : 1;

  // Method counters apply to the winner only.
  if (isWinner) {
    switch (method) {
      case 'KO_TKO':
        contribution.koWins = 1;
        break;

      case 'SUBMISSION':
        contribution.submissionWins = 1;
        break;

      case 'DECISION':
        contribution.decisionWins = 1;
        break;
    }
  }

  return contribution;
}

function difference(
  next: RecordContribution,
  previous: RecordContribution,
): RecordContribution {
  return {
    wins: next.wins - previous.wins,
    losses: next.losses - previous.losses,
    draws: next.draws - previous.draws,
    koWins: next.koWins - previous.koWins,
    submissionWins:
      next.submissionWins - previous.submissionWins,
    decisionWins:
      next.decisionWins - previous.decisionWins,
  };
}

function hasChanges(
  contribution: RecordContribution,
): boolean {
  return Object.values(contribution).some(
    (value) => value !== 0,
  );
}

@Injectable()
export class FightService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    eventId: string;
    fighterAId: string;
    fighterBId: string;
    cardType?: string;
    cardOrder?: number;
    status?: string;
  }) {
    if (data.fighterAId === data.fighterBId) {
      throw new BadRequestException(
        'Fighter A and Fighter B cannot be the same fighter',
      );
    }

    const [event, fighterA, fighterB] = await Promise.all([
      this.prisma.event.findUnique({
        where: { id: data.eventId },
      }),
      this.prisma.fighter.findUnique({
        where: { id: data.fighterAId },
      }),
      this.prisma.fighter.findUnique({
        where: { id: data.fighterBId },
      }),
    ]);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!fighterA) {
      throw new NotFoundException('Fighter A not found');
    }

    if (!fighterB) {
      throw new NotFoundException('Fighter B not found');
    }

    // Creating a fight does not update fighter records.
    // Records change when an official result is recorded.
    return this.prisma.fight.create({
      data: {
        eventId: data.eventId,
        fighterAId: data.fighterAId,
        fighterBId: data.fighterBId,
        cardType: data.cardType ?? 'MAIN_CARD',
        cardOrder: data.cardOrder ?? 1,
        status: data.status ?? 'UPCOMING',
      },
      include: {
        event: true,
        fighterA: true,
        fighterB: true,
      },
    });
  }

  async findAll() {
    return this.prisma.fight.findMany({
      orderBy: [
        { eventId: 'asc' },
        { cardOrder: 'asc' },
      ],
      include: {
        event: true,
        fighterA: true,
        fighterB: true,
      },
    });
  }

  async findOne(id: string) {
    const fight = await this.prisma.fight.findUnique({
      where: { id },
      include: {
        event: true,
        fighterA: true,
        fighterB: true,
        analyses: true,
        influences: true,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return fight;
  }

  async getAnalysisContext(id: string) {
    const fight = await this.prisma.fight.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            sources: true,
          },
        },

        fighterA: {
          include: {
            fightStats: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            influences: {
              where: {
                active: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },

        fighterB: {
          include: {
            fightStats: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            influences: {
              where: {
                active: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },

        influences: {
          where: {
            active: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },

        sources: {
          orderBy: {
            createdAt: 'desc',
          },
        },

        stats: true,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return fight;
  }

  async update(
    id: string,
    data: {
      cardType?: string;
      cardOrder?: number;
      status?: string;
      winnerId?: string | null;
      method?: string | null;
      round?: number | null;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const fight = await tx.fight.findUnique({
        where: { id },
      });

      if (!fight) {
        throw new NotFoundException('Fight not found');
      }

      const nextWinnerId =
        data.winnerId !== undefined
          ? data.winnerId
          : fight.winnerId;

      const nextMethod =
        data.method !== undefined
          ? data.method
          : fight.method;

      const nextStatus =
        data.status !== undefined
          ? data.status
          : fight.status;

      if (
        nextWinnerId !== null &&
        nextWinnerId !== fight.fighterAId &&
        nextWinnerId !== fight.fighterBId
      ) {
        throw new BadRequestException(
          'Winner must be one of the fighters in this fight',
        );
      }

      const normalizedMethod = normalizeMethod(nextMethod);

      if (
        nextStatus.toUpperCase() === 'COMPLETED' &&
        nextWinnerId === null &&
        !['DRAW', 'NO_CONTEST', 'NOCONTEST'].includes(
          normalizedMethod,
        )
      ) {
        throw new BadRequestException(
          'A completed fight without a winner must have a DRAW or NO_CONTEST method',
        );
      }

      if (
        nextStatus.toUpperCase() === 'COMPLETED' &&
        nextWinnerId !== null &&
        ['DRAW', 'NO_CONTEST', 'NOCONTEST'].includes(
          normalizedMethod,
        )
      ) {
        throw new BadRequestException(
          'A draw or no-contest cannot have a winner',
        );
      }

      const nextFight: FightResult = {
        fighterAId: fight.fighterAId,
        fighterBId: fight.fighterBId,
        status: nextStatus,
        winnerId: nextWinnerId,
        method: nextMethod,
      };

      const previousFight: FightResult = {
        fighterAId: fight.fighterAId,
        fighterBId: fight.fighterBId,
        status: fight.status,
        winnerId: fight.winnerId,
        method: fight.method,
      };

      // Calculate the difference between the previous and new
      // result. Unchanged results produce zero adjustments.
      for (const fighterId of [
        fight.fighterAId,
        fight.fighterBId,
      ]) {
        const previousContribution = getFightContribution(
          previousFight,
          fighterId,
        );

        const nextContribution = getFightContribution(
          nextFight,
          fighterId,
        );

        const adjustment = difference(
          nextContribution,
          previousContribution,
        );

        if (!hasChanges(adjustment)) {
          continue;
        }

        await tx.fighter.update({
          where: { id: fighterId },
          data: {
            wins: { increment: adjustment.wins },
            losses: { increment: adjustment.losses },
            draws: { increment: adjustment.draws },
            koWins: { increment: adjustment.koWins },
            submissionWins: {
              increment: adjustment.submissionWins,
            },
            decisionWins: {
              increment: adjustment.decisionWins,
            },
          },
        });
      }

      return tx.fight.update({
        where: { id },
        data,
        include: {
          event: true,
          fighterA: true,
          fighterB: true,
        },
      });
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const fight = await tx.fight.findUnique({
        where: { id },
      });

      if (!fight) {
        throw new NotFoundException('Fight not found');
      }

      const previousFight: FightResult = {
        fighterAId: fight.fighterAId,
        fighterBId: fight.fighterBId,
        status: fight.status,
        winnerId: fight.winnerId,
        method: fight.method,
      };

      // Reverse the result before deleting the fight.
      for (const fighterId of [
        fight.fighterAId,
        fight.fighterBId,
      ]) {
        const contribution = getFightContribution(
          previousFight,
          fighterId,
        );

        if (!hasChanges(contribution)) {
          continue;
        }

        await tx.fighter.update({
          where: { id: fighterId },
          data: {
            wins: { increment: -contribution.wins },
            losses: { increment: -contribution.losses },
            draws: { increment: -contribution.draws },
            koWins: { increment: -contribution.koWins },
            submissionWins: {
              increment: -contribution.submissionWins,
            },
            decisionWins: {
              increment: -contribution.decisionWins,
            },
          },
        });
      }

      return tx.fight.delete({
        where: { id },
      });
    });
  }
}