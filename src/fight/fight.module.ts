import { Module } from '@nestjs/common';
import { FightController } from './fight.controller';
import { FightService } from './fight.service';

@Module({
  controllers: [FightController],
  providers: [FightService],
  exports: [FightService],
})
export class FightModule {}
