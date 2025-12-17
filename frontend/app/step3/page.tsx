'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';

export default function Step3Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/step4');
  };

  return (
    <Layout title="الخطوة الثالثة - معلومات إضافية">
      <ProgressBar currentStep={3} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            placeholder="example@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            العنوان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            placeholder="أدخل العنوان"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              المدينة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
              placeholder="أدخل المدينة"
              required
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
              الرمز البريدي <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
              placeholder="XXXXX"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            التالي ←
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            → السابق
          </button>
        </div>
      </form>
    </Layout>
  );
}
