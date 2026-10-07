import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import 'modern-normalize/modern-normalize.css';
import css from "./Home.module.css";
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NoteHub",
  description: "NoteHub",

  openGraph: {
    title: 'NoteHub',
    description: 'NoteHub',
    url: 'https://goit-next-hw-08-zustand.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 800,
        alt: 'NoteHub',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <TanStackProvider>
          <Header />
            <main className={css.main}>
              {children}
            </main>
            {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
