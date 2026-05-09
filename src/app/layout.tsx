import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Hexagonal Architecture - Facade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
