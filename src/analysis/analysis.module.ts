import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { FightModule } from '../fight/fight.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [FightModule, AiModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
