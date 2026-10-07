import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FighterService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    nickname?: string;
    wins?: number;
    losses?: number;
    draws?: number;
    koWins?: number;
    submissionWins?: number;
    decisionWins?: number;
    height?: string;
    reach?: string;
    stance?: string;
    dateOfBirth?: Date;
    imageUrl?: string;
  }) {
    return this.prisma.fighter.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.fighter.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const fighter = await this.prisma.fighter.findUnique({
      where: { id },
    });

    if (!fighter) {
      throw new NotFoundException('Fighter not found');
    }

    return fighter;
  }

  async update(
    id: string,
    data: {
      name?: string;
      nickname?: string;
      wins?: number;
      losses?: number;
      draws?: number;
      koWins?: number;
      submissionWins?: number;
      decisionWins?: number;
      height?: string;
      reach?: string;
      stance?: string;
      dateOfBirth?: Date;
      imageUrl?: string;
    },
  ) {
    await this.findOne(id);

    return this.prisma.fighter.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.fighter.delete({
      where: { id },
    });
  }
}
