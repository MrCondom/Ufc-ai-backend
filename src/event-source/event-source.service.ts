import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventSourceService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    eventId: string;
    type: string;
    title?: string;
    url?: string;
    content?: string;
  }) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: data.eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.eventSource.create({
      data: {
        eventId: data.eventId,
        type: data.type,
        title: data.title,
        url: data.url,
        content: data.content,
      },
    });
  }

  async findForEvent(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.eventSource.findMany({
      where: {
        eventId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async remove(id: string) {
    const source = await this.prisma.eventSource.findUnique({
      where: {
        id,
      },
    });

    if (!source) {
      throw new NotFoundException('Event source not found');
    }

    return this.prisma.eventSource.delete({
      where: {
        id,
      },
    });
  }
}
