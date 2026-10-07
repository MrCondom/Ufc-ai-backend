import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InfluenceService } from './influence.service';

@Controller('influences')
export class InfluenceController {
  constructor(private readonly influenceService: InfluenceService) {}

  @Post()
  create(
    @Body()
    body: {
      fighterId: string;
      fightId?: string;
      type?: string;
      content: string;
      source?: string;
      sourceUrl?: string;
      active?: boolean;
    },
  ) {
    return this.influenceService.create({
      fighterId: body.fighterId,
      fightId: body.fightId,
      type: body.type,
      content: body.content,
      source: body.source,
      sourceUrl: body.sourceUrl,
      active: body.active,
    });
  }

  @Get()
  findAll() {
    return this.influenceService.findAll();
  }

  @Get('fight/:fightId')
  findByFight(@Param('fightId') fightId: string) {
    return this.influenceService.findByFight(fightId);
  }

  @Get('fighter/:fighterId')
  findByFighter(@Param('fighterId') fighterId: string) {
    return this.influenceService.findByFighter(fighterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.influenceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      type?: string;
      content?: string;
      source?: string;
      sourceUrl?: string;
      active?: boolean;
    },
  ) {
    return this.influenceService.update(id, {
      ...(body.type !== undefined && { type: body.type }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.source !== undefined && { source: body.source }),
      ...(body.sourceUrl !== undefined && {
        sourceUrl: body.sourceUrl,
      }),
      ...(body.active !== undefined && { active: body.active }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.influenceService.remove(id);
  }
}
