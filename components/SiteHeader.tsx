import Link from 'next/link';
import { whatsappUrl } from '@/lib/whatsapp';

interface SiteHeaderProps {
  onOpenOutlet?: () => void;
  onOpenGaleri?: () => void;
}

export function SiteHeader({ onOpenOutlet, onOpenGaleri }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="shell nav">
        <Link className="brand" href="/" aria-label="CetakPhoto Home">
          <img
            src="/brand/cetakphoto.svg"
            alt="CetakPhoto Logo"
            className="brand-logo-img"
          />
        </Link>
        <nav>
          {onOpenOutlet ? (
            <button type="button" className="nav-item-button" onClick={onOpenOutlet}>
              Outlet
            </button>
          ) : (
            <Link href="/?modal=outlet">Outlet</Link>
          )}

          {onOpenGaleri ? (
            <button type="button" className="nav-item-button" onClick={onOpenGaleri}>
              Galeri
            </button>
          ) : (
            <Link href="/?modal=galeri">Galeri</Link>
          )}

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
