import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header - White background like original */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/tawtheeq-logo.png" 
                alt="Tawtheeq Logo" 
                width={120} 
                height={60}
                className="h-12 w-auto"
              />
            </div>
            <div className="text-left">
              <h1 className="text-[#630527] text-xl font-bold">نظام التوثيق الوطني</h1>
              <p className="text-gray-600 text-sm">National Authentication System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Main content box with light gray background */}
          <div className="bg-[#f5f5f5] rounded border border-gray-300 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                الصفحة الرئيسية لبوابة الخدمة الذاتية
              </h2>
            </div>

            <div className="space-y-6">
              {/* First section */}
              <div>
                <p className="text-gray-700 mb-3">
                  إذا لم يكن لديك حساب مستخدم، يرجى محاولة القيام بالإجراء الآتي:
                </p>
                <ul className="list-disc list-inside mr-6">
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:underline"
                    >
                      تسجيل مستخدم جديد
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Second section */}
              <div>
                <p className="text-gray-700 mb-3">
                  إذا لم تتمكن من الدخول إلى حسابك، يرجى محاولة القيام بأحد الإجراءات الآتية:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-6">
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:underline"
                    >
                      إعادة تعيين كلمة المرور
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:underline"
                    >
                      تغيير رقم الجوال
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:underline"
                    >
                      إعادة تفعيل الحساب
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Login button section */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-gray-700 mb-4 font-bold">
                  للوصول إلى بوابة الخدمة الذاتية:
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-2 px-6 rounded transition-colors"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - matching original */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">© 2025 حكومة قطر</p>
        </div>
      </footer>
    </div>
  );
}
