import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MeiliSearch } from 'meilisearch';

const prisma = new PrismaClient();

const meiliClient = new MeiliSearch({
  host: process.env.MEILISEARCH_URL || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY || 'test-key',
});

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.report.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create test users
  const password = await bcrypt.hash('Password123', 12);

  const seller = await prisma.user.create({
    data: {
      email: 'seller@example.com',
      name: 'Amadou Diallo',
      phone: '+221771234567',
      password,
      role: 'SELLER',
    },
  });

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      name: 'Fatima Ba',
      phone: '+221772345678',
      password,
      role: 'USER',
    },
  });

  // Create test listings
  const listing1 = await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'iPhone 13 Pro',
      description: 'Barely used iPhone 13 Pro in excellent condition. No scratches, all accessories included.',
      category: 'electronics',
      price: 80000000, // 800,000 XOF
      city: 'Dakar',
      region: 'Plateau',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image1.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image1.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'Wooden Dining Table',
      description: 'Beautiful handcrafted dining table, seats 6 people. Made from solid wood.',
      category: 'furniture',
      price: 25000000, // 250,000 XOF
      city: 'Thiès',
      region: 'Thiès Centre',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image2.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image2.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'MacBook Pro 2023',
      description: 'Barely used, mint condition. 16GB RAM, 512GB SSD. Perfect for work and development.',
      category: 'electronics',
      price: 120000000, // 1,200,000 XOF
      city: 'Dakar',
      region: 'Mariste',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image3.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image3.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'Honda Motorcycle',
      description: 'Well-maintained motorcycle, good condition. Regularly serviced.',
      category: 'vehicles',
      price: 35000000, // 350,000 XOF
      city: 'Dakar',
      region: 'Fass',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image4.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image4.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'Designer Sofa',
      description: 'Modern designer sofa in excellent condition. Comfortable and stylish.',
      category: 'furniture',
      price: 45000000, // 450,000 XOF
      city: 'Thiès',
      region: 'Thiès Gare',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image5.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image5.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'Samsung Galaxy S23',
      description: 'Latest Samsung phone, barely used. Includes original box and accessories.',
      category: 'electronics',
      price: 65000000, // 650,000 XOF
      city: 'Kaolack',
      region: 'Kaolack Centre',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image6.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image6.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: buyer.id,
      title: 'Vintage Bookshelf',
      description: 'Antique wooden bookshelf, perfect for collectors. Some wear but structurally sound.',
      category: 'furniture',
      price: 15000000, // 150,000 XOF
      city: 'Saint-Louis',
      region: 'Saint-Louis Centre',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image7.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image7.jpg',
    },
  });

  await prisma.listing.create({
    data: {
      userId: buyer.id,
      title: 'Home Tutoring Services',
      description: 'Experienced tutor offering French and English lessons for students. Flexible schedules.',
      category: 'services',
      price: 50000000, // 500,000 XOF per month
      city: 'Dakar',
      region: 'Almadies',
      photos: JSON.stringify(['https://res.cloudinary.com/example/image8.jpg']),
      thumbnail: 'https://res.cloudinary.com/example/image8.jpg',
    },
  });

  // Create a message
  await prisma.message.create({
    data: {
      fromUserId: buyer.id,
      toUserId: seller.id,
      listingId: listing1.id,
      body: 'Is this phone still available? Can you meet in Dakar?',
    },
  });

  // Create a review
  await prisma.review.create({
    data: {
      fromUserId: buyer.id,
      toUserId: seller.id,
      rating: 5,
      comment: 'Great seller, very professional!',
    },
  });

  // Index listings in Meilisearch
  try {
    const allListings = await prisma.listing.findMany({
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    const index = meiliClient.index('listings');
    await index.addDocuments(allListings);
    console.log(`✅ Indexed ${allListings.length} listings in Meilisearch`);
  } catch (error) {
    console.warn('⚠️ Meilisearch indexing skipped (service may not be running)');
  }

  console.log('✅ Seeding complete!');
  console.log('Test users:');
  console.log(`- Seller: ${seller.email} / Password123`);
  console.log(`- Buyer: ${buyer.email} / Password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
