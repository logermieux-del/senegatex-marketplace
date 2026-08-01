import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/external/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

interface UploadedDocs {
  cin?: string;
  photoVehicule?: string;
  certificatCirculation?: string;
  attestationResponsabilite?: string;
  dateVerification?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await req.formData();

    // Get transporter
    const transporteur = await prisma.transporteur.findFirst({
      where: { user: { email: session.user.email } },
    });

    if (!transporteur) {
      return NextResponse.json(
        { error: 'Transporter profile not found' },
        { status: 404 }
      );
    }

    const uploadedDocs: UploadedDocs = {
      dateVerification: new Date().toISOString(),
    };

    // Upload CIN (required)
    const cinFile = formData.get('cin') as File;
    if (cinFile) {
      const cinUrl = await uploadToCloudinary(cinFile, 'transporteur/cin');
      uploadedDocs.cin = cinUrl;
    }

    // Upload vehicle photo (required)
    const photoVehiculeFile = formData.get('photoVehicule') as File;
    if (photoVehiculeFile) {
      const photoUrl = await uploadToCloudinary(
        photoVehiculeFile,
        'transporteur/vehicle'
      );
      uploadedDocs.photoVehicule = photoUrl;
    }

    // Upload circulation certificate (optional for MVP)
    const certFile = formData.get('certificatCirculation') as File;
    if (certFile) {
      const certUrl = await uploadToCloudinary(
        certFile,
        'transporteur/certificate'
      );
      uploadedDocs.certificatCirculation = certUrl;
    }

    // Validate required docs
    if (!uploadedDocs.cin || !uploadedDocs.photoVehicule) {
      return NextResponse.json(
        { error: 'CIN and vehicle photo are required' },
        { status: 400 }
      );
    }

    // Update transporter with documents
    const updated = await prisma.transporteur.update({
      where: { id: transporteur.id },
      data: {
        documentsVerification: JSON.stringify(uploadedDocs),
        dateVerification: new Date(),
        statut: 'VERIFIED', // Auto-verify for MVP (no OCR)
      },
    });

    return NextResponse.json(
      {
        data: {
          id: updated.id,
          status: updated.statut,
          message: 'Documents uploaded successfully. Your profile is now verified.',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload documents error:', error);
    return NextResponse.json(
      { error: 'Failed to upload documents' },
      { status: 500 }
    );
  }
}
