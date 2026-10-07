import { Module } from '@nestjs/common';
import { EventSourceController } from './event-source.controller';
import { EventSourceService } from './event-source.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventSourceController],
  providers: [EventSourceService],
})
export class EventSourceModule {}
