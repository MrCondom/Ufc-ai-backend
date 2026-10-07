import { Module } from '@nestjs/common';
import { FighterController } from './fighter.controller';
import { FighterService } from './fighter.service';

@Module({
  controllers: [FighterController],
  providers: [FighterService],
})
export class FighterModule {}
