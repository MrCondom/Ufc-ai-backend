import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../prisma/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const EVENT_NAME = 'UFC 332: Silva vs Wang';
const EVENT_DATE = new Date('2026-10-03T00:00:00.000Z');

type FighterInput = {
  name: string;
  nickname?: string;
  wins: number;
  losses: number;
  draws: number;
  koWins: number;
  submissionWins: number;
  height?: string;
  reach?: string;
  stance?: string;
};

type FightInput = {
  fighterA: string;
  fighterB: string;
};

const fighters: FighterInput[] = [
  {
    name: 'Natalia Silva',
    wins: 20,
    losses: 5,
    draws: 1,
    koWins: 5,
    submissionWins: 7,
    height: '64"',
    reach: '65"',
  },
  {
    name: 'Wang Cong',
    wins: 10,
    losses: 1,
    draws: 0,
    koWins: 2,
    submissionWins: 2,
  },
  {
    name: 'Deiveson Figueiredo',
    wins: 25,
    losses: 7,
    draws: 1,
    koWins: 9,
    submissionWins: 9,
  },
  {
    name: 'Payton Talbott',
    wins: 11,
    losses: 1,
    draws: 0,
    koWins: 7,
    submissionWins: 1,
  },
  {
    name: 'King Green',
    wins: 36,
    losses: 17,
    draws: 1,
    koWins: 13,
    submissionWins: 10,
    height: '70"',
  },
  {
    name: 'Esteban Ribovics',
    wins: 16,
    losses: 3,
    draws: 0,
    koWins: 8,
    submissionWins: 5,
    height: '70"',
    reach: '69"',
  },
  {
    name: 'Roberto Soldic',
    wins: 21,
    losses: 4,
    draws: 0,
    koWins: 18,
    submissionWins: 1,
    height: '70.5"',
    reach: '73"',
  },
  {
    name: 'Khaos Williams',
    wins: 16,
    losses: 5,
    draws: 0,
    koWins: 9,
    submissionWins: 1,
  },
  {
    name: 'Ateba Gautier',
    wins: 11,
    losses: 1,
    draws: 0,
    koWins: 0,
    submissionWins: 0,
  },
  {
    name: 'Roman Kopylov',
    wins: 15,
    losses: 5,
    draws: 0,
    koWins: 12,
    submissionWins: 0,
  },
  {
    name: 'Imanol Rodriguez',
    wins: 7,
    losses: 0,
    draws: 0,
    koWins: 6,
    submissionWins: 1,
    height: '64"',
    reach: '64.5"',
  },
  {
    name: 'Alden Coria',
    wins: 13,
    losses: 3,
    draws: 0,
    koWins: 5,
    submissionWins: 4,
    height: '68"',
    reach: '67"',
  },
  {
    name: 'Damian Pinas',
    wins: 10,
    losses: 1,
    draws: 0,
    koWins: 9,
    submissionWins: 0,
  },
  {
    name: 'Andrey Pulyaev',
    wins: 10,
    losses: 5,
    draws: 0,
    koWins: 6,
    submissionWins: 2,
  },
  {
    name: 'Marcus McGhee',
    wins: 11,
    losses: 2,
    draws: 0,
    koWins: 8,
    submissionWins: 1,
    height: '68"',
    reach: '69"',
  },
  {
    name: 'Anthony Romero',
    wins: 7,
    losses: 2,
    draws: 0,
    koWins: 0,
    submissionWins: 0,
    height: '65"',
  },
  {
    name: 'Anthony Wint',
    wins: 8,
    losses: 0,
    draws: 0,
    koWins: 5,
    submissionWins: 2,
    height: '71"',
    reach: '78"',
  },
  {
    name: 'Lucas Armand',
    wins: 6,
    losses: 0,
    draws: 0,
    koWins: 0,
    submissionWins: 0,
  },
  {
    name: 'Johnny Walker',
    wins: 22,
    losses: 10,
    draws: 0,
    koWins: 0,
    submissionWins: 0,
  },
  {
    name: 'Mick Parkin',
    wins: 10,
    losses: 1,
    draws: 0,
    koWins: 6,
    submissionWins: 1,
  },
  {
    name: 'Jacobe Smith',
    wins: 12,
    losses: 0,
    draws: 0,
    koWins: 9,
    submissionWins: 0,
    height: '70"',
    reach: '72"',
  },
  {
    name: 'Bruce Whitehead',
    wins: 8,
    losses: 2,
    draws: 0,
    koWins: 2,
    submissionWins: 3,
    height: '71"',
  },
  {
    name: 'Rafael Dos Anjos',
    wins: 32,
    losses: 17,
    draws: 0,
    koWins: 5,
    submissionWins: 11,
  },
  {
    name: 'Alexander Hernandez',
    wins: 18,
    losses: 9,
    draws: 0,
    koWins: 8,
    submissionWins: 2,
  },
  {
    name: 'Marvin Vettori',
    wins: 19,
    losses: 10,
    draws: 1,
    koWins: 2,
    submissionWins: 9,
  },
  {
    name: 'Ismail Naurdiev',
    wins: 25,
    losses: 8,
    draws: 0,
    koWins: 13,
    submissionWins: 6,
    height: '72"',
    reach: '74"',
  },
  {
    name: 'Court McGee',
    wins: 23,
    losses: 14,
    draws: 0,
    koWins: 5,
    submissionWins: 7,
  },
  {
    name: 'Eric Nolan',
    wins: 8,
    losses: 5,
    draws: 0,
    koWins: 4,
    submissionWins: 2,
    height: '72"',
    reach: '73"',
  },
];

