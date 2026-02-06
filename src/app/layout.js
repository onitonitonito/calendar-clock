import { Providers } from "@/components/common/Providers";
import "./globals.css";

export const metadata = {
  title: "WebDeskClock",
  description: "Premium Web-based Desk Clock & Schedule Manager",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
