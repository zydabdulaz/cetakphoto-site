import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { CatalogClient } from '@/components/CatalogClient';
export default function CatalogPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="catalog-hero">
          <div className="shell catalog-hero-grid">
            <div>
              <span className="eyebrow">Catalog mode aktif</span>
              <h1>
                Semua pilihan, <em>satu halaman.</em>
              </h1>
              <p>
                Landing page berubah menjadi mode scrollable di sini. Pilih kategori di atas lalu
                lihat detail produk dan jasa.
              </p>
              <Link className="button outline" href="/">
                ← Kembali ke showcase
              </Link>
            </div>
            <div className="catalog-hero-art">
              <div className="hero-frame">sample frame</div>
            </div>
          </div>
        </section>
        <section className="catalog-content">
          <div className="shell">
            <CatalogClient />
          </div>
        </section>
      </main>
    </>
  );
}
