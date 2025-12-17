import Link from 'next/link';

export default function HomePage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                الصفحة الرئيسية لبوابة الخدمة الذاتية
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  إذا لم يكن لديك حساب مستخدم، يرجى محاولة القيام بالإجراء الآتي:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:text-[#065681] underline font-medium"
                    >
                      تسجيل مستخدم جديد
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-lg text-gray-700 mb-4">
                  إذا لم تتمكن من الدخول إلى حسابك، يرجى محاولة القيام بأحد الإجراءات الآتية:
                </p>
                <ul className="list-disc list-inside space-y-2 mr-4">
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:text-[#065681] underline font-medium"
                    >
                      إعادة تعيين كلمة المرور
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/step1" 
                      className="text-[#0876b1] hover:text-[#065681] underline font-medium"
                    >
                      تغيير رقم الجوال
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t">
                <Link
                  href="/login"
                  className="inline-block bg-[#0876b1] hover:bg-[#065681] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  تسجيل الدخول
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
