"use client";
// components/SidebarClient.tsx

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

const NAV = [
  {
    group: "Principal",
    items: [
      { href: "/dashboard", icon: "📊", label: "Dashboard" },
      { href: "/cotacoes", icon: "📋", label: "Cotações" },
      { href: "/bi", icon: "🧠", label: "Inteligência" },
    ],
  },
  {
    group: "Operação",
    items: [
      { href: "/frota", icon: "🏗️", label: "Frota" },
      { href: "/agenda", icon: "📅", label: "Agenda" },
      { href: "/os", icon: "📝", label: "Ordens de Serviço" },
      { href: "/contratos", icon: "📃", label: "Contratos" },
      { href: "/manutencao", icon: "🔧", label: "Manutenção" },
    ],
  },
  {
    group: "Financeiro",
    items: [
      { href: "/faturas", icon: "💰", label: "Faturas" },
      { href: "/financeiro", icon: "🏦", label: "Cobranças e PIX" },
      { href: "/fiscal", icon: "🧾", label: "Notas Fiscais" },
    ],
  },
  {
    group: "Gestão",
    items: [
      { href: "/configuracoes", icon: "⚙️", label: "Configurações" },
    ],
  },
];

export default function SidebarClient({ session }: { session: Session }) {
  const pathname = usePathname();
  const user = session.user;
  const isPro = user.plan !== "free";
  const initial =
    user.name?.[0]?.toUpperCase() ??
    user.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        GrúaOS
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            background: "var(--brand, #111)",
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            marginLeft: "6px",
            verticalAlign: "middle",
          }}
        >
          v2
        </span>
      </div>

      {/* Nav agrupada */}
      <nav className="sidebar-nav">
        {NAV.map((group) => (
          <div key={group.group} style={{ marginBottom: "8px" }}>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#9ca3af",
                padding: "8px 16px 4px",
              }}
            >
              {group.group}
            </div>

            {group.items.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user.name ?? user.email}
            </div>
            <div className={`sidebar-user-plan ${isPro ? "pro" : ""}`}>
              {user.plan === "free"
                ? "Plano Free"
                : user.plan === "pro"
                ? "⚡ Pro"
                : "🚀 Enterprise"}
            </div>
          </div>
          <button
            className="btn-logout"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Sair"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );
}
