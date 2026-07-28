'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
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
  useEffect(() => {
    const t = setInterval(() => setSlide((v) => (v + 1) % 3), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <SiteHeader />
      <main>
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
                <button className="button outline" onClick={() => setSlide((v) => (v + 1) % 3)}>
                  Ganti jasa / produk ↗
                </button>
              </div>
              <small>0{slide + 1} / 03 · Demo showcase</small>
            </div>
            <div className="showcase-art">
              <div className={`art-back art-${slide}`} />
              <div className={`showcase-photo photo-a photo-${slide}`} />
              <div className={`showcase-photo photo-b photo-${slide}`} />
              <div className="art-caption">sample visual</div>
            </div>
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
        </section>
        <section className="quick-nav" id="layanan">
          <div className="shell quick-grid">
            <span className="eyebrow">Jelajahi kebutuhanmu</span>
            <Link href="/catalog#pasfoto">Pas Foto ↗</Link>
            <Link href="/catalog#studio">Studio ↗</Link>
            <Link href="/catalog#paper">Cetak Foto ↗</Link>
            <Link href="/catalog#frames">Frame ↗</Link>
            <Link href="/catalog#photobox">Photobox ↗</Link>
          </div>
        </section>
      </main>
    </>
  );
}
