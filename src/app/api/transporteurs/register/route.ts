import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { transporterRegisterSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const data = transporterRegisterSchema.parse(body);

    // Check if user already has a transporter profile
    const existingTransporter = await prisma.transporteur.findFirst({
      where: { user: { email: session.user.email } },
    });

    if (existingTransporter) {
      return NextResponse.json(
        { error: 'User already has a transporter profile' },
        { status: 400 }
      );
    }

    // Check if plaque is already registered
    const existingPlaque = await prisma.transporteur.findUnique({
      where: { plaqueImmatriculation: data.plaqueImmatriculation },
    });

    if (existingPlaque) {
      return NextResponse.json(
        { error: 'License plate already registered' },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create transporter profile
    const transporteur = await prisma.transporteur.create({
      data: {
        userId: user.id,
        typeVehicule: data.typeVehicule,
        plaqueImmatriculation: data.plaqueImmatriculation,
        regionsCouvertes: JSON.stringify(data.regionsCouvertes),
        tarifParZone: JSON.stringify(data.tarifParZone),
        capaciteVolume: data.capaciteVolume,
        statut: 'PENDING',
      },
    });

    // Update user role to TRANSPORTER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'TRANSPORTER' },
    });

    return NextResponse.json(
      {
        data: {
          id: transporteur.id,
          status: transporteur.statut,
          message: 'Transporter profile created. Please verify your phone and upload documents.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Register transporteur error:', error);
    return NextResponse.json(
      { error: 'Failed to create transporter profile' },
      { status: 500 }
    );
  }
}
