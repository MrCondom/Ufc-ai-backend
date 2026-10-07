import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AnalysisSourceService } from './analysis-source.service';

@Controller('analysis-sources')
export class AnalysisSourceController {
  constructor(private readonly analysisSourceService: AnalysisSourceService) {}

  @Post()
  create(
    @Body()
    body: {
      analysisId: string;
      type: string;
      title?: string;
      url?: string;
      content?: string;
    },
  ) {
    return this.analysisSourceService.create(body);
  }

  @Get('analysis/:analysisId')
  findForAnalysis(@Param('analysisId') analysisId: string) {
    return this.analysisSourceService.findForAnalysis(analysisId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysisSourceService.remove(id);
  }
}
