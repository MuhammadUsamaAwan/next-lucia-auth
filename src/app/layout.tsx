import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Lucia Auth',
  description: 'An example of how to implement authentication using Next.js, Lucia and Drizzle ORM',
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
