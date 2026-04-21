// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GrúaOS — ERP para Locadoras de Guindastes",
  description:
    "Sistema completo de gestão para locadoras de guindastes e equipamentos pesados. Frota, agendamento, OS, manutenção e faturamento em um só lugar.",
  keywords: [
    "gestão de guindastes",
    "locadora de guindastes",
    "ERP guindastes",
    "ordem de serviço guindaste",
    "software locação equipamentos pesados",
    "gestão de frota guindastes",
  ],
  openGraph: {
    title: "GrúaOS — ERP para Locadoras de Guindastes",
    description:
      "Gerencie sua frota, agendamentos, OS e faturamento em um sistema simples e rápido. Feito para locadoras de guindastes.",
    url: "https://gruaos.vercel.app",
    siteName: "GrúaOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GrúaOS — ERP para Locadoras de Guindastes",
    description:
      "Gerencie sua frota, agendamentos, OS e faturamento em um sistema simples e rápido.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
