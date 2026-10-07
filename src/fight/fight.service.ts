import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
        {
          eventId: 'asc',
        },
        {
          cardOrder: 'asc',
        },
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
      winnerId?: string;
      method?: string;
      round?: number;
    },
  ) {
    const fight = await this.prisma.fight.findUnique({
      where: { id },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    if (
      data.winnerId &&
      data.winnerId !== fight.fighterAId &&
      data.winnerId !== fight.fighterBId
    ) {
      throw new BadRequestException(
        'Winner must be one of the fighters in this fight',
      );
    }

    return this.prisma.fight.update({
      where: { id },
      data,
      include: {
        event: true,
        fighterA: true,
        fighterB: true,
      },
    });
  }

  async remove(id: string) {
    const fight = await this.prisma.fight.findUnique({
      where: { id },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return this.prisma.fight.delete({
      where: { id },
    });
  }
}
