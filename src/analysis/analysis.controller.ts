import { Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analyses')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post(':fightId/generate')
  generate(@Param('fightId') fightId: string) {
    return this.analysisService.generate(fightId);
  }

  @Get(':fightId/valid')
  findValid(@Param('fightId') fightId: string) {
    return this.analysisService.findValid(fightId);
  }

  @Get(':fightId/all')
  findAllForFight(@Param('fightId') fightId: string) {
    return this.analysisService.findAllForFight(fightId);
  }

  @Get(':fightId')
  findLatest(@Param('fightId') fightId: string) {
    return this.analysisService.findLatest(fightId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisService.remove(id);
  }
}
