import React from "react";

const COLORS = {
  greenDeep: "#163527",
  greenMid: "#234a35",
  turmeric: "#E7A72C",
  tomato: "#D6502B",
  paper: "#F6EFDE",
  jute: "#8C6239",
  chalk: "#EFE6D0",
};

const RATES = [
  { name: "পটল", price: "৪০৳/কেজি" },
  { name: "রুই মাছ", price: "৩২০৳/কেজি" },
  { name: "দেশি মুরগি", price: "৩৮০৳/কেজি" },
  { name: "আলু", price: "২৫৳/কেজি" },
  { name: "পেঁয়াজ", price: "৬৫৳/কেজি" },
  { name: "ইলিশ মাছ", price: "৯০০৳/কেজি" },
];

const PRODUCE = [
  { emoji: "🥬", bg: "#e9f3df" },
  { emoji: "🍅", bg: "#fdece0" },
  { emoji: "🥕", bg: "#fdf3d6" },
  { emoji: "🐟", bg: "#e4f0ef" },
  { emoji: "🥭", bg: "#f6e4e4" },
  { emoji: "🍆", bg: "#eae5f4" },
];

export default function GhorerBazarHero() {
  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${COLORS.greenDeep} 0%, ${COLORS.greenMid} 100%)`,
        fontFamily: "'Hind Siliguri', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&family=Tiro+Bangla&display=swap');

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: scrollLeft 18s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
        .display-font {
          font-family: 'Baloo Da 2', sans-serif;
        }
        .chalk-font {
          font-family: 'Tiro Bangla', serif;
        }
      `}</style>

      {/* woven awning strip */}
      <div
        className="w-full flex-shrink-0"
        style={{
          height: "14px",
          background:
            "repeating-linear-gradient(-45deg, #E7A72C 0 18px, #D6502B 18px 36px, #F6EFDE 36px 54px)",
        }}
      />

      {/* nav */}
      <nav className="flex items-center justify-between flex-wrap gap-4 px-6 md:px-12 pt-6">
        <div>
          <div className="display-font font-extrabold text-2xl tracking-wide" style={{ color: COLORS.paper }}>
            ঘরের <span style={{ color: COLORS.turmeric }}>বাজার</span>
          </div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "rgba(246,239,222,0.55)" }}>
            তাজা বাজার, দরজায় পৌঁছে
          </div>
        </div>

        <div className="flex items-center gap-7">
          <a href="#" className="hidden md:inline text-base font-medium" style={{ color: "rgba(246,239,222,0.8)" }}>
            সবজি ও ফল
          </a>
          <a href="#" className="hidden md:inline text-base font-medium" style={{ color: "rgba(246,239,222,0.8)" }}>
            মাছ ও মাংস
          </a>
          <a href="#" className="hidden md:inline text-base font-medium" style={{ color: "rgba(246,239,222,0.8)" }}>
            মুদি বাজার
          </a>
          <a
            href="#"
            className="rounded-full px-6 py-2.5 font-bold text-base"
            style={{
              background: COLORS.turmeric,
              color: COLORS.greenDeep,
              boxShadow: "0 6px 18px rgba(231,167,44,0.25)",
            }}
          >
            অর্ডার করুন
          </a>
        </div>
      </nav>

      {/* content */}
      <div className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 px-6 md:px-12 py-10">
        {/* copy column */}
        <div className="order-2 md:order-1">
          <div
            className="inline-flex items-center gap-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: "rgba(231,167,44,0.12)",
              border: "1px solid rgba(231,167,44,0.35)",
              color: COLORS.turmeric,
              padding: "7px 16px 7px 12px",
            }}
          >
            <span
              className="rounded-full flex-shrink-0"
              style={{
                width: "7px",
                height: "7px",
                background: COLORS.tomato,
                boxShadow: "0 0 0 3px rgba(214,80,43,0.25)",
              }}
            />
            ভোর ৫টায় বাজার থেকে সরাসরি
          </div>

          <h1
            className="display-font font-bold leading-tight"
            style={{ color: COLORS.paper, fontSize: "clamp(2.2rem, 4.3vw, 3.6rem)" }}
          >
            আপনার বাজারের <span style={{ color: COLORS.turmeric }}>থলিটা</span>
            <br />
            আজ আমরাই বইব
          </h1>

          <p
            className="mt-6 text-lg leading-relaxed max-w-md"
            style={{ color: "rgba(246,239,222,0.78)" }}
          >
            কারওয়ান বাজার আর কাঁচাবাজার ঘুরে সময় নষ্ট নয় — তাজা সবজি, মাছ, মাংস আর নিত্যপ্রয়োজনীয় জিনিস বাছাই করে পৌঁছে যাবে আপনার দরজায়, ঠিক যেমনটা নিজে হাতে বেছে আনতেন।
          </p>

          <div className="mt-9 flex items-center gap-5 flex-wrap">
            <button
              className="rounded-xl px-8 py-4 font-bold text-base"
              style={{
                background: COLORS.tomato,
                color: COLORS.paper,
                boxShadow: "0 10px 26px rgba(214,80,43,0.32)",
              }}
            >
              আজকের বাজার দেখুন →
            </button>
            <button
              className="font-semibold text-base py-2"
              style={{
                color: COLORS.paper,
                borderBottom: "2px solid rgba(246,239,222,0.35)",
              }}
            >
              কীভাবে কাজ করে?
            </button>
          </div>

          <div className="mt-11 flex gap-8 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "rgba(246,239,222,0.07)", border: "1px solid rgba(246,239,222,0.14)" }}
              >
                ⏱
              </div>
              <div className="text-sm leading-tight" style={{ color: "rgba(246,239,222,0.68)" }}>
                <b className="block text-sm font-bold" style={{ color: COLORS.paper }}>
                  ২ ঘণ্টায়
                </b>
                ডেলিভারি
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "rgba(246,239,222,0.07)", border: "1px solid rgba(246,239,222,0.14)" }}
              >
                🌿
              </div>
              <div className="text-sm leading-tight" style={{ color: "rgba(246,239,222,0.68)" }}>
                <b className="block text-sm font-bold" style={{ color: COLORS.paper }}>
                  ১০০% তাজা
                </b>
                না হলে ফেরত
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "rgba(246,239,222,0.07)", border: "1px solid rgba(246,239,222,0.14)" }}
              >
                ৳
              </div>
              <div className="text-sm leading-tight" style={{ color: "rgba(246,239,222,0.68)" }}>
                <b className="block text-sm font-bold" style={{ color: COLORS.paper }}>
                  ক্যাশ অন
                </b>
                ডেলিভারি
              </div>
            </div>
          </div>
        </div>

        {/* visual column */}
        <div className="order-1 md:order-2 flex flex-col items-center gap-6">
          <div className="relative w-full max-w-md">
            <div
              className="absolute rounded-full"
              style={{
                inset: "-30px",
                background: "radial-gradient(circle, rgba(231,167,44,0.18), transparent 65%)",
                filter: "blur(10px)",
                zIndex: 0,
              }}
            />
            <div
              className="absolute display-font font-bold text-sm rounded-lg z-20"
              style={{
                top: "-14px",
                left: "24px",
                background: COLORS.turmeric,
                color: COLORS.greenDeep,
                padding: "6px 14px",
                transform: "rotate(-3deg)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
              }}
            >
              আজ সকালের তোলা
            </div>
            <div
              className="relative z-10 rounded-2xl p-6"
              style={{
                background: `linear-gradient(160deg, #a97a45, ${COLORS.jute})`,
                boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
              }}
            >
              <div className="grid grid-cols-3 gap-3.5">
                {PRODUCE.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-xl flex items-center justify-center text-4xl aspect-square"
                    style={{
                      background: p.bg,
                      boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.18)",
                    }}
                  >
                    {p.emoji}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* chalkboard rate ticker - signature element */}
          <div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "#1c2b22",
              border: "2px solid rgba(246,239,222,0.12)",
              padding: "16px 0",
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.35)",
            }}
          >
            <div
              className="absolute display-font font-bold text-xs rounded-md"
              style={{
                top: "-11px",
                left: "18px",
                background: COLORS.chalk,
                color: COLORS.greenDeep,
                padding: "4px 12px",
              }}
            >
              আজকের বাজার দর
            </div>
            <div className="ticker-track chalk-font flex gap-9 whitespace-nowrap pt-3.5">
              {[...RATES, ...RATES].map((r, i) => (
                <span key={i} className="text-base" style={{ color: COLORS.chalk, opacity: 0.92 }}>
                  {r.name}{" "}
                  <b className="font-bold" style={{ color: COLORS.turmeric, marginLeft: "4px" }}>
                    {r.price}
                  </b>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}