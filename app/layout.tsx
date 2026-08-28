import type { Metadata } from "next";
import { DARK_CANVAS, THEME_KEY } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeFinder - Premium Market Analytics",
  description: "Institutional-grade market intelligence and trading analytics platform for serious traders",
  openGraph: {
    title: "TradeFinder - Premium Market Analytics",
    description: "Find the signal. Ignore the noise.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chivo:wght@300;400;600&family=Jersey+15&display=swap"
          rel="stylesheet"
        />
        {/* Runs before first paint so a dark-mode visitor never sees a light
            flash. It cannot read a CSS custom property (the stylesheet has not
            applied yet), so the canvas colour is interpolated from the one
            constant that also feeds ThemeToggle. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_KEY)});` +
              `var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');` +
              `document.documentElement.dataset.theme=t;` +
              `if(t==='dark'){document.documentElement.style.background=${JSON.stringify(DARK_CANVAS)}}` +
              `}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
