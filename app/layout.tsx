// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrúaOS — Gestão de Cotações para Gruas",
  description: "Feche cotações 3x mais rápido. Sistema de gestão de cotações para empresas de grua e içamento.",
  openGraph: {
    title: "GrúaOS — Gestão de Cotações para Gruas",
    description: "Centralize suas cotações, clientes e propostas. Menos planilha, mais obra.",
    url: "https://guraos.vercel.app",
    siteName: "GrúaOS",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
