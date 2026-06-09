import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Security24 – Real-Time Intelligence Briefing',
  description:
    'Platforma za praćenje bezbednosne situacije u Srbiji i svetu u realnom vremenu.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
