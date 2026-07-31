import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  // Redirect to home if already authenticated
  if (session) {
    redirect('/');
  }

  return <>{children}</>;
}
