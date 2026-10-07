import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from './event/event.module';
import { FighterModule } from './fighter/fighter.module';
import { FightModule } from './fight/fight.module';
import { InfluenceModule } from './influence/influence.module';
import { AnalysisModule } from './analysis/analysis.module';
import { AnalysisSourceModule } from './analysis-source/analysis-source.module';
import { FightStatModule } from './fight-stat/fight-stat.module';
import { FightSourceModule } from './fight-source/fight-source.module';
import { EventSourceModule } from './event-source/event-source.module';

@Module({
  imports: [
    PrismaModule,
    EventModule,
    FighterModule,
    FightModule,
    InfluenceModule,
    AnalysisModule,
    AnalysisSourceModule,
    FightStatModule,
    FightSourceModule,
    EventSourceModule,
  ],
})
export class AppModule {}
