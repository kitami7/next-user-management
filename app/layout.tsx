import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';
import './globals.css';
import { CLIENT_STATIC_FILES_RUNTIME_AMP } from 'next/dist/shared/lib/constants';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-dark text-white py-3">
          <nav className="container navbar navbar-expand-lg navbar-dark">
            <Link href={'/'} className="navbar-brand">ユーザー管理アプリ</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ユーザー
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li>
                      <Link href="/users" className="dropdown-item">一覧</Link>
                    </li>
                    <li>
                      <Link href="/users/create" className="dropdown-item">作成</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main className="container mt-5 bg-light p-4">
          {children}
        </main>
        <footer className="bg-dark text-white py-3 mt-5">
          <div className="container text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} My Application. All rights reserved.</p>
          </div>
        </footer>
        {/* Bootstrap JSを読み込む */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
          strategy="beforeInteractive" 
        />
      </body>
    </html> 
  );
}
