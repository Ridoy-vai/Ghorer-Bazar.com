"use client";
import React, { useEffect, useState } from "react";

/* Point this at your API's base URL */
const API_BASE = "http://localhost:5000/products";

type Product = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Product[];
};

function useProducts(query: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}?${query}`)
      .then((res) => res.json())
      .then((json: ApiResponse) => {
        if (cancelled) return;
        if (!json.success) {
          setError(json.message || "কিছু একটা সমস্যা হয়েছে");
          return;
        }
        setProducts(json.data);
      })
      .catch(() => {
        if (!cancelled) setError("পণ্য লোড করা যায়নি");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { products, loading, error };
}

function ProductCard({ product }: { product: Product }) {
  const [imgFailed, setImgFailed] = useState(false);
  const outOfStock = product.stock <= 0;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col border border-stone-200 bg-stone-50 dark:border-emerald-800 dark:bg-emerald-900">
      <div className="relative aspect-square flex items-center justify-center bg-stone-100 dark:bg-emerald-950">
        {product.imageUrl && !imgFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-5xl">🛒</span>
        )}

        {product.category && (
          <span className="absolute top-2 left-2 text-xs font-bold rounded-full px-2.5 py-1 bg-amber-500 text-emerald-950">
            {product.category}
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold bg-black/55 text-white">
            স্টক নেই
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-base leading-snug text-emerald-950 dark:text-stone-50">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs leading-snug line-clamp-2 text-stone-500 dark:text-stone-400">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="font-bold text-lg text-amber-600 dark:text-amber-400">
            ৳{product.price.toLocaleString("bn-BD")}
            <span className="text-xs font-normal ml-1 text-stone-400 dark:text-stone-500">
              /{product.unit}
            </span>
          </div>
          <button
            disabled={outOfStock}
            className="text-sm font-bold rounded-lg px-3 py-1.5 disabled:opacity-40 bg-orange-600 text-white dark:bg-orange-500"
          >
            কার্টে দিন
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * সবচেয়ে বেশি বিক্রি হওয়া পণ্য — sort=topSelling
 * dark/light দুই থিমেই কাজ করে, নির্ভর করে <html> ট্যাগে `dark` ক্লাস আছে কিনা তার উপর
 * (Tailwind darkMode: 'class' ধরে নেওয়া হয়েছে)
 */
export default function TopSellingSection() {
  const { products, loading, error } = useProducts("sort=topSelling&limit=8");

  return (
    <section className="w-full py-10 px-6 md:px-12 bg-stone-50 dark:bg-emerald-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-emerald-950 dark:text-stone-50">
              সবচেয়ে বেশি বিক্রি হওয়া
            </h2>
            <p className="text-sm mt-1 text-stone-500 dark:text-stone-400">
              ক্রেতাদের প্রথম পছন্দ
            </p>
          </div>
          <a href="#" className="text-sm font-semibold text-amber-600 dark:text-amber-400">
            সব দেখুন →
          </a>
        </div>

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl animate-pulse bg-stone-200 dark:bg-emerald-950"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-orange-600 dark:text-orange-400">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-stone-500 dark:text-stone-400">কোনো পণ্য পাওয়া যায়নি</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}