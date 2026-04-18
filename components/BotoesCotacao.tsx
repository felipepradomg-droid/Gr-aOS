"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BotoesCotacao({
  cotacaoId,
  status,
  clienteNome,
  clienteTel,
  descricao,
  valor,
  observacoes,
}: {
  cotacaoId: string;
  status: string;
  clienteNome: string;
  clienteTel: string;
  descricao: string;
  valor: number;
  observacoes: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function mudarStatus(novoStatus: string) {
    setLoading(true);
    await fetch(`/api/cotacoes/${cotacaoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  async function deletar() {
    if (!confirm("Deletar esta cotação?")) return;
    setLoading(true);
    await fetch(`/api/cotacoes/${cotacaoId}`, { method: "DELETE" });
    setLoading(false);
    router.push("/cotacoes");
  }

  function gerarPDF() {
    const conteudo = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cotação - ${clienteNome}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#333}.header{border-bottom:3px solid #F97316;padding-bottom:20px;margin-bottom:30px}.logo{font-size:28px;font-weight:900;color:#F97316}.campo{margin-bottom:16px}.label{font-size:12px;color:#888;text-transform:uppercase;margin-bottom:4px}.descricao{background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.6}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center}.badge{display:inline-block;background:#F97316;color:white;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700}</style></head><body><div class="header"><div class="logo">GrúaOS</div><div style="font-size:20px;font-weight:700;margin-top:8px">Proposta Comercial</div></div><div class="campo"><div class="label">Cliente</div><div style="font-size:20px;font-weight:700">${clienteNome}</div></div>${clienteTel ? `<div class="campo"><div class="label">Telefone</div><div>${clienteTel}</div></div>` : ""}<div class="campo"><div class="label">Descrição do serviço</div><div class="descricao">${descricao}</div></div>${observacoes ? `<div class="campo"><div class="label">Observações</div><div class="descricao">${observacoes}</div></div>` : ""}${valor ? `<div class="campo" style="margin-top:24px"><div style="font-size:13px;color:#888">Valor total</div><div style="font-size:28px;font-weight:900;color:#F97316">${valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div></div>` : ""}<div class="campo" style="margin-top:20px"><span class="badge">Proposta válida por 7 dias</span></div><div class="footer">Gerado por GrúaOS · gruaos.vercel.app · gruaossolucoes@gmail.com</div></body></html>`;
    const janela = window.open("", "_blank");
    if (janela) {
      janela.document.write(conteudo);
      janela.document.close();
      janela.print();
    }
  }

  function enviarWhatsApp() {
    const texto = `Olá ${clienteNome}! Segue nossa proposta:\n\n*Serviço:* ${descricao}\n${valor ? `*Valor:* ${valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}` : ""}\n${observacoes ? `*Obs:* ${observacoes}` : ""}\n\nProposta válida por 7 dias.\n\n_GrúaOS_`;
    const url = `https://wa.me/${clienteTel.replace(/\D/g,"")}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <button onClick={gerarPDF} style={{ background: "var(--brand)", color: "#fff", border: "none", padding: "14px", borderRadius: "var(--radius)", fontWeight: 700, fontSize: "1rem", cursor: "pointer", width: "100%" }}>
        📄 Gerar PDF da cotação
      </button>
      {clienteTel && (
        <button onClick={enviarWhatsApp} style={{ background: "#25D366", color: "#fff", border: "none", padding: "14px", borderRadius: "var(--radius)", fontWeight: 700, fontSize: "1rem", cursor: "pointer", width: "100%" }}>
          📱 Enviar por WhatsApp
        </button>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "8px" }}>
        {status !== "enviada" && (
          <button onClick={() => mudarStatus("enviada")} disabled={loading} style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: ".8rem", fontWeight: 600 }}>
            Marcar Enviada
          </button>
        )}
        {status !== "aprovada" && (
          <button onClick={() => mudarStatus("aprovada")} disabled={loading} style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", color: "#86EFAC", padding: "10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: ".8rem", fontWeight: 600 }}>
            Marcar Aprovada
          </button>
        )}
        {status !== "rejeitada" && (
          <button onClick={() => mudarStatus("rejeitada")} disabled={loading} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#FCA5A5", padding: "10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: ".8rem", fontWeight: 600 }}>
            Marcar Rejeitada
          </button>
        )}
      </div>
      <button onClick={deletar} disabled={loading} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: ".8rem", textAlign: "center", marginTop: "8px" }}>
        🗑️ Deletar cotação
      </button>
    </div>
  );
}
