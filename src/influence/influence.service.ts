import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InfluenceService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    fighterId: string;
    fightId?: string;
    type?: string;
    content: string;
    source?: string;
    sourceUrl?: string;
    active?: boolean;
  }) {
    const fighter = await this.prisma.fighter.findUnique({
      where: { id: data.fighterId },
    });

    if (!fighter) {
      throw new NotFoundException('Fighter not found');
    }

    if (data.fightId) {
      const fight = await this.prisma.fight.findUnique({
        where: { id: data.fightId },
      });

      if (!fight) {
        throw new NotFoundException('Fight not found');
      }

      if (
        fight.fighterAId !== data.fighterId &&
        fight.fighterBId !== data.fighterId
      ) {
        throw new BadRequestException(
          'The fighter does not participate in this fight',
        );
      }
    }

    return this.prisma.influence.create({
      data: {
        fighterId: data.fighterId,
        fightId: data.fightId,
        type: data.type ?? 'OTHER',
        content: data.content,
        source: data.source,
        sourceUrl: data.sourceUrl,
        active: data.active ?? true,
      },
      include: {
        fighter: true,
        fight: true,
      },
    });
  }

  async findAll() {
    return this.prisma.influence.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        fighter: true,
        fight: true,
      },
    });
  }

  async findOne(id: string) {
    const influence = await this.prisma.influence.findUnique({
      where: { id },
      include: {
        fighter: true,
        fight: true,
      },
    });

    if (!influence) {
      throw new NotFoundException('Influence not found');
    }

    return influence;
  }

  async findByFight(fightId: string) {
    const fight = await this.prisma.fight.findUnique({
      where: { id: fightId },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return this.prisma.influence.findMany({
      where: {
        fightId,
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        fighter: true,
      },
    });
  }

  async findByFighter(fighterId: string) {
    const fighter = await this.prisma.fighter.findUnique({
      where: { id: fighterId },
    });

    if (!fighter) {
      throw new NotFoundException('Fighter not found');
    }

    return this.prisma.influence.findMany({
      where: {
        fighterId,
        active: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        fight: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      type?: string;
      content?: string;
      source?: string;
      sourceUrl?: string;
      active?: boolean;
    },
  ) {
    await this.findOne(id);

    return this.prisma.influence.update({
      where: { id },
      data,
      include: {
        fighter: true,
        fight: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.influence.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }
}
