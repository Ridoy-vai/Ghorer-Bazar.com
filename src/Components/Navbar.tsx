"use client";

/**
 * src/Components/Navbar.tsx
 * ---------------------------------------------------------------------
 * Responsive e-commerce navbar (grocery / daily-essentials style, à la
 * ghorerbazar.com) for Next.js App Router + Tailwind CSS.
 * Includes: Light/Dark theme toggle + 4-language switcher (bn/en/es/hi)
 * and a live search dropdown backed by productApi.getAll.
 *
 * Setup:
 *  1. npm install lucide-react next-themes
 *  2. tailwind.config.js -> darkMode: "class"
 *  3. In src/app/layout.tsx, wrap the app:
 *       import { ThemeProvider } from "@/Components/Themeprovider";
 *       import { LanguageProvider } from "@/Components/Languagecontext";
 *       import Navbar from "@/Components/Navbar";
 *       <html suppressHydrationWarning>
 *         <body>
 *           <ThemeProvider>
 *             <LanguageProvider>
 *               <Navbar cartCount={3} wishlistCount={2} isLoggedIn={false} />
 *               {children}
 *             </LanguageProvider>
 *           </ThemeProvider>
 *         </body>
 *       </html>
 *
 * Wire it up to your backend:
 *  - Search dropdown -> GET /products?search=<query>&limit=6 (via productApi.getAll)
 *  - Search submit    -> full results page /products?search=<query>
 *  - Category click   -> GET  /api/categories
 *  - Cart badge       -> from your cart context / GET /api/orders (draft)
 *  - Account link      -> GET  /api/auth/me
 * ---------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Phone,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Leaf,
  Sun,
  Moon,
  Globe,
  ImageOff,
  Loader2,
  PackageSearch,
} from "lucide-react";
import { useTheme } from "./Themeprovider";
import { useLanguage } from "./Languagecontext";
import { LOCALES } from "./translations";
import { productApi, Product } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  isLoggedIn?: boolean;
  deliveryArea?: string;
  hotline?: string;
  categories?: Category[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "তাজা সবজি", slug: "vegetables" },
  { id: "2", name: "ফলমূল", slug: "fruits" },
  { id: "3", name: "মাছ ও মাংস", slug: "meat-fish" },
  { id: "4", name: "নিত্যপ্রয়োজনীয়", slug: "grocery" },
  { id: "5", name: "দুগ্ধজাত পণ্য", slug: "dairy" },
  { id: "6", name: "স্ন্যাকস ও পানীয়", slug: "snacks-drinks" },
];

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Search input with a live results dropdown underneath it.
 * Used for both the desktop (inline) and mobile (below navbar) search bars —
 * each renders its own instance so their open/closed state doesn't collide.
 */
