import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroWave AI Radio | 24/7 AI-Generated Music Stream",
  description: "Global AI-generated music radio & jukebox featuring English, Bengali, and Hindi AI beats.",
  keywords: ["AI Music", "Suno", "Udio", "Radio", "Lofi", "Synthwave", "Bengali AI Music", "Hindi AI Music"],
  authors: [{ name: "NeuroWave" }],
  openGraph: {
    title: "NeuroWave AI Radio",
    description: "Broadcast your AI-generated music to the world.",
    type: "music.radio_station",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent-cyan/30 selection:text-accent-cyan">
        {children}
      </body>
    </html>
  );
}

