"use client";

/**
 * src/app/login/page.tsx
 * Calls POST /users/login on your Express/Prisma backend.
 * On success, stores the token in localStorage and redirects home.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthShell from "@/Components/Authshell";
import { session, userApi, ApiRequestError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await userApi.login({ email, password });
      session.save(result.token, result.user);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "লগইন করা যায়নি, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="আবার স্বাগতম"
      subtitle="আপনার অ্যাকাউন্টে লগইন করুন"
      footer={
        <>
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/register" className="font-semibold text-[#1B4332] hover:underline dark:text-[#F4A300]">
            রেজিস্ট্রেশন করুন
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-[#8B2E2E]/20 bg-[#8B2E2E]/[0.06] px-3.5 py-2.5 text-sm text-[#8B2E2E]">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">ইমেইল</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#1B4332] focus-within:ring-2 focus-within:ring-[#1B4332]/15 dark:border-gray-700 dark:bg-[#1F2937] dark:focus-within:border-[#F4A300]">
            <Mail size={17} className="shrink-0 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent px-1 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">পাসওয়ার্ড</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#1B4332] focus-within:ring-2 focus-within:ring-[#1B4332]/15 dark:border-gray-700 dark:bg-[#1F2937] dark:focus-within:border-[#F4A300]">
            <Lock size={17} className="shrink-0 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent px-1 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-gray-400 dark:text-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B4332] py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60 dark:bg-[#F4A300] dark:text-[#1B4332]"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </button>
      </form>
    </AuthShell>
  );
}