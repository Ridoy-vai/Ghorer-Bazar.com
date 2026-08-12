"use client";

/**
 * src/Components/AuthShell.tsx
 * Shared visual shell for Login & Register — layered gradient panel with
 * floating glass chips on the left (desktop), premium card form on the right.
 * Includes the same theme toggle + language switcher as the Navbar.
 */

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, Sun, Moon, Globe, ArrowLeft, Carrot, Milk, Apple, Sparkles } from "lucide-react";
import { useTheme } from "./Themeprovider";
import { useLanguage } from "./Languagecontext";
import { LOCALES } from "./translations";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();

  useEffect(() => setMounted(true), []);

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="flex min-h-screen w-full bg-[#FAF9F5] dark:bg-[#080F0C]">
      {/* ---------------- Left branded panel ---------------- */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[#0F2A20] p-10 text-white lg:flex">
        {/* Layered gradient mesh background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(244,163,0,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(27,67,50,0.6),transparent_60%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#F4A300]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-[#2D6A4F]/40 blur-3xl" />
        {/* Subtle dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(#DCEEE3 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4A300]">
            <Leaf size={19} className="text-[#0F2A20]" strokeWidth={2.75} />
          </span>
          <span className="text-xl font-bold tracking-tight">ঘরের বাজার</span>
        </Link>

        {/* Floating glass chips */}
        <div className="relative z-10 my-8 flex-1">
          <div className="absolute left-2 top-4 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md rotate-[-4deg]">
            <Carrot size={18} className="text-[#F4A300]" />
            <span className="text-sm font-medium text-white/90">তাজা সবজি</span>
          </div>
          <div className="absolute right-4 top-24 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md rotate-[3deg]">
            <Milk size={18} className="text-[#F4A300]" />
            <span className="text-sm font-medium text-white/90">দুগ্ধজাত পণ্য</span>
          </div>
          <div className="absolute left-10 top-48 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md rotate-[2deg]">
            <Apple size={18} className="text-[#F4A300]" />
            <span className="text-sm font-medium text-white/90">সতেজ ফলমূল</span>
          </div>

          <div className="absolute left-0 top-72 max-w-xs">
            <p className="font-[var(--font-baloo),cursive] text-[2.35rem] font-bold leading-[1.15] tracking-tight">
              তাজা বাজার,
              <br />
              এক ক্লিকেই <span className="text-[#F4A300]">আপনার দরজায়</span>
            </p>
            <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-[#DCEEE3]/80">
              হাজারো পরিবার প্রতিদিন আমাদের উপর ভরসা করে — আপনিও যোগ দিন এই তাজা অভিজ্ঞতায়।
            </p>
          </div>
        </div>

        {/* Glass stat card */}
        <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4A300]/20">
            <Sparkles size={18} className="text-[#F4A300]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">৫০,০০০+ সন্তুষ্ট গ্রাহক</p>
            <p className="text-xs text-[#DCEEE3]/70">সারাদেশে ২৪ ঘণ্টার মধ্যে ডেলিভারি</p>
          </div>
        </div>

        <div className="relative z-10 mt-6 text-xs text-[#DCEEE3]/50">© {new Date().getFullYear()} ঘরের বাজার</div>
      </div>

      {/* ---------------- Right form panel ---------------- */}
      <div className="relative flex w-full flex-col lg:w-[54%]">
        {/* subtle texture on the form side too */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{ backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />

        {/* Top bar: back link + theme/lang toggles */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#1B4332] transition-colors hover:text-[#F4A300] dark:text-[#DCEEE3]"
          >
            <ArrowLeft size={16} />
            {t("backToHome")}
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#1B4332] transition-colors hover:border-[#F4A300] hover:text-[#F4A300] dark:border-white/10 dark:text-[#DCEEE3]"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <div className="relative" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
              <button className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 px-3 text-[#1B4332] transition-colors hover:border-[#F4A300] hover:text-[#F4A300] dark:border-white/10 dark:text-[#DCEEE3]">
                <Globe size={15} />
                <span className="text-xs">{currentLocale.flag}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111827]">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        l.code === locale
                          ? "bg-[#FAF9F5] font-semibold text-[#1B4332] dark:bg-white/5 dark:text-[#F4A300]"
                          : "text-[#1F2937] hover:bg-[#FAF9F5] dark:text-[#E5E7EB] dark:hover:bg-white/5"
                      }`}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332]">
                <Leaf size={16} className="text-[#F4A300]" strokeWidth={2.75} />
              </span>
              <span className="text-lg font-bold text-[#1B4332] dark:text-white">ঘরের বাজার</span>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white/90 p-8 shadow-[0_8px_40px_-12px_rgba(15,42,32,0.15)] backdrop-blur-sm dark:border-white/10 dark:bg-[#0F1E17]/80">
              <h1 className="text-[1.6rem] font-bold tracking-tight text-[#111827] dark:text-white">{title}</h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>

              <div className="mt-7">{children}</div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}