const fights: FightInput[] = [
  {
    fighterA: 'Natalia Silva',
    fighterB: 'Wang Cong',
  },
  {
    fighterA: 'Deiveson Figueiredo',
    fighterB: 'Payton Talbott',
  },
  {
    fighterA: 'King Green',
    fighterB: 'Esteban Ribovics',
  },
  {
    fighterA: 'Roberto Soldic',
    fighterB: 'Khaos Williams',
  },
  {
    fighterA: 'Ateba Gautier',
    fighterB: 'Roman Kopylov',
  },
  {
    fighterA: 'Imanol Rodriguez',
    fighterB: 'Alden Coria',
  },
  {
    fighterA: 'Damian Pinas',
    fighterB: 'Andrey Pulyaev',
  },
  {
    fighterA: 'Marcus McGhee',
    fighterB: 'Anthony Romero',
  },
  {
    fighterA: 'Anthony Wint',
    fighterB: 'Lucas Armand',
  },
  {
    fighterA: 'Johnny Walker',
    fighterB: 'Mick Parkin',
  },
  {
    fighterA: 'Jacobe Smith',
    fighterB: 'Bruce Whitehead',
  },
  {
    fighterA: 'Rafael Dos Anjos',
    fighterB: 'Alexander Hernandez',
  },
  {
    fighterA: 'Marvin Vettori',
    fighterB: 'Ismail Naurdiev',
  },
  {
    fighterA: 'Court McGee',
    fighterB: 'Eric Nolan',
  },
];

