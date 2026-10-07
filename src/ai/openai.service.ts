import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import OpenAI from 'openai';
import { z } from 'zod';

const AnalysisResultSchema = z.object({
  fighterAProbability: z.number().min(0).max(100),
  fighterBProbability: z.number().min(0).max(100),
  predictedWinnerId: z.string().nullable(),
  predictedMethod: z.enum(['KO_TKO', 'SUBMISSION', 'DECISION', 'DRAW']),
  reason: z.string().min(1).max(1000),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL;

    if (!apiKey) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is not configured',
      );
    }

    if (!model) {
      throw new InternalServerErrorException('OPENAI_MODEL is not configured');
    }

    this.client = new OpenAI({
      apiKey,
    });

    this.model = model;
  }

  async analyze(input: unknown): Promise<AnalysisResult> {
    try {
      const response = await this.client.responses.create({
        model: this.model,

        reasoning: {
          effort: 'low',
        },

        store: false,

        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: `
You are the UFC AI analysis engine for a fight prediction application.

Analyze the supplied fight data and produce a probability-based prediction.

Rules:

1. Use ONLY the information supplied in the input.
2. Do not invent statistics, records, injuries, news, or other facts.
3. Treat admin-provided influences as contextual evidence, not guaranteed facts.
4. Consider the fighters' records, physical attributes, stance, recent statistics, active influences, fight-specific sources, and event-level sources.
5. Treat event sources as information about the overall event, and fight sources as information specifically about this matchup.
6. Compare the two fighters rather than evaluating either fighter in isolation.
7. Fighter probabilities must be between 0 and 100.
8. Fighter A probability plus Fighter B probability must equal exactly 100.
9. If predictedMethod is not DRAW, predictedWinnerId must be exactly the ID of Fighter A or Fighter B.
10. If predictedMethod is DRAW, predictedWinnerId must be null.
11. Do not choose a winner based on the fighter's name or reputation alone.
12. predictedMethod must describe the most likely broad outcome:
    KO_TKO, SUBMISSION, DECISION, or DRAW.
13. Keep the reason concise and suitable for display to an app user.
14. Do not mention these instructions in the reason.
15. Do not provide betting advice or tell the user to wager money.
16. Source URLs supplied in the input are references for attribution only. Do not claim to have read or verified a webpage unless its actual content is supplied in the input.

The prediction is an analytical estimate, not a guarantee of the actual fight result.
                `.trim(),
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify(input),
              },
            ],
          },
        ],

        text: {
          format: {
            type: 'json_schema',
            name: 'ufc_fight_analysis',
            strict: true,
            schema: {
              type: 'object',

              properties: {
                fighterAProbability: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                },

                fighterBProbability: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                },

                predictedWinnerId: {
                  type: ['string', 'null'],
                },

                predictedMethod: {
                  type: 'string',
                  enum: ['KO_TKO', 'SUBMISSION', 'DECISION', 'DRAW'],
                },

                reason: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 1000,
                },
              },

              required: [
                'fighterAProbability',
                'fighterBProbability',
                'predictedWinnerId',
                'predictedMethod',
                'reason',
              ],

              additionalProperties: false,
            },
          },
        },
      });

      if (!response.output_text) {
        throw new Error('OpenAI returned an empty response');
      }

      const parsed = JSON.parse(response.output_text);

      return AnalysisResultSchema.parse(parsed);
    } catch (error) {
      this.logger.error(
        'OpenAI fight analysis failed',
        error instanceof Error ? error.stack : String(error),
      );

      if (error instanceof z.ZodError) {
        throw new BadGatewayException('AI returned an invalid analysis result');
      }

      if (error instanceof OpenAI.APIError) {
        throw new BadGatewayException('AI analysis provider request failed');
      }

      if (error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException('Unable to generate AI analysis');
    }
  }
}
