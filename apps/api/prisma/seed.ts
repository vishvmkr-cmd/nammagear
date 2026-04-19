import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const categories = [
    { slug: 'laptops', name: 'Laptops' },
    { slug: 'monitors', name: 'Monitors' },
    { slug: 'desktops', name: 'Desktops' },
    { slug: 'keyboards', name: 'Keyboards' },
    { slug: 'audio', name: 'Audio' },
    { slug: 'tablets', name: 'Tablets' },
    { slug: 'accessories', name: 'Accessories' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`✓ Created category: ${category.name}`);
  }

  console.log('✓ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
