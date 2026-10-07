import { Module } from '@nestjs/common';
import { FightStatController } from './fight-stat.controller';
import { FightStatService } from './fight-stat.service';

@Module({
  controllers: [FightStatController],
  providers: [FightStatService],
})
export class FightStatModule {}
