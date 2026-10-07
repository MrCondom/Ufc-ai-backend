import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EventSourceService } from './event-source.service';

@Controller('event-sources')
export class EventSourceController {
  constructor(private readonly eventSourceService: EventSourceService) {}

  @Post()
  create(
    @Body()
    body: {
      eventId: string;
      type: string;
      title?: string;
      url?: string;
      content?: string;
    },
  ) {
    return this.eventSourceService.create({
      eventId: body.eventId,
      type: body.type,
      title: body.title,
      url: body.url,
      content: body.content,
    });
  }

  @Get('event/:eventId')
  findForEvent(@Param('eventId') eventId: string) {
    return this.eventSourceService.findForEvent(eventId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventSourceService.remove(id);
  }
}
