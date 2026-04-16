// app/(app)/configuracoes/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const isPro = session!.user.plan !== "free";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, plan: true, planExpiresAt: true, createdAt: true },
  });

  const pagamentos = await prisma.payment.findMany({
    where: { userId, status: "approved" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const diasRestantes = user?.planExpiresAt
    ? Math.max(0, Math.ceil((new Date(user.planExpiresAt).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <>
      <div className="app-topbar">
        <h1>Configurações</h1>
      </div>

      <div className="app-content" style={{ maxWidth: 640 }}>
        {/* Plano atual */}
        <div
          style={{
            background: "var(--bg-2)",
            border: `1px solid ${isPro ? "var(--brand)" : "var(--border)"}`,
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: ".8rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "4px" }}>
                Plano atual
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "capitalize" }}>
                {user?.plan === "free" ? "Free" : user?.plan}
                {isPro && " ⚡"}
              </div>
            </div>
            {!isPro ? (
              <Link href="/checkout?plan=pro" className="btn-primary" style={{ fontSize: ".875rem", padding: "8px 16px" }}>
                Fazer upgrade
              </Link>
            ) : (
              <Link href="/checkout?plan=pro" className="btn-outline" style={{ fontSize: ".875rem", padding: "8px 16px" }}>
                Renovar
              </Link>
            )}
          </div>

          {isPro && diasRestantes !== null && (
            <div
              style={{
                background: diasRestantes <= 7 ? "rgba(239,68,68,.1)" : "rgba(34,197,94,.08)",
                border: `1px solid ${diasRestantes <= 7 ? "rgba(239,68,68,.3)" : "rgba(34,197,94,.2)"}`,
                borderRadius: "var(--radius)",
                padding: "10px 14px",
                fontSize: ".875rem",
                color: diasRestantes <= 7 ? "#FCA5A5" : "#86EFAC",
              }}
            >
              {diasRestantes <= 7
                ? `⚠️ Seu plano expira em ${diasRestantes} dia(s). Renove para não perder o acesso.`
                : `✓ Plano ativo por mais ${diasRestantes} dia(s) (expira em ${new Date(user!.planExpiresAt!).toLocaleDateString("pt-BR")})`}
            </div>
          )}

          {!isPro && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "12px" }}>
              {[
                { icon: "📋", text: "10 cotações/mês" },
                { icon: "👤", text: "1 usuário" },
                { icon: "✗", text: "Sem relatórios", dim: true },
              ].map((i) => (
                <div key={i.text} style={{ fontSize: ".8rem", color: i.dim ? "var(--text-3)" : "var(--text-2)", display: "flex", gap: "6px", alignItems: "center" }}>
                  <span>{i.icon}</span>{i.text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dados da conta */}
        <div
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Dados da conta</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Nome", value: user?.name ?? "—" },
              { label: "Email", value: user?.email ?? "—" },
              { label: "Membro desde", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "—" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: ".875rem", color: "var(--text-3)" }}>{row.label}</span>
                <span style={{ fontSize: ".875rem", fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de pagamentos */}
        {pagamentos.length > 0 && (
          <div
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Histórico de pagamentos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {pagamentos.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: ".875rem",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 500, textTransform: "capitalize" }}>Plano {p.planId}</span>
                    <span style={{ color: "var(--text-3)", marginLeft: "8px", fontSize: ".8rem" }}>
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontWeight: 600 }}>
                      {p.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                    <span className="badge badge-green">✓ Pago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suporte */}
        <div style={{ marginTop: "24px", textAlign: "center", color: "var(--text-3)", fontSize: ".875rem" }}>
          Precisa de ajuda?{" "}
          <a href="mailto:gruaossolucoes@gmail.com" style={{ color: "var(--brand)" }}>
            gruaossolucoes@gmail.com
          </a>
        </div>
      </div>
    </>
  );
}
