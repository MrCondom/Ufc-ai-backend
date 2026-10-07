import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FightSourceService } from './fight-source.service';

@Controller('fight-sources')
export class FightSourceController {
  constructor(private readonly fightSourceService: FightSourceService) {}

  @Post()
  create(
    @Body()
    body: {
      fightId: string;
      type: string;
      title?: string;
      url?: string;
      content?: string;
    },
  ) {
    return this.fightSourceService.create({
      fightId: body.fightId,
      type: body.type,
      title: body.title,
      url: body.url,
      content: body.content,
    });
  }

  @Get('fight/:fightId')
  findForFight(@Param('fightId') fightId: string) {
    return this.fightSourceService.findForFight(fightId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fightSourceService.remove(id);
  }
}
