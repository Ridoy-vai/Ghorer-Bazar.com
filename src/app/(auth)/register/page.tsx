"use client";

/**
 * src/app/register/page.tsx
 * Calls POST /users/register on your Express/Prisma backend.
 * On success, redirects to /login so the user signs in with their new account.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Image as ImageIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import Authshell from "@/Components/Authshell";
import { userApi, ApiRequestError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটো মিলছে না");
      return;
    }

    setLoading(true);
    try {
      await userApi.register({ name, email, password, avatar: avatar || undefined });
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "রেজিস্ট্রেশন করা যায়নি, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authshell
      title="অ্যাকাউন্ট তৈরি করুন"
      subtitle="নতুন অ্যাকাউন্ট খুলে শুরু করুন"
      footer={
        <>
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link href="/login" className="font-semibold text-[#1B4332] hover:underline dark:text-[#F4A300]">
            লগইন করুন
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
          <label className="mb-1 block text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">নাম</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#1B4332] focus-within:ring-2 focus-within:ring-[#1B4332]/15 dark:border-gray-700 dark:bg-[#1F2937] dark:focus-within:border-[#F4A300]">
            <User size={17} className="shrink-0 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              className="w-full bg-transparent px-1 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">পাসওয়ার্ড</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#1B4332] focus-within:ring-2 focus-within:ring-[#1B4332]/15 dark:border-gray-700 dark:bg-[#1F2937] dark:focus-within:border-[#F4A300]">
              <Lock size={16} className="shrink-0 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
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
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">পাসওয়ার্ড নিশ্চিত</label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#1B4332] focus-within:ring-2 focus-within:ring-[#1B4332]/15 dark:border-gray-700 dark:bg-[#1F2937] dark:focus-within:border-[#F4A300]">
              <Lock size={16} className="shrink-0 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent px-1 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-gray-400 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[#1F2937] dark:text-[#E5E7EB]">প্রোফাইল ছবি URL (ঐচ্ছিক)</label>
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#1B4332] focus-within:ring-2 focus-within:ring-[#1B4332]/15 dark:border-gray-700 dark:bg-[#1F2937] dark:focus-within:border-[#F4A300]">
            <ImageIcon size={17} className="shrink-0 text-gray-400" />
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-transparent px-1 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-gray-400 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B4332] py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110 disabled:opacity-60 dark:bg-[#F4A300] dark:text-[#1B4332]"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>
    </Authshell>
  );
}