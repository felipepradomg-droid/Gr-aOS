"use client";
// components/SidebarClient.tsx

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

const NAV = [
  { href: "/dashboard",  icon: "📊", label: "Dashboard" },
  { href: "/cotacoes",   icon: "📋", label: "Cotações" },
  { href: "/clientes",   icon: "👥", label: "Clientes" },
  { href: "/relatorios", icon: "📈", label: "Relatórios", proOnly: true },
  { href: "/configuracoes", icon: "⚙️", label: "Configurações" },
];

export default function SidebarClient({ session }: { session: Session }) {
  const pathname = usePathname();
  const user = session.user;
  const isPro = user.plan !== "free";
  const initial = user.name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">GrúaOS</div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.proOnly && !isPro ? "/checkout?plan=pro" : item.href}
            className={`sidebar-link ${pathname.startsWith(item.href) ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
            {item.proOnly && !isPro && (
              <span style={{ marginLeft: "auto", fontSize: ".7rem", color: "var(--brand)", fontWeight: 700 }}>
                PRO
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initial}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name ?? user.email}</div>
            <div className={`sidebar-user-plan ${isPro ? "pro" : ""}`}>
              {user.plan === "free" ? "Plano Free" : user.plan === "pro" ? "⚡ Pro" : "🚀 Enterprise"}
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
