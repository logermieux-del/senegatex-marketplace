import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.report.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();

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
    await prisma.listing.create({
      data: {
        userId: seller.id,
        title: 'iPhone 13 Pro',
        description: 'Barely used iPhone 13 Pro in excellent condition. No scratches, all accessories included.',
        category: 'electronics',
        price: 80000000n,
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
        price: 25000000n,
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
        price: 120000000n,
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
        price: 35000000n,
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
        price: 45000000n,
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
        price: 65000000n,
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
        price: 15000000n,
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
        price: 50000000n,
        city: 'Dakar',
        region: 'Almadies',
        photos: JSON.stringify(['https://res.cloudinary.com/example/image8.jpg']),
        thumbnail: 'https://res.cloudinary.com/example/image8.jpg',
      },
    });

    console.log('✅ Seeding complete!');
    return NextResponse.json({ success: true, message: '8 listings created!' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
