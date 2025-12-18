'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';

export default function Step1Page() {
  const router = useRouter();
  const [userType, setUserType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      alert('يرجى اختيار نوع الحساب');
      return;
    }
    // Save data and proceed to next step
    router.push('/step3');
  };

  return (
    <Layout title="نظام التوثيق الوطني | التسجيل">
      <ProgressBar currentStep={1} totalSteps={6} />

      <div className="bg-white rounded border border-gray-300 p-8 mt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">اختر نوع الحساب</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="font-medium text-gray-700">نوع الحساب</label>
              <span 
                className="text-[#0876b1] cursor-help" 
                title="إذا كنت تحمل الجنسية القطرية أو تقيم في دولة قطر، يرجى استخدام رقم البطاقة الشخصية القطرية.&#10;&#10;الزوار والمستخدمين خارج دولة قطر&#10;يرجى استخدام عنوان بريد إلكتروني صحيح."
              >
                ℹ️
              </span>
            </div>

            <div className="space-y-3 mr-6">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="userTypeQID"
                  name="userType"
                  value="QID"
                  checked={userType === 'QID'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-4 h-4 text-[#0876b1] focus:ring-[#0876b1]"
                />
                <label htmlFor="userTypeQID" className="text-gray-700 cursor-pointer">
                  المواطنين القطريين والمقيمين
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="userTypeNonQID"
                  name="userType"
                  value="NON_QID"
                  checked={userType === 'NON_QID'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-4 h-4 text-[#0876b1] focus:ring-[#0876b1]"
                />
                <label htmlFor="userTypeNonQID" className="text-gray-700 cursor-pointer">
                  الزوار والمستخدمين من خارج دولة قطر
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-300">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded transition-colors"
            >
              رجوع
            </button>
            <button
              type="submit"
              className="bg-[#0876b1] hover:bg-[#065681] text-white font-medium py-2 px-6 rounded transition-colors"
            >
              استمر
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
