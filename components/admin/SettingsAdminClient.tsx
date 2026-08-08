'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, RefreshCw, Globe, Phone, MapPin, Camera, Palette } from 'lucide-react';

export function SettingsAdminClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(initialSettings.site_name || 'CetakPhoto');
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || '/brand/cetakphoto.svg');
  const [phone, setPhone] = useState(initialSettings.phone || '6281234567890');
  const [address, setAddress] = useState(initialSettings.address || 'Jl. Kemang Raya No. 12, Jakarta Selatan');
  const [instagram, setInstagram] = useState(initialSettings.instagram || '@cetakphoto.id');
  const [heroTitle, setHeroTitle] = useState(initialSettings.hero_title || 'Foto kamu, jadi lebih berarti.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialSettings.hero_subtitle || 'Mulai dari kebutuhan sehari-hari sampai foto yang ingin kamu simpan di dinding.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_name: siteName,
          logo_url: logoUrl,
          phone,
          address,
          instagram,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal menyimpan pengaturan.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Pengaturan berhasil diperbarui dan disinkronkan ke website publik!');
      setIsLoading(false);
      router.refresh();
    } catch {
      setError('Terjadi kesalahan koneksi.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-2xl font-semibold">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 text-xs rounded-2xl">
          {error}
        </div>
      )}

      {/* Identitas Situs */}
      <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
          <Globe className="size-5 text-amber-600" />
          <span>Identitas Situs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Nama Website *
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              URL Logo Website (SVG / PNG) *
            </label>
            <input
              type="text"
              required
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full h-11 px-4 text-sm font-mono text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Judul Hero Beranda
          </label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full h-11 px-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Deskripsi Hero Subtitle
          </label>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full p-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Kontak & Sosial */}
      <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
          <Phone className="size-5 text-amber-600" />
          <span>Kontak & Sosial Media</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Nomor WhatsApp Studio *
            </label>
            <input
              type="text"
              required
              placeholder="6281234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-4 text-sm font-mono bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Instagram Studio
            </label>
            <input
              type="text"
              placeholder="@cetakphoto.id"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full h-11 px-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Alamat Utama Studio
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full h-11 px-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-xl shadow-amber-600/20 transition-all disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span>Simpan Semua Pengaturan</span>
        </button>
      </div>
    </form>
  );
}
