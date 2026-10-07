import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      startAt: string;
      endAt?: string;
      location?: string;
      publicationStatus?: string;
    },
  ) {
    return this.eventService.create(
      body.name,
      new Date(body.startAt),
      body.endAt ? new Date(body.endAt) : undefined,
      body.location,
      body.publicationStatus,
    );
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      startAt?: string;
      endAt?: string | null;
      location?: string | null;
      publicationStatus?: string;
    },
  ) {
    return this.eventService.update(id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.startAt !== undefined && {
        startAt: new Date(body.startAt),
      }),
      ...(body.endAt !== undefined && {
        endAt: body.endAt ? new Date(body.endAt) : null,
      }),
      ...(body.location !== undefined && {
        location: body.location,
      }),
      ...(body.publicationStatus !== undefined && {
        publicationStatus: body.publicationStatus,
      }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }
}
