"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { productApi } from "@/lib/api";
import {
  ImageOff,
  PackageSearch,
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightSmall,
} from "lucide-react";

const CATEGORIES = [
  { value: "vegetables", label: "সবজি" },
  { value: "grocery", label: "মুদি পণ্য" },
  { value: "fruits", label: "ফল" },
  { value: "fish", label: "মাছ" },
  { value: "meat", label: "মাংস" },
  { value: "dairy", label: "দুধ ও ডিম" },
  { value: "oil", label: "তেল ও ঘি" },
  { value: "snacks", label: "স্ন্যাকস" },
];

const UNITS = [
  { value: "kg", label: "কেজি" },
  { value: "gram", label: "গ্রাম" },
  { value: "litre", label: "লিটার" },
  { value: "ml", label: "মিলিলিটার" },
  { value: "piece", label: "পিস" },
  { value: "dozen", label: "ডজন" },
  { value: "packet", label: "প্যাকেট" },
  { value: "bundle", label: "আঁটি" },
];

const UNIT_LABELS: Record<string, string> = Object.fromEntries(
  UNITS.map((u) => [u.value, u.label])
);

const SORT_OPTIONS = [
  { value: "newest", label: "ডিফল্ট সাজানো" },
  { value: "oldest", label: "পুরনো আগে" },
  { value: "priceLowHigh", label: "মূল্য: কম থেকে বেশি" },
  { value: "priceHighLow", label: "মূল্য: বেশি থেকে কম" },
  { value: "topSelling", label: "সর্বাধিক বিক্রিত" },
  { value: "nameAZ", label: "নাম: A-Z" },
  { value: "nameZA", label: "নাম: Z-A" },
];

type ApiProduct = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  category?: string | null;
  unit?: string | null;
  soldCount?: number;
  createdAt: string;
  updatedAt: string;
};

type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ApiFacets = {
  priceRange: { min: number; max: number };
  categories: { category: string | null; count: number }[];
};

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="h-44 bg-slate-100" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-4 w-1/3 rounded bg-slate-100" />
        <div className="h-9 w-full rounded bg-slate-100" />
      </div>
    </div>
  );
}

