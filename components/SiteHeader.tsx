import Link from 'next/link';
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
          <Link className="button primary" href="/catalog">
            Buka catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
