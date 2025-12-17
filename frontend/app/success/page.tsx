import Link from 'next/link';
import Logo from '@/components/Logo';

export default function SuccessPage() {
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
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              تم التفعيل بنجاح!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              تم إكمال جميع خطوات التسجيل بنجاح. حسابك الآن مفعل ويمكنك استخدام جميع الخدمات.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="font-bold text-green-800 mb-3">الخطوات التالية:</h2>
              <ul className="text-right space-y-2 text-green-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>يمكنك الآن تسجيل الدخول باستخدام بياناتك</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>تحقق من بريدك الإلكتروني للحصول على تفاصيل إضافية</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 ml-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>احتفظ برقم PIN الخاص بك في مكان آمن</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              في حال واجهت أي مشكلة، يرجى{' '}
              <a href="#" className="text-[#0876b1] hover:text-[#065681] underline">
                التواصل مع الدعم الفني
              </a>
            </p>
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
