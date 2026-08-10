/**
 * src/Components/translations.ts
 * Central dictionary for UI strings across 4 supported languages.
 * Add more keys here as you build out more pages — every component
 * just calls t("key") via useLanguage().
 */

export type Locale = "bn" | "en" | "es" | "hi";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export const translations = {
  bn: {
    deliveryArea: "ডেলিভারি এলাকা",
    hotline: "হটলাইন",
    trackOrder: "অর্ডার ট্র্যাক করুন",
    categories: "ক্যাটাগরি",
    searchPlaceholder: "পণ্য খুঁজুন — যেমন: চাল, ডিম, দুধ...",
    login: "লগইন",
    myAccount: "আমার অ্যাকাউন্ট",
    loginRegister: "লগইন / রেজিস্ট্রেশন",
    wishlist: "পছন্দের তালিকা",
    cart: "কার্ট",
    lightMode: "লাইট মোড",
    darkMode: "ডার্ক মোড",
    language: "ভাষা",
  },
  en: {
    deliveryArea: "Delivery area",
    hotline: "Hotline",
    trackOrder: "Track your order",
    categories: "Categories",
    searchPlaceholder: "Search products — e.g. rice, eggs, milk...",
    login: "Login",
    myAccount: "My Account",
    loginRegister: "Login / Register",
    wishlist: "Wishlist",
    cart: "Cart",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language",
  },
  es: {
    deliveryArea: "Zona de entrega",
    hotline: "Línea directa",
    trackOrder: "Rastrear pedido",
    categories: "Categorías",
    searchPlaceholder: "Buscar productos — ej. arroz, huevos, leche...",
    login: "Iniciar sesión",
    myAccount: "Mi cuenta",
    loginRegister: "Iniciar sesión / Registrarse",
    wishlist: "Lista de deseos",
    cart: "Carrito",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    language: "Idioma",
  },
  hi: {
    deliveryArea: "डिलीवरी क्षेत्र",
    hotline: "हॉटलाइन",
    trackOrder: "ऑर्डर ट्रैक करें",
    categories: "श्रेणियाँ",
    searchPlaceholder: "उत्पाद खोजें — जैसे चावल, अंडे, दूध...",
    login: "लॉगिन",
    myAccount: "मेरा खाता",
    loginRegister: "लॉगिन / रजिस्टर करें",
    wishlist: "इच्छा सूची",
    cart: "कार्ट",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    language: "भाषा",
  },
} as const;

export type TranslationKey = keyof typeof translations["en"];