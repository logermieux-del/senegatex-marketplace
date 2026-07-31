import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
  const password = await bcrypt.hash('password123', 12);

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
      description: 'Barely used iPhone 13 Pro in excellent condition',
      category: 'electronics',
      price: 80000000, // 800,000 XOF
      city: 'Dakar',
      region: 'Dakar',
      photos: ['https://res.cloudinary.com/example/image1.jpg'],
      thumbnail: 'https://res.cloudinary.com/example/image1.jpg',
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      userId: seller.id,
      title: 'Wooden Dining Table',
      description: 'Beautiful handcrafted dining table, seats 6 people',
      category: 'furniture',
      price: 25000000, // 250,000 XOF
      city: 'Thiès',
      photos: ['https://res.cloudinary.com/example/image2.jpg'],
      thumbnail: 'https://res.cloudinary.com/example/image2.jpg',
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

  console.log('✅ Seeding complete!');
  console.log('Test users:');
  console.log(`- Seller: ${seller.email} / password123`);
  console.log(`- Buyer: ${buyer.email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
