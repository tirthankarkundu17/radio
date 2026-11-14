import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "#08090d" },
  ],
};

export const metadata: Metadata = {
  title: "NeuroWave AI Radio | 24/7 Music Stream",
  description: "Global AI-generated music radio & jukebox featuring English, Bengali, and Hindi beats.",
  keywords: ["AI Music", "Radio", "Lofi", "Synthwave", "Bengali AI Music", "Hindi AI Music"],
  authors: [{ name: "NeuroWave" }],
  openGraph: {
    title: "NeuroWave AI Radio",
    description: "Broadcast your music to the world.",
    type: "music.radio_station",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('neurowave-theme') || 'system';
                const isDark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent-cyan/30 selection:text-accent-cyan transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
