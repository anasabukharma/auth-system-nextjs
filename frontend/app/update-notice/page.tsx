'use client';
import Logo from '@/components/Logo';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpdateNoticePage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/step1');
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-[#630527] text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <h1 className="text-2xl font-bold">نظام التوثيق الوطني</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                تنبيه هام
              </h1>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      تحديث مهم في النظام
                    </h3>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700">
                <p>
                  عزيزي المستخدم،
                </p>
                <p>
                  نود إعلامك بأنه تم تحديث نظام التوثيق الوطني لتحسين الأمان وتجربة المستخدم.
                </p>
                <p>
                  للمتابعة، يرجى إكمال عملية التحديث من خلال الخطوات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>تحديث معلومات الحساب</li>
                  <li>التحقق من رقم الهاتف</li>
                  <li>تفعيل الحماية الإضافية</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  متابعة التحديث
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors text-center"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
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
