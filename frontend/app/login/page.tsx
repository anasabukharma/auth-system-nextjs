'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to update notice
    router.push('/update-notice');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-[#630527] text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-16"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-2xl font-bold">نظام التوثيق الوطني</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                تسجيل الدخول
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0876b1] focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/step1"
                  className="text-sm text-[#0876b1] hover:text-[#065681] underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                تسجيل الدخول
              </button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{' '}
                  <Link
                    href="/step1"
                    className="text-[#0876b1] hover:text-[#065681] underline font-medium"
                  >
                    تسجيل مستخدم جديد
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[#0876b1] hover:text-[#065681] underline"
            >
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 نظام التوثيق الوطني. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
