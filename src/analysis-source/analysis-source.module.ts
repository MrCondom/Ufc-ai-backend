import { Module } from '@nestjs/common';
import { AnalysisSourceController } from './analysis-source.controller';
import { AnalysisSourceService } from './analysis-source.service';

@Module({
  controllers: [AnalysisSourceController],
  providers: [AnalysisSourceService],
})
export class AnalysisSourceModule {}
