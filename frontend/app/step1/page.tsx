'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';

export default function Step1Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    birthDate: '',
    phoneNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save data and proceed to next step
    router.push('/step3');
  };

  return (
    <Layout title="الخطوة الأولى - المعلومات الشخصية">
      <ProgressBar currentStep={1} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            placeholder="أدخل الاسم الكامل"
            required
          />
        </div>

        <div>
          <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهوية الوطنية <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nationalId"
            value={formData.nationalId}
            onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            placeholder="أدخل رقم الهوية"
            required
          />
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ الميلاد <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            رقم الجوال <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            placeholder="05XXXXXXXX"
            required
          />
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
            onClick={() => router.push('/')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Layout>
  );
}
