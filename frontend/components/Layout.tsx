import Link from 'next/link';
import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header - White background like original */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <Image 
                  src="/tawtheeq-logo.png" 
                  alt="Tawtheeq Logo" 
                  width={120} 
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="flex gap-4 text-sm">
                <Link href="/login" className="text-[#0876b1] hover:underline">
                  تسجيل الدخول
                </Link>
                <Link href="#" className="text-[#0876b1] hover:underline">
                  English
                </Link>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-[#630527] text-xl font-bold">نظام التوثيق الوطني</h1>
              <p className="text-gray-600 text-sm">National Authentication System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {children}
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
