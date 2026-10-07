import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalysisSourceService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    analysisId: string;
    type: string;
    title?: string;
    url?: string;
    content?: string;
  }) {
    const analysis = await this.prisma.aIAnalysis.findUnique({
      where: {
        id: data.analysisId,
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    if (!data.type?.trim()) {
      throw new BadRequestException('Source type is required');
    }

    if (!data.content?.trim() && !data.url?.trim()) {
      throw new BadRequestException('Source must have either content or a URL');
    }

    return this.prisma.analysisSource.create({
      data: {
        analysisId: data.analysisId,
        type: data.type,
        title: data.title,
        url: data.url,
        content: data.content,
      },
    });
  }

  async findForAnalysis(analysisId: string) {
    const analysis = await this.prisma.aIAnalysis.findUnique({
      where: {
        id: analysisId,
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return this.prisma.analysisSource.findMany({
      where: {
        analysisId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async remove(id: string) {
    const source = await this.prisma.analysisSource.findUnique({
      where: {
        id,
      },
    });

    if (!source) {
      throw new NotFoundException('Analysis source not found');
    }

    return this.prisma.analysisSource.delete({
      where: {
        id,
      },
    });
  }
}
