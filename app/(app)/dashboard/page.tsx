import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UpgradeBanner from "@/components/UpgradeBanner";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const isPro = session!.user.plan !== "free";

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const limiteFree = 10;

  const [
    totalCotacoes,
    aprovadas,
    rejeitadas,
    enviadas,
    cotacoesMes,
    fleet,
    activeOS,
    invoices,
    overdueInvoices,
    recentOS,
    maintenanceAlerts,
  ] = await Promise.all([
    prisma.cotacao.count({ where: { userId } }),
    prisma.cotacao.count({ where: { userId, status: "aprovada" } }),
    prisma.cotacao.count({ where: { userId, status: "rejeitada" } }),
    prisma.cotacao.count({ where: { userId, status: "enviada" } }),
    prisma.cotacao.count({ where: { userId, createdAt: { gte: monthStart } } }),
    prisma.equipment.findMany({
      where: { userId },
      select: { status: true },
    }),
    prisma.serviceOrder.count({
      where: { userId, status: { in: ["pending", "confirmed", "in_progress"] } },
    }),
    prisma.invoice.findMany({
      where: { userId, issueDate: { gte: monthStart, lte: monthEnd } },
      select: { status: true, totalAmount: true },
    }),
    prisma.invoice.findMany({
      where: { userId, status: "sent", dueDate: { lt: now } },
      select: { id: true, invoiceNumber: true, totalAmount: true, clienteNome: true },
      take: 3,
    }),
    prisma.serviceOrder.findMany({
      where: { userId },
      include: { equipment: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.maintenanceRecord.findMany({
      where: { userId, status: { in: ["scheduled", "in_progress"] } },
      include: { equipment: { select: { name: true } } },
      take: 3,
    }),
  ]);

  const taxaAprovacao =
    totalCotacoes > 0 ? Math.round((aprovadas / totalCotacoes) * 100) : 0;
  const atingiuLimite = !isPro && cotacoesMes >= limiteFree;

  const fleetStats = {
    total: fleet.length,
    available: fleet.filter((e) => e.status === "available").length,
    in_use: fleet.filter((e) => e.status === "in_use").length,
    maintenance: fleet.filter((e) => e.status === "maintenance").length,
    utilization:
      fleet.length > 0
        ? Math.round(
            (fleet.filter((e) => e.status === "in_use").length / fleet.length) * 100
          )
        : 0,
  };

  const financialStats = {
    invoiced: invoices.reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    received: invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
    pending: invoices
      .filter((i) => i.status === "sent")
      .reduce((s, i) => s + (i.totalAmount ?? 0), 0),
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const OS_STATUS_COLORS: Record<string, string> = {
    pending: "#9ca3af",
    confirmed: "#3b82f6",
    in_progress: "#22c55e",
    completed: "#a855f7",
    cancelled: "#ef4444",
  };

  const OS_STATUS_LABELS: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmada",
    in_progress: "Em Execução",
    completed: "Concluída",
    cancelled: "Cancelada",
  };

  return (
    <>
      <div className="app-topbar">
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: "0.8rem", color: "var(--text-3)", marginTop: 2 }}>
            {now.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <Link
          href={atingiuLimite ? "/planos" : "/cotacoes"}
          className="btn-primary"
          style={{ fontSize: ".875rem", padding: "8px 16px" }}
        >
          + Nova Cotação
        </Link>
      </div>

      <div className="app-content">
        {!isPro && (
          <UpgradeBanner cotacoesMes={cotacoesMes} limite={limiteFree} />
        )}

        {/* KPIs principais */}
        <div className="stats-grid">
          <div className="stat-card" style={{ borderColor: "#bfdbfe" }}>
            <div className="stat-label">🏗️ Frota</div>
            <div className="stat-value">
              {fleetStats.available}
              <span style={{ fontSize: "1rem", color: "var(--text-3)", fontWeight: 400 }}>
                /{fleetStats.total}
              </span>
            </div>
            <div className="stat-sub">
              {fleetStats.utilization}% em uso · {fleetStats.in_use} operando
            </div>
          </div>

          <div className="stat-card" style={{ borderColor: "#fde68a" }}>
            <div className="stat-label">📋 OS Ativas</div>
            <div className="stat-value">{activeOS}</div>
            <div className="stat-sub">ordens em andamento</div>
          </div>

          <div className="stat-card" style={{ borderColor: "#bbf7d0" }}>
            <div className="stat-label">💰 Faturado (mês)</div>
            <div className="stat-value" style={{ fontSize: "1.4rem" }}>
              {formatCurrency(financialStats.invoiced)}
            </div>
            <div className="stat-sub">
              {formatCurrency(financialStats.received)} recebido
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">📊 Taxa de Aprovação</div>
            <div className="stat-value">{taxaAprovacao}%</div>
            <div className="stat-sub">
              {aprovadas} aprovadas · {enviadas} aguardando
            </div>
          </div>
        </div>

        {/* Alertas */}
        {(overdueInvoices.length > 0 || maintenanceAlerts.length > 0) && (
          <div style={{ marginBottom: "24px" }}>
            <div className="section-header">
              <h2>⚠️ Alertas</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {overdueInvoices.map((inv) => (
                <Link key={inv.id} href={`/faturas/${inv.id}`}>
                  <div style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}>
                    <span style={{ fontSize: "0.875rem", color: "#dc2626" }}>
                      🔴 Fatura {inv.invoiceNumber} vencida — {inv.clienteNome}
                    </span>
                    <span style={{ fontWeight: 700, color: "#dc2626", fontSize: "0.875rem" }}>
                      {formatCurrency(inv.totalAmount)}
                    </span>
                  </div>
                </Link>
              ))}
              {maintenanceAlerts.map((m) => (
                <div key={m.id} style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  fontSize: "0.875rem",
                  color: "#92400e",
                }}>
                  🟡 {m.equipment?.name} em manutenção — {m.description}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OS Recentes + Frota */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}>
          {/* OS Recentes */}
          <div style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
          }}>
            <div className="section-header" style={{ marginBottom: "12px" }}>
              <h2 style={{ fontSize: "1rem" }}>📋 OS Recentes</h2>
              <Link href="/os" style={{ fontSize: ".8rem", color: "var(--text-2)" }}>
                Ver todas →
              </Link>
            </div>
            {recentOS.length === 0 ? (
              <p style={{ fontSize: "0.875rem", color: "var(--text-3)", textAlign: "center", padding: "20px 0" }}>
                Nenhuma OS criada ainda
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {recentOS.map((os) => (
                  <Link key={os.id} href={`/os/${os.id}`}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: OS_STATUS_COLORS[os.status] ?? "#9ca3af",
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {os.clienteNome}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-3)", margin: 0 }}>
                          {os.osNumber} · {os.equipment?.name}
                        </p>
                      </div>
                      <span style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: OS_STATUS_COLORS[os.status] + "22",
                        color: OS_STATUS_COLORS[os.status],
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>
                        {OS_STATUS_LABELS[os.status]}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Status da Frota */}
          <div style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
          }}>
            <div className="section-header" style={{ marginBottom: "12px" }}>
              <h2 style={{ fontSize: "1rem" }}>🏗️ Status da Frota</h2>
              <Link href="/frota" style={{ fontSize: ".8rem", color: "var(--text-2)" }}>
                Ver frota →
              </Link>
            </div>
            {fleetStats.total === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--text-3)", marginBottom: "12px" }}>
                  Nenhum equipamento cadastrado
                </p>
                <Link
                  href="/frota/novo"
                  className="btn-primary"
                  style={{ fontSize: "0.8rem", padding: "6px 14px" }}
                >
                  Cadastrar equipamento
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Disponíveis", value: fleetStats.available, color: "#22c55e", bg: "#f0fdf4" },
                  { label: "Em Operação", value: fleetStats.in_use, color: "#3b82f6", bg: "#eff6ff" },
                  { label: "Em Manutenção", value: fleetStats.maintenance, color: "#f59e0b", bg: "#fffbeb" },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: item.bg,
                    borderRadius: "8px",
                  }}>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>
                      {item.label}
                    </span>
                    <span style={{ fontWeight: 700, color: item.color, fontSize: "1.1rem" }}>
                      {item.value}
                    </span>
                  </div>
                ))}
                <div style={{
                  padding: "10px 14px",
                  background: "var(--bg-3, #f3f4f6)",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>
                    Taxa de utilização
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {fleetStats.utilization}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="section-header">
          <h2>⚡ Ações Rápidas</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}>
          {[
            { href: "/cotacoes", icon: "📋", label: "Nova Cotação" },
            { href: "/os/nova", icon: "📝", label: "Nova OS" },
            { href: "/frota/novo", icon: "🏗️", label: "Novo Equipamento" },
            { href: "/agenda", icon: "📅", label: "Ver Agenda" },
            { href: "/faturas/nova", icon: "💰", label: "Nova Fatura" },
            { href: "/manutencao/nova", icon: "🔧", label: "Registrar Manutenção" },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>
                  {action.icon}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-1)" }}>
                  {action.label}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Cotações recentes */}
        <div className="section-header">
          <h2>Cotações Recentes</h2>
          <Link href="/cotacoes" style={{ fontSize: ".875rem", color: "var(--text-2)" }}>
            Ver todas →
          </Link>
        </div>

        {totalCotacoes === 0 ? (
          <div style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "48px",
            textAlign: "center",
            color: "var(--text-3)",
          }}>
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>📋</p>
            <p style={{ marginBottom: "16px" }}>Nenhuma cotação ainda.</p>
            <Link href="/cotacoes" className="btn-primary">
              Criar primeira cotação
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Equipamento</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentOS.map((os) => (
                  <tr key={os.id}>
                    <td style={{ fontWeight: 500 }}>{os.clienteNome}</td>
                    <td style={{ color: "var(--text-2)" }}>
                      {os.equipment?.name ?? "—"}
                    </td>
                    <td>
                      {os.totalAmount ? formatCurrency(os.totalAmount) : "—"}
                    </td>
                    <td>
                      <span style={{
                        padding: "2px 10px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background: OS_STATUS_COLORS[os.status] + "22",
                        color: OS_STATUS_COLORS[os.status],
                      }}>
                        {OS_STATUS_LABELS[os.status]}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-3)" }}>
                      {new Date(os.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
