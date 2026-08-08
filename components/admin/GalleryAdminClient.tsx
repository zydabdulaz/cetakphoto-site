'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface GalleryImageItem {
  id: string;
  imageUrl: string;
  aspectRatio: number;
  sortOrder: number;
  createdAt: string;
}

export function GalleryAdminClient({ initialImages }: { initialImages: GalleryImageItem[] }) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImageItem[]>(initialImages);
  const [imageUrl, setImageUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState('0.75'); // 0.75 = 3:4, 1 = 1:1, 1.333 = 4:3
  const [sortOrder, setSortOrder] = useState('10');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, aspectRatio, sortOrder }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal mengunggah foto.');
        setIsLoading(false);
        return;
      }

      setImageUrl('');
      setIsLoading(false);

      // Refresh list
      const fetchRes = await fetch('/api/admin/gallery');
      const fetchData = await fetchRes.json();
      if (fetchData.images) {
        setImages(fetchData.images);
      }
      router.refresh();
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto ini dari galeri?')) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
        router.refresh();
      }
    } catch {
      alert('Gagal menghapus foto.');
    } finally {
      setDeletingId(null);
    }
  };

  const getRatioLabel = (val: number) => {
    if (Math.abs(val - 0.75) < 0.1) return '3:4 Portrait';
    if (Math.abs(val - 1.0) < 0.1) return '1:1 Square';
    if (Math.abs(val - 1.333) < 0.1) return '4:3 Landscape';
    return '1:1';
  };

  return (
    <div className="space-y-8">
      {/* Upload Form Box */}
      <div className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Plus className="size-4 text-amber-600" />
          <span>Tambah Foto Baru ke Galeri</span>
        </h3>

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleAddImage} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
              URL Gambar Foto *
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full h-11 px-4 text-xs font-mono bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 uppercase tracking-wider">
              Rasio Aspek Foto *
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full h-11 px-4 text-xs font-semibold bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="0.75">3:4 Portrait (Rasio Foto Studio)</option>
              <option value="1">1:1 Square (Rasio Album Persegi)</option>
              <option value="1.3333333333333333">4:3 Landscape (Rasio Cetak Kanvas)</option>
            </select>
          </div>

          <div className="md:col-span-3 flex items-center justify-between pt-2">
            <div className="text-[11px] text-stone-400">
              * Algoritma Auto-Arrange akan menyusun foto secara seimbang berdasarkan rasio ini.
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Plus className="size-4" />}
              <span>Simpan ke Galeri</span>
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Showcase Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
          <span>Daftar Foto di Galeri ({images.length})</span>
          <span className="text-xs font-normal text-stone-500">Live Synchronized dengan Galeri Publik</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden group relative flex flex-col justify-between shadow-sm"
            >
              <div className="relative w-full aspect-square overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={img.imageUrl}
                  alt="Gallery Item"
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-medium">
                  {getRatioLabel(img.aspectRatio)}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/40 border-t border-stone-100 dark:border-stone-800">
                <span className="text-[11px] font-mono text-stone-500 truncate max-w-[140px]">
                  #{img.id}
                </span>

                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
                  title="Hapus foto dari galeri"
                >
                  {deletingId === img.id ? (
                    <RefreshCw className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
