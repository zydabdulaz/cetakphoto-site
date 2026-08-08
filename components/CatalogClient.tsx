'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { catalog } from '@/content/catalog';
import { whatsappUrl } from '@/lib/whatsapp';
export function CatalogClient() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [liveProducts, setLiveProducts] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          const activeOnly = data.products.filter((p: any) => p.status === 'active');
          setLiveProducts(activeOnly);
        }
      })
      .catch(() => {});
  }, []);

  const sections = useMemo(() => {
    let sourceCatalog = catalog;

    if (liveProducts.length > 0) {
      const printItems = liveProducts.filter((p) => (p.category || 'print') === 'print');
      const frameItems = liveProducts.filter((p) => p.category === 'frame');
      const serviceItems = liveProducts.filter((p) => p.category === 'service');

      const builtSections: any[] = [];

      if (printItems.length > 0) {
        builtSections.push({
          id: 'db-print',
          title: 'Cetak Foto & Canvas',
          group: 'print',
          intro: 'Koleksi produk cetak kertas foto premium dan kanvas berkualitas galeri.',
          items: printItems.map((p) => ({
            name: p.name,
            detail: p.description,
            price: `Rp ${p.price.toLocaleString('id-ID')}`,
            image: p.imageUrl,
          })),
        });
      }

      if (frameItems.length > 0) {
        builtSections.push({
          id: 'db-frame',
          title: 'Frame Minimalis & Dekoratif',
          group: 'frame',
          intro: 'Koleksi bingkai kayu minimalis, frame 3D, dan kustom siap pajang.',
          items: frameItems.map((p) => ({
            name: p.name,
            detail: p.description,
            price: `Rp ${p.price.toLocaleString('id-ID')}`,
            image: p.imageUrl,
          })),
        });
      }

      if (serviceItems.length > 0) {
        builtSections.push({
          id: 'db-service',
          title: 'Jasa Foto Studio, Self-Studio & Photobox',
          group: 'service',
          intro: 'Paket pas foto dokumen, sesi foto keluarga, self-studio, dan photobox instan.',
          items: serviceItems.map((p) => ({
            name: p.name,
            detail: p.description,
            price: `Rp ${p.price.toLocaleString('id-ID')}`,
            image: p.imageUrl,
          })),
        });
      }

      if (builtSections.length > 0) {
        sourceCatalog = builtSections;
      }
    }

    return sourceCatalog
      .map((s) => ({
        ...s,
        items: s.items.filter((i) =>
          (i.name + ' ' + i.detail + ' ' + s.title).toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((s) => (filter === 'all' || s.group === filter) && s.items.length);
  }, [filter, query, liveProducts]);
  return (
    <>
      <div className="catalog-toolbar">
        <input
          aria-label="Cari catalog"
          placeholder="Cari ukuran, paket, atau frame..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filters">
          {[
            ['all', 'Semua'],
            ['print', 'Produk cetak'],
            ['frame', 'Frame'],
            ['service', 'Jasa foto'],
          ].map(([id, label]) => (
            <button
              className={`pill ${filter === id ? 'active' : ''}`}
              key={id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {sections.map((s) => (
        <section className="catalog-section" id={s.id} key={s.id}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">{s.group}</span>
              <h2>{s.title}</h2>
            </div>
            <p>{s.intro}</p>
          </div>
          <div className="catalog-grid">
            {s.items.map((i) => (
              <article className="catalog-item" key={i.name}>
                <div className={`catalog-visual ${s.group}`}>
                  <span>
                    {s.group === 'print' ? 'Cetak' : s.group === 'frame' ? 'Frame' : 'Jasa'}
                  </span>
                </div>
                <div className="item-copy">
                  <div>
                    <h3>{i.name}</h3>
                    <p>{i.detail}</p>
                  </div>
                  <strong>{i.price}</strong>
                </div>
                <Link className="text-link" href={whatsappUrl(i.name)}>
                  Tanya produk ini →
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}
      {!sections.length && (
        <div className="empty">
          <h2>Tidak ketemu.</h2>
          <p>Coba kata kunci lain atau filter Semua.</p>
        </div>
      )}
      <div className="custom-callout">
        <div>
          <span className="eyebrow">Butuh custom?</span>
          <h3>Ukuran, frame, atau paket khusus.</h3>
          <p>Konsultasikan kombinasi produk, jumlah orang, durasi, dan kebutuhan event.</p>
        </div>
        <Link className="button primary" href={whatsappUrl('pesanan custom')}>
          Konsultasi custom
        </Link>
      </div>
    </>
  );
}