function SearchWithDropdown({
  variant,
  placeholder,
  onNavigate,
}: {
  variant: "desktop" | "mobile";
  placeholder: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    productApi
      .getAll({ search: trimmed, limit: "6", sort: "newest" })
      .then((res) => {
        if (cancelled) return;
        setResults(res.data ?? []);
        setOpen(true);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close the dropdown on outside click / Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const goToResultsPage = (q: string) => {
    setOpen(false);
    router.push(`/products?search=${encodeURIComponent(q)}`);
    onNavigate?.();
  };

  const goToProduct = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/products/${id}`);
    onNavigate?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    goToResultsPage(query.trim());
  };

  const wrapperClass =
    variant === "desktop"
      ? "relative mx-auto hidden max-w-xl flex-1 md:block"
      : "relative px-4 pb-3 md:hidden";

  return (
    <div ref={containerRef} className={wrapperClass}>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full items-center overflow-hidden rounded-md bg-white dark:bg-[#1F2937]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setOpen(true);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent px-4 py-2 text-sm text-[#1F2937] dark:text-[#E5E7EB] outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            className="flex h-full items-center bg-[#F4A300] px-4 py-2.5 text-[#1B4332] hover:bg-[#e39900] transition-colors"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Live results dropdown */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-[#DCEEE3] dark:border-[#374151] bg-white dark:bg-[#1F2937] shadow-xl">
          {loading && (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              খোঁজা হচ্ছে...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center gap-1.5 px-4 py-6 text-center">
              <PackageSearch size={22} className="text-gray-300" />
              <p className="text-sm text-gray-500 dark:text-gray-400">কোনো পণ্য পাওয়া যায়নি</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.map((product) => (
                  <li key={product.id}>
                    <button
                      onClick={() => goToProduct(product.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#FAF9F5] dark:hover:bg-[#111827] transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-[#111827]">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff size={16} className="text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-[#1F2937] dark:text-[#E5E7EB]">
                          {product.name}
                        </p>
                        <p className="text-xs font-medium text-[#1B4332] dark:text-[#F4A300]">
                          ৳{product.price}
                          {product.unit && (
                            <span className="ml-1 font-normal text-gray-400">/{product.unit}</span>
                          )}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goToResultsPage(query.trim())}
                className="block w-full border-t border-[#F0EFEA] dark:border-[#374151] px-4 py-2.5 text-center text-sm font-medium text-[#1B4332] dark:text-[#F4A300] hover:bg-[#FAF9F5] dark:hover:bg-[#111827] transition-colors"
              >
                &quot;{query.trim()}&quot; এর সব ফলাফল দেখুন
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  isLoggedIn = false,
  deliveryArea = "ঢাকা",
  hotline = "16XXX",
  categories = DEFAULT_CATEGORIES,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <header className="sticky top-0 z-50 font-[var(--font-inter),system-ui,sans-serif]">
      {/* Utility strip */}
      <div className="hidden md:block bg-[#123028] dark:bg-[#0A1712] text-[#DCEEE3] text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#F4A300]" />
            <span>
              {t("deliveryArea")}: <span className="font-medium text-white">{deliveryArea}</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href={`tel:${hotline}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone size={13} className="text-[#F4A300]" />
              {t("hotline")}: {hotline}
            </a>
            <Link href="/track-order" className="hover:text-white transition-colors">
              {t("trackOrder")}
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div
        className={`bg-[#1B4332] dark:bg-[#0F241C] transition-shadow ${
          scrolled ? "shadow-lg shadow-black/10" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-1.5">
            <Leaf size={26} className="text-[#F4A300]" strokeWidth={2.5} />
            <span className="font-[var(--font-baloo),cursive] text-xl font-bold text-white md:text-2xl">
              ঘরের বাজার
            </span>
          </Link>

          {/* Category dropdown trigger (desktop) */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md bg-[#F4A300] px-3 py-2 text-sm font-semibold text-[#1B4332] hover:bg-[#e39900] transition-colors">
              <Menu size={16} />
              {t("categories")}
              <ChevronDown size={15} className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </button>

            {categoryOpen && (
              <div className="absolute left-0 top-full w-64 overflow-hidden rounded-lg border border-[#DCEEE3] dark:border-[#374151] bg-white dark:bg-[#1F2937] shadow-xl">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#FAF9F5] dark:hover:bg-[#111827] hover:text-[#1B4332] dark:hover:text-[#F4A300] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search bar (desktop) with live dropdown */}
          <SearchWithDropdown variant="desktop" placeholder={t("searchPlaceholder")} />

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-3 text-white md:ml-0 md:gap-4">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:text-[#F4A300] transition-colors"
              aria-label={theme === "dark" ? t("lightMode") : t("darkMode")}
              title={theme === "dark" ? t("lightMode") : t("darkMode")}
            >
              {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language switcher */}
            <div className="relative" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
              <button
                className="flex items-center gap-1 hover:text-[#F4A300] transition-colors"
                aria-label={t("language")}
                title={t("language")}
              >
                <Globe size={20} />
                <span className="hidden text-xs font-medium lg:inline">{currentLocale.flag}</span>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full w-40 overflow-hidden rounded-lg border border-[#DCEEE3] dark:border-[#374151] bg-white dark:bg-[#1F2937] shadow-xl">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLocale(l.code);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        l.code === locale
                          ? "bg-[#FAF9F5] dark:bg-[#111827] text-[#1B4332] dark:text-[#F4A300] font-semibold"
                          : "text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#FAF9F5] dark:hover:bg-[#111827]"
                      }`}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link href="/wishlist" className="relative hidden sm:block hover:text-[#F4A300] transition-colors">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative hover:text-[#F4A300] transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#8B2E2E] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="hidden items-center gap-1.5 rounded-md border border-white/30 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors sm:flex"
            >
              <User size={17} />
              {isLoggedIn ? t("myAccount") : t("login")}
            </Link>
          </div>
        </div>

        {/* Search bar (mobile) with live dropdown */}
        <SearchWithDropdown variant="mobile" placeholder={t("searchPlaceholder")} />
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="border-t border-[#DCEEE3] dark:border-[#374151] bg-white dark:bg-[#111827] md:hidden">
          <div className="flex items-center justify-between px-4 py-2 text-xs text-[#1B4332] dark:text-[#E5E7EB]">
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-[#8B2E2E]" /> {deliveryArea}
            </span>
            <a href={`tel:${hotline}`} className="flex items-center gap-1">
              <Phone size={13} className="text-[#8B2E2E]" /> {hotline}
            </a>
          </div>

          {/* Theme + language row */}
          <div className="flex items-center justify-between border-b border-[#F0EFEA] dark:border-[#374151] px-4 py-2.5">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 text-sm text-[#1F2937] dark:text-[#E5E7EB]"
            >
              {mounted && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {mounted && theme === "dark" ? t("lightMode") : t("darkMode")}
            </button>
            <div className="flex gap-1.5">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={`rounded px-1.5 py-0.5 text-sm ${
                    l.code === locale ? "bg-[#F4A300]/20 ring-1 ring-[#F4A300]" : ""
                  }`}
                  aria-label={l.label}
                  title={l.label}
                >
                  {l.flag}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col divide-y divide-[#F0EFEA] dark:divide-[#374151]">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="px-4 py-3 text-sm text-[#1F2937] dark:text-[#E5E7EB] hover:bg-[#FAF9F5] dark:hover:bg-[#1F2937]"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#1B4332] dark:text-[#F4A300]"
              onClick={() => setMobileOpen(false)}
            >
              <User size={16} />
              {isLoggedIn ? t("myAccount") : t("loginRegister")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}