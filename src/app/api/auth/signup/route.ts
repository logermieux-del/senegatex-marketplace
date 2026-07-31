import { NextRequest, NextResponse } from 'next/server';
import { signupSchema } from '@/lib/validators';
import { hashPassword } from '@/lib/password';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = signupSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered', details: { email: 'User already exists' } },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validated.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.issues) {
      // Zod validation error
      const details: Record<string, string> = {};
      error.issues.forEach((issue: any) => {
        details[issue.path[0]] = issue.message;
      });
      return NextResponse.json(
        { error: 'Validation error', details },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
