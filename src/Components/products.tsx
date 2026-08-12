"use client";

import { useEffect, useMemo, useState } from "react";
import { productApi, Product } from "@/lib/api";
import {
  ImageOff,
  PackageSearch,
  Carrot,
  Wheat,
  Apple,
  Fish,
  Milk,
  Beef,
  Cookie,
  Droplet,
  LayoutGrid,
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "সবগুলো", icon: LayoutGrid },
  { value: "vegetables", label: "সবজি", icon: Carrot },
  { value: "grocery", label: "মুদি পণ্য", icon: Wheat },
  { value: "fruits", label: "ফল", icon: Apple },
  { value: "fish", label: "মাছ", icon: Fish },
  { value: "meat", label: "মাংস", icon: Beef },
  { value: "dairy", label: "দুধ ও ডিম", icon: Milk },
  { value: "oil", label: "তেল ও ঘি", icon: Droplet },
  { value: "snacks", label: "স্ন্যাকস", icon: Cookie },
];

const UNIT_LABELS: Record<string, string> = {
  kg: "কেজি",
  gram: "গ্রাম",
  litre: "লিটার",
  ml: "মি.লি.",
  piece: "পিস",
  dozen: "ডজন",
  packet: "প্যাকেট",
  bundle: "আঁটি",
};

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="h-40 bg-slate-100" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    productApi
      .getAll()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || (p as any).category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">পণ্যসমূহ</h1>
            <p className="text-sm text-slate-500">
              {loading ? "লোড হচ্ছে..." : `মোট ${filtered.length}টি পণ্য`}
            </p>
          </div>
          <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Category filter chips */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition ${
                  active
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <PackageSearch size={32} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-600">কোনো পণ্য পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">
              অন্য ক্যাটাগরি বেছে নিন অথবা ভিন্ন নাম দিয়ে খুঁজুন
            </p>
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((product) => {
              const unit = (product as any).unit as string | undefined;
              const stockLow = product.stock > 0 && product.stock <= 5;
              const outOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="relative h-40 bg-slate-50">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-300">
                        <ImageOff size={22} />
                        <span className="text-xs text-slate-400">ছবি নেই</span>
                      </div>
                    )}

                    {outOfStock && (
                      <span className="absolute left-2 top-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                        স্টক নেই
                      </span>
                    )}
                    {!outOfStock && stockLow && (
                      <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                        স্টক কম
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="truncate text-sm font-medium text-slate-900">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        ৳{product.price}
                        {unit && (
                          <span className="ml-1 text-xs font-normal text-slate-400">
                            /{UNIT_LABELS[unit] ?? unit}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        স্টক: {product.stock}
                        {unit ? ` ${UNIT_LABELS[unit] ?? unit}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}