import { Module } from '@nestjs/common';
import { FightSourceController } from './fight-source.controller';
import { FightSourceService } from './fight-source.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FightSourceController],
  providers: [FightSourceService],
})
export class FightSourceModule {}
