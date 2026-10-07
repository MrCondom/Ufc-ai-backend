import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(
    name: string,
    startAt: Date,
    endAt?: Date,
    location?: string,
    publicationStatus?: string,
  ) {
    return this.prisma.event.create({
      data: {
        name,
        startAt,
        endAt,
        location,
        publicationStatus: publicationStatus ?? 'DRAFT',
        publishedAt: publicationStatus === 'PUBLISHED' ? new Date() : undefined,
      },
    });
  }

  private getEventPhase(startAt: Date, endAt: Date | null) {
    const now = new Date();

    const effectiveEndAt =
      endAt ?? new Date(startAt.getTime() + 6 * 60 * 60 * 1000);

    if (now < startAt) {
      return 'UPCOMING';
    }

    if (now <= effectiveEndAt) {
      return 'LIVE';
    }

    return 'PAST';
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: {
        startAt: 'asc',
      },
      include: {
        fights: true,
      },
    });

    return events.map((event) => ({
      ...event,
      phase: this.getEventPhase(event.startAt, event.endAt),
    }));
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        fights: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      ...event,
      phase: this.getEventPhase(event.startAt, event.endAt),
    };
  }

  async update(
    id: string,
    data: {
      name?: string;
      startAt?: Date;
      endAt?: Date | null;
      location?: string | null;
      publicationStatus?: string;
    },
  ) {
    const existingEvent = await this.findOne(id);

    const updateData: typeof data & {
      publishedAt?: Date | null;
    } = { ...data };

    if (data.publicationStatus === 'PUBLISHED') {
      updateData.publishedAt = existingEvent.publishedAt ?? new Date();
    }

    if (data.publicationStatus === 'DRAFT') {
      updateData.publishedAt = null;
    }

    if (data.publicationStatus === 'CANCELLED') {
      updateData.publishedAt = existingEvent.publishedAt;
    }

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
