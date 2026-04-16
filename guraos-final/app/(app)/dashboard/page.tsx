// app/(app)/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UpgradeBanner from "@/components/UpgradeBanner";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const isPro = session!.user.plan !== "free";

  // Métricas
  const [total, enviadas, aprovadas, rejeitadas, recentes] = await Promise.all([
    prisma.cotacao.count({ where: { userId } }),
    prisma.cotacao.count({ where: { userId, status: "enviada" } }),
    prisma.cotacao.count({ where: { userId, status: "aprovada" } }),
    prisma.cotacao.count({ where: { userId, status: "rejeitada" } }),
    prisma.cotacao.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const taxaAprovacao = total > 0 ? Math.round((aprovadas / total) * 100) : 0;

  // Limite free: 10 cotações/mês
  const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0,0,0,0);
  const cotacoesMes = await prisma.cotacao.count({
    where: { userId, createdAt: { gte: inicioMes } },
  });
  const limiteFree = 10;
  const atingiuLimite = !isPro && cotacoesMes >= limiteFree;

  const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
    rascunho: { label: "Rascunho", cls: "badge-gray" },
    enviada:  { label: "Enviada",  cls: "badge-yellow" },
    aprovada: { label: "Aprovada", cls: "badge-green" },
    rejeitada:{ label: "Rejeitada",cls: "badge-red" },
  };

  return (
    <>
      <div className="app-topbar">
        <h1>Dashboard</h1>
        <Link
          href={atingiuLimite ? "/checkout?plan=pro" : "/cotacoes/nova"}
          className="btn-primary"
          style={{ fontSize: ".875rem", padding: "8px 16px" }}
        >
          + Nova cotação
        </Link>
      </div>

      <div className="app-content">
        {/* Banner upgrade */}
        {!isPro && <UpgradeBanner cotacoesMes={cotacoesMes} limite={limiteFree} />}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total de cotações</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">{cotacoesMes} este mês</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Aguardando resposta</div>
            <div className="stat-value">{enviadas}</div>
            <div className="stat-sub">cotações enviadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Taxa de aprovação</div>
            <div className="stat-value">{taxaAprovacao}%</div>
            <div className="stat-sub">{aprovadas} aprovadas · {rejeitadas} rejeitadas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Plano atual</div>
            <div className="stat-value" style={{ fontSize: "1.4rem", textTransform: "capitalize" }}>
              {session!.user.plan === "free" ? "Free" : session!.user.plan}
            </div>
            {!isPro && (
              <div className="stat-sub">
                <Link href="/checkout?plan=pro" style={{ color: "var(--brand)" }}>
                  Fazer upgrade →
                </Link>
              </div>
            )}
            {isPro && session!.user.planExpiresAt && (
              <div className="stat-sub">
                Expira em {new Date(session!.user.planExpiresAt).toLocaleDateString("pt-BR")}
              </div>
            )}
          </div>
        </div>

        {/* Cotações recentes */}
        <div className="section-header">
          <h2>Cotações recentes</h2>
          <Link href="/cotacoes" style={{ fontSize: ".875rem", color: "var(--text-2)" }}>
            Ver todas →
          </Link>
        </div>

        {recentes.length === 0 ? (
          <div
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "48px",
              textAlign: "center",
              color: "var(--text-3)",
            }}
          >
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>📋</p>
            <p style={{ marginBottom: "16px" }}>Nenhuma cotação ainda.</p>
            <Link href="/cotacoes/nova" className="btn-primary">
              Criar primeira cotação
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((c) => {
                  const s = STATUS_LABEL[c.status] ?? { label: c.status, cls: "badge-gray" };
                  return (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.clienteNome}</td>
                      <td style={{ color: "var(--text-2)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.descricao}
                      </td>
                      <td>
                        {c.valor
                          ? c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                          : "—"}
                      </td>
                      <td>
                        <span className={`badge ${s.cls}`}>{s.label}</span>
                      </td>
                      <td style={{ color: "var(--text-3)" }}>
                        {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
