import { Module } from '@nestjs/common';
import { InfluenceController } from './influence.controller';
import { InfluenceService } from './influence.service';

@Module({
  controllers: [InfluenceController],
  providers: [InfluenceService],
})
export class InfluenceModule {}
