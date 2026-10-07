import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FightService } from './fight.service';

@Controller('fights')
export class FightController {
  constructor(private readonly fightService: FightService) {}

  @Post()
  create(
    @Body()
    body: {
      eventId: string;
      fighterAId: string;
      fighterBId: string;
      cardType?: string;
      cardOrder?: number;
      status?: string;
    },
  ) {
    return this.fightService.create({
      eventId: body.eventId,
      fighterAId: body.fighterAId,
      fighterBId: body.fighterBId,
      cardType: body.cardType,
      cardOrder: body.cardOrder,
      status: body.status,
    });
  }

  @Get()
  findAll() {
    return this.fightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fightService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      cardType?: string;
      cardOrder?: number;
      status?: string;
      winnerId?: string;
      method?: string;
      round?: number;
    },
  ) {
    return this.fightService.update(id, {
      ...(body.cardType !== undefined && {
        cardType: body.cardType,
      }),
      ...(body.cardOrder !== undefined && {
        cardOrder: body.cardOrder,
      }),
      ...(body.status !== undefined && {
        status: body.status,
      }),
      ...(body.winnerId !== undefined && {
        winnerId: body.winnerId,
      }),
      ...(body.method !== undefined && {
        method: body.method,
      }),
      ...(body.round !== undefined && {
        round: body.round,
      }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fightService.remove(id);
  }
}