async function main() {
  console.log(`Importing ${EVENT_NAME}...`);

  const event = await prisma.event.upsert({
    where: {
      id: 'ufc-332-silva-wang',
    },
    update: {
      name: EVENT_NAME,
      startAt: EVENT_DATE,
      publicationStatus: 'PUBLISHED',
    },
    create: {
      id: 'ufc-332-silva-wang',
      name: EVENT_NAME,
      startAt: EVENT_DATE,
      publicationStatus: 'PUBLISHED',
    },
  });

  console.log(`Event: ${event.name} (${event.id})`);

  const fighterMap = new Map<string, string>();

  for (const fighter of fighters) {
    const existing = await prisma.fighter.findUnique({
      where: {
        name: fighter.name,
      },
    });

    const data = {
      name: fighter.name,
      wins: fighter.wins,
      losses: fighter.losses,
      draws: fighter.draws,
      koWins: fighter.koWins,
      submissionWins: fighter.submissionWins,
      ...(fighter.height !== undefined
        ? { height: fighter.height }
        : {}),
      ...(fighter.reach !== undefined
        ? { reach: fighter.reach }
        : {}),
    };

    const saved = existing
      ? await prisma.fighter.update({
          where: {
            id: existing.id,
          },
          data,
        })
      : await prisma.fighter.create({
          data,
        });

    fighterMap.set(saved.name, saved.id);

    console.log(
      `${existing ? 'Updated' : 'Created'} fighter: ${saved.name}`,
    );
  }

  for (const fight of fights) {
    const fighterAId = fighterMap.get(fight.fighterA);
    const fighterBId = fighterMap.get(fight.fighterB);

    if (!fighterAId || !fighterBId) {
      throw new Error(
        `Missing fighter ID for ${fight.fighterA} vs ${fight.fighterB}`,
      );
    }

    const existing = await prisma.fight.findFirst({
      where: {
        eventId: event.id,
        fighterAId,
        fighterBId,
      },
    });

    if (existing) {
      await prisma.fight.update({
        where: {
          id: existing.id,
        },
        data: {
          status: 'upcoming',
          winnerId: null,
          method: null,
          round: null,
        },
      });

      console.log(
        `Updated fight: ${fight.fighterA} vs ${fight.fighterB}`,
      );
    } else {
      await prisma.fight.create({
        data: {
          eventId: event.id,
          fighterAId,
          fighterBId,
          status: 'upcoming',
        },
      });

      console.log(
        `Created fight: ${fight.fighterA} vs ${fight.fighterB}`,
      );
    }
  }

  // Verified pre-fight weigh-in information:
  // Esteban Ribovics weighed 156.5 lb for the lightweight non-title limit
  // and the bout proceeded at catchweight. Store this as fight-level context.
  const green = fighterMap.get('King Green');
  const ribovics = fighterMap.get('Esteban Ribovics');

  if (green && ribovics) {
    const fight = await prisma.fight.findFirst({
      where: {
        eventId: event.id,
        fighterAId: green,
        fighterBId: ribovics,
      },
    });

    if (fight) {
      const existingInfluence = await prisma.influence.findFirst({
        where: {
          fightId: fight.id,
          fighterId: ribovics,
          type: 'WEIGH_IN',
        },
      });

      const influenceData = {
        fighterId: ribovics,
        fightId: fight.id,
        type: 'WEIGH_IN',
        content:
          'Esteban Ribovics weighed 156.5 lb for the lightweight non-title limit. The bout proceeded at catchweight.',
        source: 'MMA Fighting',
        sourceUrl:
          'https://www.mmafighting.com/ufc/2026/10/2/ufc-332-silva-vs-wang-weigh-in-results',
        active: true,
      };

      if (existingInfluence) {
        await prisma.influence.update({
          where: {
            id: existingInfluence.id,
          },
          data: influenceData,
        });
      } else {
        await prisma.influence.create({
          data: influenceData,
        });
      }

      console.log('Added Ribovics weigh-in influence.');
    }
  }

  const fightCount = await prisma.fight.count({
    where: {
      eventId: event.id,
    },
  });

  const fighterCount = await prisma.fighter.count({
    where: {
      fightsAsFighterA: {
        some: {
          eventId: event.id,
        },
      },
    },
  });

  console.log('');
  console.log('Import complete.');
  console.log(`Event ID: ${event.id}`);
  console.log(`Fights imported: ${fightCount}`);
  console.log(`Fighters appearing as Fighter A: ${fighterCount}`);
}

main()
  .catch((error) => {
    console.error('Import failed:');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });