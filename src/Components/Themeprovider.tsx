"use client";

/**
 * src/Components/Themeprovider.tsx
 * Wraps next-themes so dark/light mode works with Tailwind's `dark:` classes
 * and persists to localStorage automatically, with no hydration flash.
 *
 * Setup:
 *   1. npm install next-themes
 *   2. In tailwind.config.js:  darkMode: "class"
 *   3. In app/layout.tsx (or src/app/layout.tsx):
 *        import { ThemeProvider } from "@/Components/Themeprovider";
 *        <html suppressHydrationWarning>
 *          <body>
 *            <ThemeProvider>{children}</ThemeProvider>
 *          </body>
 *        </html>
 */

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}

// Re-export the hook so components can do: import { useTheme } from "@/Components/Themeprovider";
export { useTheme } from "next-themes";