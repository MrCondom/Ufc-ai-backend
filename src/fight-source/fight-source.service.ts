import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FightSourceService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    fightId: string;
    type: string;
    title?: string;
    url?: string;
    content?: string;
  }) {
    const fight = await this.prisma.fight.findUnique({
      where: {
        id: data.fightId,
      },
    });

    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    return this.prisma.fightSource.create({
      data: {
        fightId: data.fightId,
        type: data.type,
        title: data.title,
        url: data.url,
        content: data.content,
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

    return this.prisma.fightSource.findMany({
      where: {
        fightId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string) {
    const source = await this.prisma.fightSource.findUnique({
      where: {
        id,
      },
    });

    if (!source) {
      throw new NotFoundException('Fight source not found');
    }

    return this.prisma.fightSource.delete({
      where: {
        id,
      },
    });
  }
}
