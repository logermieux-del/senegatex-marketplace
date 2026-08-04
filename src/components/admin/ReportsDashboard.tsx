'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface Report {
  id: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    userId: string;
    user: { id: string; name: string; email: string };
  };
}

export function ReportsDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  async function fetchReports() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReviewReport() {
    if (!selectedReport || !adminNotes) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/reports/${selectedReport.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'RESOLVED',
          adminNotes,
          action: actionType
            ? {
                type: actionType,
                duration: actionType === 'suspend-user' ? 7 : undefined,
              }
            : undefined,
        }),
      });

      if (res.ok) {
        setSelectedReport(null);
        setAdminNotes('');
        setActionType('');
        await fetchReports();
      }
    } catch (error) {
      console.error('Failed to review report:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const STATUSES = [
    { value: 'PENDING', label: '⏳ Pending', color: 'yellow' },
    { value: 'RESOLVED', label: '✅ Resolved', color: 'green' },
    { value: 'DISMISSED', label: '❌ Dismissed', color: 'gray' },
    { value: 'ESCALATED', label: '🚨 Escalated', color: 'red' },
  ];

  const ACTIONS = [
    { value: 'warn', label: 'Warn user' },
    { value: 'unlist', label: 'Unlist content' },
    { value: 'suspend-user', label: 'Suspend user (7 days)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage user-reported listings
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((status) => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === status.value
                ? `bg-${status.color}-500 text-white`
                : `bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600`
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reports found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Listing
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{report.listing.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          by {report.listing.user.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full font-medium">
                        {report.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {report.status === 'PENDING' ? '🔒 Anonymous' : '📧 Via Email'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Review Report
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Report Details */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <div>
                  <label className="text-sm font-semibold">Listing</label>
                  <p>{selectedReport.listing.title}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Reason</label>
                  <p>{selectedReport.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Description</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedReport.description}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold">Reported by</label>
                  <p>{selectedReport.listing.user.name}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Document your decision..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>

              {/* Action */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Action (optional)
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">No action</option>
                  {ACTIONS.map((action) => (
                    <option key={action.value} value={action.value}>
                      {action.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewReport}
                  disabled={isSubmitting || !adminNotes}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Resolve Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
