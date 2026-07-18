import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import StickyMobileCta from './StickyMobileCta';

interface LayoutProps {
  showStickyMobileCta?: boolean;
}

export default function Layout({ showStickyMobileCta = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-forest focus:px-4 focus:py-2 focus:text-warm-white"
      >
        Preskoči na sadržaj
      </a>
      <Header />
      <main id="main-content" className={`flex-1 ${showStickyMobileCta ? 'pb-20 lg:pb-0' : ''}`}>
        <Outlet />
      </main>
      <Footer />
      {showStickyMobileCta && <StickyMobileCta />}
    </div>
  );
}