// A collapsible white filter card, styled after the reference: uppercase title,
// short orange underline, and a +/- toggle on the right.
function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-xs font-bold tracking-wide text-slate-800">
          {title}
        </span>
        {open ? <Minus size={14} className="text-slate-400" /> : <Plus size={14} className="text-slate-400" />}
      </button>
      <div className="mt-1.5 h-0.5 w-8 bg-orange-500" />
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5 text-sm">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 text-orange-500 accent-orange-500 focus:ring-orange-400"
        />
        <span className={checked ? "font-medium text-orange-600" : "text-slate-600"}>
          {label}
        </span>
      </span>
      {count !== undefined && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1 text-[11px] text-slate-500">
          {count}
        </span>
      )}
    </label>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [facets, setFacets] = useState<ApiFacets | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // mobile sidebar toggle

  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [activeUnit, setActiveUnit] = useState(searchParams.get("unit") || "all");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [priceBounds, setPriceBounds] = useState<{ min: number; max: number } | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const boundsInitialized = useRef(false);
  const urlMinPriceRef = useRef(searchParams.get("minPrice"));
  const urlMaxPriceRef = useRef(searchParams.get("maxPrice"));

  const debouncedSearch = useDebouncedValue(search, 400);
  const debouncedMinPrice = useDebouncedValue(minPrice, 400);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);

  // Tracks the query string we ourselves last wrote via router.replace, so the
  // sync-from-URL effect below can tell "URL changed because we wrote it" apart
  // from "URL changed because the user clicked a Link elsewhere (e.g. navbar)".
  const lastWrittenQs = useRef<string | null>(null);

  // Whenever the URL's query params change from an EXTERNAL navigation (navbar
  // category link, browser back/forward, a shared link, etc.), pull those values
  // into local state. Without this, useState(searchParams.get(...)) only ever
  // reads the URL on first mount, so clicking a category link while already on
  // this page wouldn't update the filters — and our own effect would then
  // overwrite the URL back using the stale state, which is the mismatch you saw.
  useEffect(() => {
    const currentQs = searchParams.toString();
    if (currentQs === lastWrittenQs.current) return; // change came from our own write

    const urlCategory = searchParams.get("category") || "all";
    const urlUnit = searchParams.get("unit") || "all";
    const urlSearch = searchParams.get("search") || "";
    const urlSort = searchParams.get("sort") || "newest";
    const urlPage = Number(searchParams.get("page")) || 1;
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");

    if (urlCategory !== activeCategory) setActiveCategory(urlCategory);
    if (urlUnit !== activeUnit) setActiveUnit(urlUnit);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlSort !== sort) setSort(urlSort);
    if (urlPage !== page) setPage(urlPage);

    if (priceBounds) {
      const nextMin = urlMinPrice ? Number(urlMinPrice) : priceBounds.min;
      const nextMax = urlMaxPrice ? Number(urlMaxPrice) : priceBounds.max;
      if (nextMin !== minPrice) setMinPrice(nextMin);
      if (nextMax !== maxPrice) setMaxPrice(nextMax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filterKey = `${activeCategory}|${activeUnit}|${debouncedSearch}|${sort}|${debouncedMinPrice}|${debouncedMaxPrice}`;
  const prevFilterKey = useRef(filterKey);
  useEffect(() => {
    if (prevFilterKey.current !== filterKey) {
      prevFilterKey.current = filterKey;
      setPage(1);
    }
  }, [filterKey]);

  useEffect(() => {
    if (!priceBounds) return;

    const params: Record<string, string> = {
      sort,
      page: String(page),
      limit: "20",
    };
    if (activeCategory !== "all") params.category = activeCategory;
    if (activeUnit !== "all") params.unit = activeUnit;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (debouncedMinPrice > priceBounds.min) params.minPrice = String(debouncedMinPrice);
    if (debouncedMaxPrice < priceBounds.max) params.maxPrice = String(debouncedMaxPrice);

    const qs = new URLSearchParams(params).toString();
    lastWrittenQs.current = qs;
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });

    setLoading(true);
    productApi
      .getAll(params)
      .then((res: any) => {
        setProducts(res.data ?? []);
        setMeta(res.meta ?? null);
        if (res.filters) setFacets(res.filters);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeUnit, debouncedSearch, sort, debouncedMinPrice, debouncedMaxPrice, page, priceBounds]);

  useEffect(() => {
    if (boundsInitialized.current) return;
    boundsInitialized.current = true;

    productApi
      .getAll({ limit: "1" })
      .then((res: any) => {
        const range = res.filters?.priceRange ?? { min: 0, max: 1000 };
        setFacets(res.filters ?? null);
        setPriceBounds(range);
        setMinPrice(urlMinPriceRef.current ? Number(urlMinPriceRef.current) : range.min);
        setMaxPrice(urlMaxPriceRef.current ? Number(urlMaxPriceRef.current) : range.max);
      })
      .catch(() => {
        setPriceBounds({ min: 0, max: 1000 });
        setMinPrice(urlMinPriceRef.current ? Number(urlMinPriceRef.current) : 0);
        setMaxPrice(urlMaxPriceRef.current ? Number(urlMaxPriceRef.current) : 1000);
      });
  }, []);

  const categoryCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    facets?.categories.forEach((c) => {
      if (c.category) map[c.category] = c.count;
    });
    return map;
  }, [facets]);

  const pricePct = (val: number) => {
    if (!priceBounds || priceBounds.max === priceBounds.min) return 0;
    return ((val - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top title bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5">
          <h1 className="text-2xl font-bold text-slate-900">পণ্যসমূহ</h1>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <span>Home</span>
            <ChevronRightSmall size={14} />
            <span className="font-medium text-orange-600">পণ্যসমূহ</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[270px_1fr]">
          {/* ---------------- Sidebar ---------------- */}
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="space-y-5 lg:sticky lg:top-6">
              <FilterSection title="ফিল্টার বাই ক্যাটাগরি">
                <div className="flex flex-col">
                  {CATEGORIES.map((cat) => (
                    <CheckboxRow
                      key={cat.value}
                      checked={activeCategory === cat.value}
                      onChange={() =>
                        setActiveCategory((prev) => (prev === cat.value ? "all" : cat.value))
                      }
                      label={cat.label}
                      count={categoryCountMap[cat.value]}
                    />
                  ))}
                </div>
              </FilterSection>

              {priceBounds && (
                <FilterSection title="মূল্য পরিসীমা">
                  <div className="mb-4 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>৳ {minPrice}</span>
                    <span>৳ {maxPrice}</span>
                  </div>

                  <div className="relative h-6">
                    <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200" />
                    <div
                      className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-orange-500"
                      style={{
                        left: `${pricePct(minPrice)}%`,
                        right: `${100 - pricePct(maxPrice)}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))}
                      className="range-thumb pointer-events-none absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
                      style={{ zIndex: minPrice > priceBounds.max - 20 ? 5 : 3 }}
                    />
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))}
                      className="range-thumb pointer-events-none absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent"
                      style={{ zIndex: 4 }}
                    />
                  </div>

                  <style jsx>{`
                    .range-thumb {
                      pointer-events: none;
                    }
                    .range-thumb::-webkit-slider-thumb {
                      pointer-events: all;
                      -webkit-appearance: none;
                      appearance: none;
                      width: 18px;
                      height: 18px;
                      border-radius: 9999px;
                      background: #f97316;
                      border: 3px solid white;
                      cursor: pointer;
                      box-shadow: 0 0 0 1px #f97316;
                    }
                    .range-thumb::-moz-range-thumb {
                      pointer-events: all;
                      width: 18px;
                      height: 18px;
                      border-radius: 9999px;
                      background: #f97316;
                      border: 3px solid white;
                      cursor: pointer;
                      box-shadow: 0 0 0 1px #f97316;
                    }
                  `}</style>
                </FilterSection>
              )}

              <FilterSection title="ইউনিট">
                <div className="flex flex-col">
                  {UNITS.map((u) => (
                    <CheckboxRow
                      key={u.value}
                      checked={activeUnit === u.value}
                      onChange={() => setActiveUnit((prev) => (prev === u.value ? "all" : u.value))}
                      label={u.label}
                    />
                  ))}
                </div>
              </FilterSection>

              {(activeCategory !== "all" ||
                activeUnit !== "all" ||
                search.trim() !== "" ||
                (priceBounds && (minPrice > priceBounds.min || maxPrice < priceBounds.max))) && (
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveUnit("all");
                    setSearch("");
                    if (priceBounds) {
                      setMinPrice(priceBounds.min);
                      setMaxPrice(priceBounds.max);
                    }
                  }}
                  className="w-full rounded-lg border border-orange-200 bg-orange-50 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
                >
                  সব ফিল্টার রিসেট করো
                </button>
              )}
            </div>
          </aside>

          {/* ---------------- Product column ---------------- */}
          <div>
            {/* Sort By bar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">সাজান :</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {loading ? "লোড হচ্ছে..." : `মোট ${meta?.total ?? 0}টি পণ্য`}
                </span>
                <button
                  onClick={() => setShowFilters((s) => !s)}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 lg:hidden"
                >
                  ফিল্টার
                </button>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <PackageSearch size={32} className="text-slate-300" />
                <p className="text-sm font-medium text-slate-600">কোনো পণ্য পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400">
                  অন্য ক্যাটাগরি বেছে নিন অথবা ফিল্টার পরিবর্তন করুন
                </p>
              </div>
            )}

            {/* Product grid */}
            {!loading && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => {
                    const unit = product.unit;
                    const stockLow = product.stock > 0 && product.stock <= 5;
                    const outOfStock = product.stock <= 0;
                    const isTopSelling =
                      sort === "topSelling" &&
                      typeof product.soldCount === "number" &&
                      product.soldCount > 0;

                    return (
                      <div
                        key={product.id}
                        className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-orange-300 hover:shadow-md"
                      >
                        <div className="relative h-44 bg-slate-50">
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

                          {isTopSelling && (
                            <span className="absolute left-0 top-3 rounded-r-md bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                              সেরা বিক্রিত
                            </span>
                          )}
                          {outOfStock && (
                            <span className="absolute right-0 top-3 rounded-l-md bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                              স্টক নেই
                            </span>
                          )}
                          {!outOfStock && stockLow && (
                            <span className="absolute right-0 top-3 rounded-l-md bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                              স্টক কম
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="truncate text-sm font-medium text-slate-800">
                            {product.name}
                          </h3>

                          <div className="mt-2 flex items-baseline gap-1.5">
                            <span className="text-base font-bold text-orange-600">
                              ৳{product.price}
                            </span>
                            {unit && (
                              <span className="text-xs font-normal text-slate-400">
                                /{UNIT_LABELS[unit] ?? unit}
                              </span>
                            )}
                          </div>

                          <button
                            disabled={outOfStock}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-orange-500 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-transparent"
                          >
                            <ShoppingCart size={15} />
                            কার্টে যোগ করুন
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                      আগের
                    </button>
                    <span className="text-sm text-slate-500">
                      {meta.page} / {meta.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                      disabled={page >= meta.totalPages}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      পরের
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}