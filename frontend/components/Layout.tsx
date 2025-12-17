import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-[#630527] text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
              <img 
                src="/images/logo.png" 
                alt="Logo" 
                className="h-16"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-2xl font-bold">نظام التوثيق الوطني</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {title && (
              <div className="border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {title}
                </h1>
              </div>
            )}
            {children}
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
