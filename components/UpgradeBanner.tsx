"use client";
// components/UpgradeBanner.tsx

import Link from "next/link";

export default function UpgradeBanner({
  cotacoesMes,
  limite,
}: {
  cotacoesMes: number;
  limite: number;
}) {
  const pct = Math.min(Math.round((cotacoesMes / limite) * 100), 100);
  const atingiu = cotacoesMes >= limite;
  const quase = pct >= 80;

  if (!quase && !atingiu) return null;

  return (
    <div className="upgrade-banner">
      <div className="upgrade-banner-text">
        <strong>
          {atingiu
            ? "🚫 Limite atingido — cotações bloqueadas"
            : `⚠️ Você usou ${cotacoesMes} de ${limite} cotações este mês`}
        </strong>
        <span>
          {atingiu
            ? "Faça upgrade para o plano Pro e crie cotações ilimitadas."
            : `Restam apenas ${limite - cotacoesMes} cotações no plano Free.`}
        </span>
      </div>
      <Link href="/checkout?plan=pro" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
        ⚡ Upgrade para Pro — R$ 97/mês
      </Link>
    </div>
  );
}
