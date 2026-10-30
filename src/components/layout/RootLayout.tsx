import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Footer } from './Footer';
import { Header } from './Header';
import { CartSheet } from './CartSheet';
import { ScrollToTop } from '@/components/common/ScrollToTop';

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-bone-light">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1300] focus:bg-ink focus:px-4 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-label focus:text-bone-light"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSheet />
    </div>
  );
}
