'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2, Check, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function ProductListClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredProducts = productList.filter((p) => {
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) return;

    try {
      setIsDeleting(id);
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProductList((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert(data.error || 'Gagal menghapus produk.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleQuickPriceSave = async (p: Product) => {
    const newPriceVal = parseFloat(tempPrice);
    if (isNaN(newPriceVal) || newPriceVal <= 0) {
      alert('Masukkan harga yang valid.');
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, price: newPriceVal }),
      });
      const data = await res.json();
      if (data.success) {
        setProductList((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, price: newPriceVal } : item))
        );
        setEditingPriceId(null);
        router.refresh();
      }
    } catch {
      alert('Gagal mengupdate harga.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            ['all', 'Semua Status'],
            ['active', 'Aktif'],
            ['draft', 'Draft'],
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap transition-all ${
                statusFilter === val
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500 text-xs">
                    Tidak ada produk yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="size-12 rounded-xl object-cover border border-stone-200 dark:border-stone-800 bg-stone-100 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm">{p.name}</h4>
                          <p className="text-[11px] text-stone-500 line-clamp-1 max-w-xs">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-xs sm:text-sm">
                      {editingPriceId === p.id ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-stone-400">Rp</span>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-24 h-8 px-2 text-xs border border-amber-500 rounded bg-stone-50 dark:bg-stone-800"
                            autoFocus
                          />
                          <button
                            onClick={() => handleQuickPriceSave(p)}
                            className="p-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                          >
                            <Check className="size-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingPriceId(p.id);
                            setTempPrice(p.price.toString());
                          }}
                          className="cursor-pointer hover:text-amber-600 transition-colors title='Klik untuk ubah harga cepat'"
                        >
                          Rp {p.price.toLocaleString('id-ID')} ✎
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          p.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors"
                          title="Edit produk"
                        >
                          <Edit className="size-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={isDeleting === p.id}
                          className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus produk"
                        >
                          {isDeleting === p.id ? (
                            <RefreshCw className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
