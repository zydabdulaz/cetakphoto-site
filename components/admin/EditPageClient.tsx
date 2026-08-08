'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';

interface PageItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  content: string | null;
  published: number;
}

export function EditPageClient({ pageData }: { pageData: PageItem }) {
  const router = useRouter();
  const [title, setTitle] = useState(pageData.title);
  const [description, setDescription] = useState(pageData.description || '');
  const [imageUrl, setImageUrl] = useState(pageData.imageUrl || '');
  const [published, setPublished] = useState(pageData.published === 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: pageData.slug, title, description, imageUrl, published }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal menyimpan halaman.');
        setIsLoading(false);
        return;
      }

      router.push('/admin/pages');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pages"
          className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Edit Halaman: /{pageData.slug}
          </h1>
          <p className="text-xs text-stone-500">Perbarui judul, deskripsi subtitle, & ilustrasi gambar.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 text-xs rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-6 md:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-6 shadow-sm">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Judul Halaman *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 px-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            Deskripsi / Subtitle Halaman
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
            URL Gambar Ilustrasi / Hero Header
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full h-11 px-4 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-xs"
          />
          {imageUrl && (
            <div className="mt-3">
              <img src={imageUrl} alt="Preview" className="h-32 w-auto rounded-xl border border-stone-200 dark:border-stone-700 object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
          <input
            type="checkbox"
            id="publishToggle"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-5 rounded text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="publishToggle" className="text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
            Terbitkan Perubahan (Published langsung di website publik)
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
          <Link
            href="/admin/pages"
            className="px-5 py-2.5 text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span>Terbitkan Halaman</span>
          </button>
        </div>
      </form>
    </div>
  );
}
