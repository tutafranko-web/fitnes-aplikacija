import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FIT — Fitness App',
  description: 'Your ultimate fitness companion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="font-outfit bg-fit-bg text-fit-text min-h-screen">
        {children}
      </body>
    </html>
  );
}
