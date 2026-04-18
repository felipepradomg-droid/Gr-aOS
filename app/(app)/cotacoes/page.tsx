import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NovaCotacaoModal from "@/components/NovaCotacaoModal";

export default async function CotacoesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;
  const isPro = session!.user.plan !== "free";

  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const cotacoesMes = await prisma.cotacao.count({
    where: { userId, createdAt: { gte: inicioMes } },
  });
  const podeNova = isPro || cotacoesMes < 10;

  const where: any = { userId };
  if (searchParams.status) where.status = searchParams.status;

  const cotacoes = await prisma.cotacao.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
    rascunho: { label: "Rascunho", cls: "badge-gray" },
    enviada: { label: "Enviada", cls: "badge-yellow" },
    aprovada: { label: "Aprovada", cls: "badge-green" },
    rejeitada: { label: "Rejeitada", cls: "badge-red" },
  };

  const FILTERS = [
    { value: "", label: "Todas" },
    { value: "rascunho", label: "Rascunho" },
    { value: "enviada", label: "Enviadas" },
    { value: "aprovada", label: "Aprovadas" },
    { value: "rejeitada", label: "Rejeitadas" },
  ];

  return (
    <>
      <div className="app-topbar">
        <h1>Cotações</h1>
        {podeNova ? (
          <NovaCotacaoModal />
        ) : (
          <Link href="/checkout?plan=starter" className="btn-primary" style={{ fontSize: ".875rem", padding: "8px 16px" }}>
            Fazer upgrade
          </Link>
        )}
      </div>

      <div className="app-content">
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={f.value ? `/cotacoes?status=${f.value}` : "/cotacoes"}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: ".825rem",
                fontWeight: 500,
                background: searchParams.status === f.value || (!searchParams.status && !f.value) ? "var(--brand)" : "var(--bg-2)",
                color: searchParams.status === f.value || (!searchParams.status && !f.value) ? "#fff" : "var(--text-2)",
                border: "1px solid var(--border)",
                textDecoration: "none",
              }}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {cotacoes.length === 0 ? (
          <div style={{
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "56px",
            textAlign: "center",
            color: "var(--text-3)",
          }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📋</p>
            <p style={{ marginBottom: "8px", color: "var(--text-2)", fontWeight: 500 }}>
              Nenhuma cotação encontrada
            </p>
            <p style={{ fontSize: ".875rem" }}>Crie sua primeira cotação clicando no botão acima.</p>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cotacoes.map((c) => {
                  const s = STATUS_LABEL[c.status] ?? { label: c.status, cls: "badge-gray" };
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{c.clienteNome}</div>
                        {c.clienteTel && (
                          <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{c.clienteTel}</div>
                        )}
                      </td>
                      <td style={{ color: "var(--text-2)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.descricao}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {c.valor
                          ? c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                          : <span style={{ color: "var(--text-3)" }}>—</span>}
                      </td>
                      <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                      <td style={{ color: "var(--text-3)", fontSize: ".8rem" }}>
                        {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td>
                        <Link
                          href={`/cotacoes/${c.id}`}
                          style={{ fontSize: ".8rem", color: "var(--brand)", fontWeight: 600 }}
                        >
                          Ver →
                        </Link>
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
