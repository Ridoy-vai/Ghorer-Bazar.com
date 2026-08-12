"use client";

import { useState } from "react";
import { productApi, ApiRequestError } from "@/lib/api";
import {
  ImagePlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  Carrot,
  Wheat,
  Apple,
  Fish,
  Milk,
  Beef,
  Cookie,
  Droplet,
} from "lucide-react";

const CATEGORIES = [
  { value: "vegetables", label: "সবজি", icon: Carrot },
  { value: "grocery", label: "মুদি পণ্য", icon: Wheat },
  { value: "fruits", label: "ফল", icon: Apple },
  { value: "fish", label: "মাছ", icon: Fish },
  { value: "meat", label: "মাংস", icon: Beef },
  { value: "dairy", label: "দুধ ও ডিম", icon: Milk },
  { value: "oil", label: "তেল ও ঘি", icon: Droplet },
  { value: "snacks", label: "স্ন্যাকস", icon: Cookie },
];

const UNITS = [
  { value: "kg", label: "কেজি (kg)" },
  { value: "gram", label: "গ্রাম (g)" },
  { value: "litre", label: "লিটার (litre)" },
  { value: "ml", label: "মিলিলিটার (ml)" },
  { value: "piece", label: "পিস (pcs)" },
  { value: "dozen", label: "ডজন (dozen)" },
  { value: "packet", label: "প্যাকেট (packet)" },
  { value: "bundle", label: "আঁটি (bundle)" },
];

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("vegetables");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("0");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await productApi.create({
        name,
        category,
        description,
        price: Number(price),
        unit,
        stock: Number(stock),
        imageUrl,
      });
      setSuccess(true);
      setName("");
      setDescription("");
      setPrice("");
      setStock("0");
      setImageUrl("");
      setImgError(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  const selectedUnitLabel = UNITS.find((u) => u.value === unit)?.label ?? unit;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Package size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">নতুন পণ্য যোগ করুন</h1>
            <p className="text-sm text-slate-500">যেকোনো ধরনের পণ্য — কেজি, লিটার, পিস যেভাবেই হোক</p>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            পণ্য সফলভাবে যোগ হয়েছে
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5">
            <div>
              <label className={labelClass}>পণ্যের নাম</label>
              <input
                type="text"
                required
                placeholder="যেমন: দেশি আলু"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Category selector */}
            <div>
              <label className={labelClass}>ক্যাটাগরি</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs transition ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={18} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={labelClass}>বিবরণ</label>
              <textarea
                rows={4}
                placeholder="পণ্যের বিস্তারিত বিবরণ লিখুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Price + Unit + Stock */}
            <div>
              <label className={labelClass}>মূল্য ও একক</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    placeholder="০"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`${inputClass} pl-7`}
                  />
                </div>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-40 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
              {price && (
                <p className="mt-1.5 text-xs text-slate-500">
                  প্রতি {selectedUnitLabel} মূল্য ৳{price}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>স্টক পরিমাণ ({selectedUnitLabel})</label>
              <input
                type="number"
                required
                min={0}
                step="0.01"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>ছবির URL</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImgError(false);
                }}
                className={inputClass}
              />

              {/* Image preview */}
              <div className="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                {imageUrl && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="প্রিভিউ"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <ImagePlus size={26} />
                    <span className="text-xs">
                      {imgError ? "ছবিটি লোড করা যায়নি" : "ছবির প্রিভিউ এখানে দেখাবে"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              "পণ্য সংরক্ষণ করুন"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}