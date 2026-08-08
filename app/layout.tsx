import './globals.css';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
const sans = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-sans' });
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
});
export const metadata = {
  title: 'CetakPhoto | Foto kamu jadi lebih berarti',
  description: 'Pas foto, cetak foto, studio, self-studio, photobox, canvas, dan frame.',
  icons: {
    icon: '/brand/cetakphoto.svg',
    shortcut: '/brand/cetakphoto.svg',
    apple: '/brand/cetakphoto.svg',
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${sans.variable} ${serif.variable}`}>{children}</body>
    </html>
  );
}
