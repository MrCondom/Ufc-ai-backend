import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FightStatService } from './fight-stat.service';

@Controller('fight-stats')
export class FightStatController {
  constructor(private readonly fightStatService: FightStatService) {}

  @Post()
  create(
    @Body()
    body: {
      fightId: string;
      fighterId: string;
      significantStrikesLanded?: number;
      significantStrikesAttempted?: number;
      totalStrikesLanded?: number;
      totalStrikesAttempted?: number;
      takedownsLanded?: number;
      takedownsAttempted?: number;
      submissionAttempts?: number;
      knockdowns?: number;
      reversals?: number;
      controlTimeSeconds?: number;
    },
  ) {
    return this.fightStatService.create(body);
  }

  @Get('fight/:fightId')
  findForFight(@Param('fightId') fightId: string) {
    return this.fightStatService.findForFight(fightId);
  }

  @Get('fighter/:fighterId')
  findForFighter(@Param('fighterId') fighterId: string) {
    return this.fightStatService.findForFighter(fighterId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fightStatService.remove(id);
  }
}
