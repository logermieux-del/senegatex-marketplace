import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { transporterUpdateSchema } from '@/lib/validators';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const transporteur = await prisma.transporteur.findUnique({
      where: { id },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            avatar: true,
            phone: true,
            bio: true,
            region: true,
            createdAt: true,
          },
        },
        typeVehicule: true,
        plaqueImmatriculation: true,
        regionsCouvertes: true,
        tarifParZone: true,
        capaciteVolume: true,
        statut: true,
        notianceGlobale: true,
        nombreLivraisons: true,
        tauxDisputes: true,
        createdAt: true,
      },
    });

    if (!transporteur || transporteur.statut !== 'VERIFIED') {
      return NextResponse.json(
        { error: 'Transporter not found' },
        { status: 404 }
      );
    }

    // Calculate reliability score
    const reliabilityScore = 100 - transporteur.tauxDisputes;

    const formatted = {
      id: transporteur.id,
      name: transporteur.user.name,
      avatar: transporteur.user.avatar,
      phone: transporteur.user.phone,
      bio: transporteur.user.bio,
      region: transporteur.user.region,
      joinedAt: transporteur.user.createdAt,
      typeVehicule: transporteur.typeVehicule,
      plaqueImmatriculation: transporteur.plaqueImmatriculation,
      regionsCouvertes: JSON.parse(transporteur.regionsCouvertes || '[]'),
      tarifParZone: JSON.parse(transporteur.tarifParZone || '{}'),
      capaciteVolume: transporteur.capaciteVolume,
      rating: {
        average: transporteur.notianceGlobale,
        totalDeliveries: transporteur.nombreLivraisons,
        disputeRate: transporteur.tauxDisputes,
        reliability: `${Math.round(reliabilityScore)}%`,
      },
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Get transporter profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transporter profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = transporterUpdateSchema.parse(body);

    // Verify ownership
    const transporteur = await prisma.transporteur.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });

    if (!transporteur) {
      return NextResponse.json(
        { error: 'Transporter not found' },
        { status: 404 }
      );
    }

    if (transporteur.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update transporter
    const updateData: any = {};

    if (data.tarifParZone) {
      updateData.tarifParZone = JSON.stringify(data.tarifParZone);
    }

    if (data.regionsCouvertes) {
      updateData.regionsCouvertes = JSON.stringify(data.regionsCouvertes);
    }

    const updated = await prisma.transporteur.update({
      where: { id },
      data: updateData,
    });

    // Update user geographic info if provided
    if (data.region || data.arrondissement || data.pointRetrait || data.bio) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          region: data.region,
          arrondissement: data.arrondissement,
          pointRetrait: data.pointRetrait,
          bio: data.bio,
        },
      });
    }

    return NextResponse.json({
      data: {
        id: updated.id,
        message: 'Profile updated successfully',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update transporter error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
