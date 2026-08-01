import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/external/cloudinary';

interface UploadedDocs {
  cin?: string;
  photoVehicule?: string;
  certificatCirculation?: string;
  attestationResponsabilite?: string;
  dateVerification?: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File must be smaller than 10MB (got ${Math.round(file.size / 1024 / 1024)}MB)` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: JPG, PNG, PDF (got ${file.type})` };
  }

  return { valid: true };
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
    if (!cinFile) {
      return NextResponse.json(
        { error: 'CIN document is required' },
        { status: 400 }
      );
    }

    const cinValidation = validateFile(cinFile);
    if (!cinValidation.valid) {
      return NextResponse.json(
        { error: `CIN validation failed: ${cinValidation.error}` },
        { status: 400 }
      );
    }

    try {
      const cinUrl = await uploadToCloudinary(cinFile, 'transporteur/cin');
      uploadedDocs.cin = cinUrl;
    } catch (err) {
      console.error('CIN upload error:', err);
      return NextResponse.json(
        { error: 'Failed to upload CIN document' },
        { status: 500 }
      );
    }

    // Upload vehicle photo (required)
    const photoVehiculeFile = formData.get('photoVehicule') as File;
    if (!photoVehiculeFile) {
      return NextResponse.json(
        { error: 'Vehicle photo is required' },
        { status: 400 }
      );
    }

    const photoValidation = validateFile(photoVehiculeFile);
    if (!photoValidation.valid) {
      return NextResponse.json(
        { error: `Vehicle photo validation failed: ${photoValidation.error}` },
        { status: 400 }
      );
    }

    try {
      const photoUrl = await uploadToCloudinary(
        photoVehiculeFile,
        'transporteur/vehicle'
      );
      uploadedDocs.photoVehicule = photoUrl;
    } catch (err) {
      console.error('Vehicle photo upload error:', err);
      return NextResponse.json(
        { error: 'Failed to upload vehicle photo' },
        { status: 500 }
      );
    }

    // Upload circulation certificate (optional for MVP)
    const certFile = formData.get('certificatCirculation') as File;
    if (certFile) {
      const certValidation = validateFile(certFile);
      if (!certValidation.valid) {
        return NextResponse.json(
          { error: `Certificate validation failed: ${certValidation.error}` },
          { status: 400 }
        );
      }

      try {
        const certUrl = await uploadToCloudinary(
          certFile,
          'transporteur/certificate'
        );
        uploadedDocs.certificatCirculation = certUrl;
      } catch (err) {
        console.error('Certificate upload error:', err);
        // Don't fail the entire request if optional doc fails
        console.warn('Optional certificate upload failed, continuing');
      }
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
