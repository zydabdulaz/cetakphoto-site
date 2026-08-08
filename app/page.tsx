'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { whatsappUrl } from '@/lib/whatsapp';
import { Badge } from '@/components/ui/badge-1';
import { ImageGallery } from '@/components/ui/image-gallery';

const slides = [
  [
    'Pas Foto · Cetak Foto',
    'Foto kamu, jadi lebih berarti.',
    'Mulai dari kebutuhan sehari-hari sampai foto yang ingin kamu simpan di dinding.',
  ],
  [
    'Photo Studio · Self-Studio',
    'Ruang untuk jadi dirimu.',
    'Sesi keluarga, graduation, couple, group, atau ambil kendali sendiri.',
  ],
  [
    'Frame · Photobox',
    'Momen kecil, dibuat tinggal lama.',
    'Cetak sebagai kenangan, bingkai sebagai bagian dari ruang, atau rayakan bareng teman.',
  ],
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [activeModal, setActiveModal] = useState<'outlet' | 'galeri' | null>(null);

  useEffect(() => {
    const t = setInterval(() => setSlide((v) => (v + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modalParam = params.get('modal');
    if (modalParam === 'outlet' || modalParam === 'galeri') {
      setActiveModal(modalParam);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  return (
    <div className="single-page-wrapper">
      <SiteHeader
        onOpenOutlet={() => setActiveModal('outlet')}
        onOpenGaleri={() => setActiveModal('galeri')}
      />
      <main className="single-main">
        <section className="showcase">
          <div className="shell showcase-grid">
            <div className="showcase-copy">
              <span className="eyebrow">{slides[slide][0]}</span>
              <h1>{slides[slide][1]}</h1>
              <p>{slides[slide][2]}</p>
              <div className="actions">
                <Link className="button primary" href="/catalog">
                  Lihat catalog lengkap
                </Link>
              </div>
              <div className="slide-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={slide === i ? 'active' : ''}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </div>
            <div className="showcase-art">
              <div className={`art-back art-${slide}`} />
              <div className={`showcase-photo photo-a photo-${slide}`} />
              <div className={`showcase-photo photo-b photo-${slide}`} />
              <div className="art-caption">sample visual</div>
            </div>
          </div>
        </section>

        <section className="quick-nav">
          <div className="shell quick-grid">
            <span className="eyebrow">Akses Cepat</span>
            <Link href="/catalog#pasfoto">Pas Foto ↗</Link>
            <Link href="/catalog#studio">Photo Studio ↗</Link>
            <Link href="/catalog#self">Self-Studio ↗</Link>
            <Link href="/catalog#photobox">Photobox ↗</Link>
            <Link href="/catalog#minimalist">Frame ↗</Link>
          </div>
        </section>
      </main>

      {/* Outlet Preview Modal */}
      {activeModal === 'outlet' && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="modal-container modal-wide"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="outlet-modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">Lokasi & Jam Operasional</span>
                <h2 id="outlet-modal-title">Outlet & Studio CetakPhoto</h2>
                <p className="modal-subtitle">
                  Kunjungi studio fisik kami untuk cetak kilat, foto studio, photobox, atau
                  konsultasi album & frame custom.
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="outlet-grid">
                {/* Outlet 1: Central */}
                <div className="outlet-card double-bezel">
                  <div className="outlet-card-top">
                    <div className="status-row">
                      <span className="status-live">
                        <span className="status-dot" /> Buka Hari Ini
                      </span>
                      <Badge variant="amber" size="sm">
                        Studio Utama
                      </Badge>
                    </div>
                    <h3>CetakPhoto Central</h3>
                    <p className="outlet-address">
                      📍 Jl. Kemang Raya No. 12, Jakarta Selatan (Seberang Mall Kemang)
                    </p>
                  </div>

                  <div className="outlet-meta-grid">
                    <div className="meta-box">
                      <span className="info-label">Jam Operasional</span>
                      <strong>09:00 - 21:00 WIB</strong>
                      <small>Senin – Minggu</small>
                    </div>
                    <div className="meta-box">
                      <span className="info-label">Layanan Utama</span>
                      <strong>Studio & Cetak Frame</strong>
                      <small>Pas Foto, Studio Family, Frame</small>
                    </div>
                    <div className="meta-box">
                      <span className="info-label">Fasilitas</span>
                      <strong>Ruang Ganti & Lighting</strong>
                      <small>AC, Dressing Mirror, Props</small>
                    </div>
                    <div className="meta-box">
                      <span className="info-label">Estimasi Cetak</span>
                      <strong>Instant 10-15 Menit</strong>
                      <small>Langsung jadi di tempat</small>
                    </div>
                  </div>

                  <div className="outlet-tags">
                    <Badge variant="amber-subtle" size="sm">
                      Cetak Kilat
                    </Badge>
                    <Badge variant="amber-subtle" size="sm">
                      Full Lighting Studio
                    </Badge>
                    <Badge variant="amber-subtle" size="sm">
                      Frame Custom
                    </Badge>
                    <Badge variant="amber-subtle" size="sm">
                      Parkir Gratis
                    </Badge>
                  </div>

                  <div className="outlet-actions">
                    <a
                      className="button primary btn-sm"
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Navigasi Maps ↗
                    </a>
                    <a
                      className="button outline btn-sm"
                      href={whatsappUrl('Outlet Central Kemang')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat Studio WhatsApp
                    </a>
                  </div>
                </div>

                {/* Outlet 2: Space Mall */}
                <div className="outlet-card double-bezel">
                  <div className="outlet-card-top">
                    <div className="status-row">
                      <span className="status-live">
                        <span className="status-dot" /> Buka Hari Ini
                      </span>
                      <Badge variant="purple" size="sm">
                        Self-Studio & Box
                      </Badge>
                    </div>
                    <h3>CetakPhoto Space</h3>
                    <p className="outlet-address">
                      📍 Mall Grand Indonesia, Lt. 2 West Mall No. 45, Jakarta Pusat
                    </p>
                  </div>

                  <div className="outlet-meta-grid">
                    <div className="meta-box">
                      <span className="info-label">Jam Operasional</span>
                      <strong>10:00 - 22:00 WIB</strong>
                      <small>Mengikuti Jam Mall</small>
                    </div>
                    <div className="meta-box">
                      <span className="info-label">Layanan Utama</span>
                      <strong>Self-Studio & Photobox</strong>
                      <small>Remote Shutter & Print Strip</small>
                    </div>
                    <div className="meta-box">
                      <span className="info-label">Fasilitas</span>
                      <strong>Private Studio Booth</strong>
                      <small>Background Digital & Props</small>
                    </div>
                    <div className="meta-box">
                      <span className="info-label">Estimasi Cetak</span>
                      <strong>Auto Print Photobox</strong>
                      <small>Hasil cetak langsung keluar</small>
                    </div>
                  </div>

                  <div className="outlet-tags">
                    <Badge variant="purple-subtle" size="sm">
                      Remote Shutter
                    </Badge>
                    <Badge variant="purple-subtle" size="sm">
                      Photobox Strip
                    </Badge>
                    <Badge variant="purple-subtle" size="sm">
                      Soft Drinks Free
                    </Badge>
                    <Badge variant="purple-subtle" size="sm">
                      Akses Mall Easy
                    </Badge>
                  </div>

                  <div className="outlet-actions">
                    <a
                      className="button primary btn-sm"
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Navigasi Maps ↗
                    </a>
                    <a
                      className="button outline btn-sm"
                      href={whatsappUrl('Outlet Space Grand Indonesia')}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat Studio WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="modal-footer-callout">
                <div>
                  <strong>Butuh reservasi jadwal studio atau tanya lokasi terdekat?</strong>
                  <p>Tim admin kami siap membantu mengecek ketersediaan slot studio saat ini.</p>
                </div>
                <a
                  className="button primary"
                  href={whatsappUrl('Tanya ketersediaan slot outlet studio')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Konsultasi Studio →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Galeri Preview Modal */}
      {activeModal === 'galeri' && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            className="modal-container modal-wide"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="galeri-modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">Hasil Photo Studio</span>
                <h2 id="galeri-modal-title">Galeri CetakPhoto</h2>
                <p className="modal-subtitle">
                  Koleksi sampel foto studio, pas foto dan self-studio berkualitas tinggi.
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setActiveModal(null)}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <ImageGallery />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
