import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BotoesCotacao from "@/components/BotoesCotacao";

export default async function CotacaoPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const cotacao = await prisma.cotacao.findFirst({
    where: { id: params.id, userId },
  });

  if (!cotacao) notFound();

  const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
    rascunho: { label: "Rascunho", cls: "badge-gray" },
    enviada: { label: "Enviada", cls: "badge-yellow" },
    aprovada: { label: "Aprovada", cls: "badge-green" },
    rejeitada: { label: "Rejeitada", cls: "badge-red" },
  };

  const s = STATUS_LABEL[cotacao.status] ?? { label: cotacao.status, cls: "badge-gray" };

  return (
    <>
      <div className="app-topbar">
        <h1>Detalhes da Cotação</h1>
        <Link href="/cotacoes" style={{ fontSize: ".875rem", color: "var(--text-2)" }}>
          ← Voltar
        </Link>
      </div>

      <div className="app-content" style={{ maxWidth: 640 }}>
        <div style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "28px",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "4px" }}>
                {cotacao.clienteNome}
              </h2>
              <span className={`badge ${s.cls}`}>{s.label}</span>
            </div>
            {cotacao.valor && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: ".8rem", color: "var(--text-3)", marginBottom: "4px" }}>Valor</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brand)" }}>
                  {cotacao.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {cotacao.clienteEmail && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-3)", fontSize: ".875rem" }}>Email</span>
                <span style={{ fontSize: ".875rem" }}>{cotacao.clienteEmail}</span>
              </div>
            )}
            {cotacao.clienteTel && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-3)", fontSize: ".875rem" }}>Telefone</span>
                <span style={{ fontSize: ".875rem" }}>{cotacao.clienteTel}</span>
              </div>
            )}
            <div style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ color: "var(--text-3)", fontSize: ".875rem", marginBottom: "6px" }}>Descrição</div>
              <div style={{ fontSize: ".95rem", lineHeight: 1.6 }}>{cotacao.descricao}</div>
            </div>
            {cotacao.observacoes && (
              <div style={{ padding: "8px 0" }}>
                <div style={{ color: "var(--text-3)", fontSize: ".875rem", marginBottom: "6px" }}>Observações</div>
                <div style={{ fontSize: ".95rem", lineHeight: 1.6 }}>{cotacao.observacoes}</div>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text-3)", fontSize: ".875rem" }}>Criada em</span>
              <span style={{ fontSize: ".875rem" }}>{new Date(cotacao.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>

        <BotoesCotacao cotacaoId={cotacao.id} status={cotacao.status} clienteNome={cotacao.clienteNome} clienteTel={cotacao.clienteTel || ""} descricao={cotacao.descricao} valor={cotacao.valor || 0} observacoes={cotacao.observacoes || ""} />
      </div>
    </>
  );
}
