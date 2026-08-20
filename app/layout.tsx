import type { Metadata } from "next";
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('pk-theme');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;if(t==='dark'){document.documentElement.style.background='#171a1c'}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
