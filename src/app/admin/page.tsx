'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardBody, CardFooter, Button, Alert } from '@/components/common';

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalTransactions: number;
  monthlyRevenue: number;
  activeListings: number;
  soldListings: number;
  pendingReports: number;
  bannedUsers: number;
}

interface Report {
  id: string;
  listingId: string;
  listing: { title: string };
  reason: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (session && session.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchDashboard();
  }, [session, router]);

  async function fetchDashboard() {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) throw new Error('Failed to load dashboard');

      const data = await res.json();
      setStats(data.stats);
      setReports(data.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleReportAction(reportId: string, action: 'resolve' | 'dismiss') {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'resolve' ? 'RESOLVED' : 'DISMISSED' }),
      });

      if (!res.ok) throw new Error('Failed to update report');

      // Refresh
      fetchDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating report');
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-accent-600">Redirecting...</p>
      </div>
    );
  }

  if (session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert type="error" message="Access denied. Admin only." dismissible={false} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-accent-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
            <p className="text-accent-600 mt-1">Manage marketplace & moderation</p>
          </div>
          <Link href="/" className="text-primary-500 hover:underline">
            Back to site
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-accent-600">Loading dashboard...</p>
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Active Listings', value: stats.activeListings, icon: '📋' },
                { label: 'Sold Items', value: stats.soldListings, icon: '✅' },
                { label: 'Monthly Revenue', value: `${stats.monthlyRevenue}M XOF`, icon: '💰' },
              ].map((stat, i) => (
                <Card key={i}>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-accent-600 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                      </div>
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Pending Reports */}
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-lg font-bold text-neutral-900">Pending Reports</h2>
                <p className="text-sm text-accent-600">
                  {stats.pendingReports} items flagged for review
                </p>
              </CardHeader>
              <CardBody>
                {reports.length === 0 ? (
                  <p className="text-accent-600 text-center py-8">No pending reports</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="border rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <p className="font-semibold">{report.listing.title}</p>
                          <p className="text-sm text-accent-600 mt-1">
                            <strong>Reason:</strong> {report.reason}
                          </p>
                          <p className="text-xs text-accent-500 mt-2">
                            Reported: {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleReportAction(report.id, 'resolve')}
                          >
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportAction(report.id, 'dismiss')}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card hoverable>
                <CardBody>
                  <h3 className="font-bold mb-2">👥 Manage Users</h3>
                  <p className="text-sm text-accent-600 mb-4">
                    Ban/suspend users, view profiles
                  </p>
                </CardBody>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Manage Users
                  </Button>
                </CardFooter>
              </Card>

              <Card hoverable>
                <CardBody>
                  <h3 className="font-bold mb-2">📋 All Listings</h3>
                  <p className="text-sm text-accent-600 mb-4">
                    Review, delete suspicious listings
                  </p>
                </CardBody>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Listings
                  </Button>
                </CardFooter>
              </Card>

              <Card hoverable>
                <CardBody>
                  <h3 className="font-bold mb-2">💳 Transactions</h3>
                  <p className="text-sm text-accent-600 mb-4">
                    View payment history, refunds
                  </p>
                </CardBody>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Transactions
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Activity Log */}
            <Card className="mt-8">
              <CardHeader>
                <h2 className="text-lg font-bold text-neutral-900">Activity Log</h2>
                <p className="text-sm text-accent-600">Recent admin actions</p>
              </CardHeader>
              <CardBody>
                <p className="text-accent-600 text-center py-8">
                  No activity yet (coming soon)
                </p>
              </CardBody>
            </Card>
          </>
        ) : null}
      </div>
    </main>
  );
}
