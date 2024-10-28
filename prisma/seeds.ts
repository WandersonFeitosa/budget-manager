import { MatchStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedMatchStatus extends Partial<MatchStatus> {
  name: string;
}

async function main() {
  const matchStatuses: SeedMatchStatus[] = [
    {
      name: 'forming',
    },
    {
      name: 'waiting_instance',
    },
    {
      name: 'reforming',
    },
    {
      name: 'accepting',
    },
    {
      name: 'starting',
    },
    {
      name: 'running',
    },
    {
      name: 'completed',
    },
    {
      name: 'processing',
    },
  ];

  for (const matchStatus of matchStatuses) {
    await prisma.matchStatus.upsert({
      where: { name: matchStatus.name },
      update: {},
      create: matchStatus,
    });
  }
}
main();
