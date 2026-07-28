import Link from 'next/link';
import { whatsappUrl } from '@/lib/whatsapp';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav">
        <Link className="brand" href="/">
          <span className="mark" />
          CetakPhoto
        </Link>
        <nav>
          <Link href="/#layanan">Layanan</Link>
          <Link href="/#produk">Produk</Link>
          <Link href="/catalog">Catalog</Link>
          <a
            className="button primary"
            href={whatsappUrl('layanan CetakPhoto')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hubungi kami
          </a>
        </nav>
      </div>
    </header>
  );
}
