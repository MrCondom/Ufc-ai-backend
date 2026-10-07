import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FighterService } from './fighter.service';

@Controller('fighters')
export class FighterController {
  constructor(private readonly fighterService: FighterService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      nickname?: string;
      wins?: number;
      losses?: number;
      draws?: number;
      koWins?: number;
      submissionWins?: number;
      decisionWins?: number;
      height?: string;
      reach?: string;
      stance?: string;
      dateOfBirth?: string;
      imageUrl?: string;
    },
  ) {
    return this.fighterService.create({
      name: body.name,
      nickname: body.nickname,
      wins: body.wins,
      losses: body.losses,
      draws: body.draws,
      koWins: body.koWins,
      submissionWins: body.submissionWins,
      decisionWins: body.decisionWins,
      height: body.height,
      reach: body.reach,
      stance: body.stance,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      imageUrl: body.imageUrl,
    });
  }

  @Get()
  findAll() {
    return this.fighterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fighterService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      nickname?: string;
      wins?: number;
      losses?: number;
      draws?: number;
      koWins?: number;
      submissionWins?: number;
      decisionWins?: number;
      height?: string;
      reach?: string;
      stance?: string;
      dateOfBirth?: string;
      imageUrl?: string;
    },
  ) {
    return this.fighterService.update(id, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.nickname !== undefined && { nickname: body.nickname }),
      ...(body.wins !== undefined && { wins: body.wins }),
      ...(body.losses !== undefined && { losses: body.losses }),
      ...(body.draws !== undefined && { draws: body.draws }),
      ...(body.koWins !== undefined && { koWins: body.koWins }),
      ...(body.submissionWins !== undefined && {
        submissionWins: body.submissionWins,
      }),
      ...(body.decisionWins !== undefined && {
        decisionWins: body.decisionWins,
      }),
      ...(body.height !== undefined && { height: body.height }),
      ...(body.reach !== undefined && { reach: body.reach }),
      ...(body.stance !== undefined && { stance: body.stance }),
      ...(body.dateOfBirth !== undefined && {
        dateOfBirth: new Date(body.dateOfBirth),
      }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fighterService.remove(id);
  }
}
