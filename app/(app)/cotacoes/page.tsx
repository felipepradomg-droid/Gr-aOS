"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Cotacao = {
  id: string;
  clienteNome: string;
  clienteTel?: string;
  clienteEmail?: string;
  descricao: string;
  valor?: number;
  status: string;
  observacoes?: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "badge-gray" },
  enviada: { label: "Enviada", cls: "badge-yellow" },
  aprovada: { label: "Aprovada", cls: "badge-green" },
  rejeitada: { label: "Rejeitada", cls: "badge-red" },
};

export default function CotacoesPage() {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [selected, setSelected] = useState<Cotacao | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ clienteNome: "", clienteEmail: "", clienteTel: "", descricao: "", valor: "", observacoes: "" });

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const res = await fetch("/api/cotacoes");
    const data = await res.json();
    setCotacoes(data);
  }

  async function salvarNova() {
    setLoading(true);
    await fetch("/api/cotacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, valor: form.valor ? parseFloat(form.valor.replace(",", ".")) : null }),
    });
    setLoading(false);
    setShowNova(false);
    setForm({ clienteNome: "", clienteEmail: "", clienteTel: "", descricao: "", valor: "", observacoes: "" });
    carregar();
  }

  async function mudarStatus(id: string, status: string) {
    await fetch(`/api/cotacoes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    carregar();
    setSelected(prev => prev ? { ...prev, status } : null);
  }

  async function deletar(id: string) {
    if (!confirm("Deletar esta cotação?")) return;
    await fetch(`/api/cotacoes/${id}`, { method: "DELETE" });
    setShowModal(false);
    carregar();
  }

  function gerarPDF(c: Cotacao) {
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cotação - ${c.clienteNome}</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#333}.logo{font-size:28px;font-weight:900;color:#F97316;border-bottom:3px solid #F97316;padding-bottom:16px;margin-bottom:24px}.campo{margin-bottom:16px}.label{font-size:11px;color:#888;text-transform:uppercase;margin-bottom:4px}.desc{background:#f5f5f5;padding:16px;border-radius:8px}.valor{font-size:28px;font-weight:900;color:#F97316}.badge{background:#F97316;color:#fff;padding:4px 12px;border-radius:999px;font-size:12px}.footer{margin-top:40px;border-top:1px solid #eee;padding-top:16px;font-size:12px;color:#888;text-align:center}</style></head><body><div class="logo">GrúaOS — Proposta Comercial</div><div class="campo"><div class="label">Cliente</div><div style="font-size:20px;font-weight:700">${c.clienteNome}</div></div>${c.clienteTel ? `<div class="campo"><div class="label">Telefone</div><div>${c.clienteTel}</div></div>` : ""}${c.clienteEmail ? `<div class="campo"><div class="label">Email</div><div>${c.clienteEmail}</div></div>` : ""}<div class="campo"><div class="label">Serviço</div><div class="desc">${c.descricao}</div></div>${c.observacoes ? `<div class="campo"><div class="label">Observações</div><div class="desc">${c.observacoes}</div></div>` : ""}${c.valor ? `<div class="campo"><div class="label">Valor</div><div class="valor">${c.valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div></div>` : ""}<div class="campo"><span class="badge">Válida por 7 dias</span></div><div class="footer">GrúaOS · gruaos.vercel.app · gruaossolucoes@gmail.com</div></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  }

  function enviarWhatsApp(c: Cotacao) {
    const txt = `Olá ${c.clienteNome}!\n\n*Proposta GrúaOS*\n\n*Serviço:* ${c.descricao}\n${c.valor ? `*Valor:* ${c.valor.toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}` : ""}\n${c.observacoes ? `*Obs:* ${c.observacoes}` : ""}\n\nVálida por 7 dias.\n_GrúaOS_`;
    window.open(`https://wa.me/${(c.clienteTel||"").replace(/\D/g,"")}?text=${encodeURIComponent(txt)}`, "_blank");
  }

  return (
    <>
      <div className="app-topbar">
        <h1>Cotações</h1>
        <button onClick={() => setShowNova(true)} style={{ background: "var(--brand)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "var(--radius)", fontWeight: 600, fontSize: ".875rem", cursor: "pointer" }}>
          + Nova cotação
        </button>
      </div>

      <div className="app-content">
        {cotacoes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px", color: "var(--text-3)" }}>
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>📋</p>
            <p>Nenhuma cotação ainda. Crie a primeira!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {cotacoes.map((c) => {
              const s = STATUS_LABEL[c.status] ?? { label: c.status, cls: "badge-gray" };
              return (
                <div
                  key={c.id}
                  onClick={() => { setSelected(c); setShowModal(true); }}
                  style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", cursor: "pointer", WebkitTapHighlightColor: "rgba(249,115,22,.1)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <div style={{ fontWeight: 700 }}>{c.clienteNome}</div>
                    <span className={`badge ${s.cls}`}>{s.label}</span>
                  </div>
                  <div style={{ color: "var(--text-2)", fontSize: ".875rem", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.descricao}</div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-3)", fontSize: ".8rem" }}>{new Date(c.createdAt).toLocaleDateString("pt-BR")}</span>
                    {c.valor && <span style={{ fontWeight: 700, color: "var(--brand)", fontSize: ".875rem" }}>{c.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETALHE */}
      {showModal && selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 300, display: "flex", alignItems: "flex-end", padding: "0" }} onClick={() => setShowModal(false)}>
          <div style={{ background: "var(--bg-2)", borderRadius: "20px 20px 0 0", padding: "24px", width: "100%", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.2rem" }}>{selected.clienteNome}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-3)", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <span className={`badge ${STATUS_LABEL[selected.status]?.cls || "badge-gray"}`}>{STATUS_LABEL[selected.status]?.label || selected.status}</span>
            </div>

            <p style={{ color: "var(--text-2)", marginBottom: "12px", lineHeight: 1.6 }}>{selected.descricao}</p>
            {selected.clienteTel && <p style={{ color: "var(--text-3)", fontSize: ".875rem", marginBottom: "8px" }}>📞 {selected.clienteTel}</p>}
            {selected.clienteEmail && <p style={{ color: "var(--text-3)", fontSize: ".875rem", marginBottom: "8px" }}>✉️ {selected.clienteEmail}</p>}
            {selected.valor && <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--brand)", marginBottom: "16px" }}>{selected.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>}
            {selected.observacoes && <p style={{ color: "var(--text-2)", fontSize: ".875rem", marginBottom: "16px" }}>{selected.observacoes}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => gerarPDF(selected)} style={{ background: "var(--brand)", color: "#fff", border: "none", padding: "14px", borderRadius: "var(--radius)", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>📄 Gerar PDF</button>
              {selected.clienteTel && <button onClick={() => enviarWhatsApp(selected)} style={{ background: "#25D366", color: "#fff", border: "none", padding: "14px", borderRadius: "var(--radius)", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>📱 Enviar WhatsApp</button>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {selected.status !== "enviada" && <button onClick={() => mudarStatus(selected.id, "enviada")} style={{ background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: ".8rem", fontWeight: 600 }}>Enviada</button>}
                {selected.status !== "aprovada" && <button onClick={() => mudarStatus(selected.id, "aprovada")} style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", color: "#86EFAC", padding: "10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: ".8rem", fontWeight: 600 }}>Aprovada</button>}
                {selected.status !== "rejeitada" && <button onClick={() => mudarStatus(selected.id, "rejeitada")} style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", color: "#FCA5A5", padding: "10px", borderRadius: "var(--radius)", cursor: "pointer", fontSize: ".8rem", fontWeight: 600 }}>Rejeitada</button>}
              </div>
              <button onClick={() => deletar(selected.id)} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: ".8rem", marginTop: "8px" }}>🗑️ Deletar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA COTAÇÃO */}
      {showNova && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 300, display: "flex", alignItems: "flex-end" }} onClick={() => setShowNova(false)}>
          <div style={{ background: "var(--bg-2)", borderRadius: "20px 20px 0 0", padding: "24px", width: "100%", maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontWeight: 700 }}>Nova cotação</h2>
              <button onClick={() => setShowNova(false)} style={{ background: "none", border: "none", color: "var(--text-3)", fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "clienteNome", label: "Nome do cliente *", placeholder: "Construtora ABC", type: "text" },
                { key: "clienteTel", label: "Telefone / WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
                { key: "clienteEmail", label: "Email", placeholder: "cliente@empresa.com", type: "email" },
                { key: "valor", label: "Valor (R$)", placeholder: "0,00", type: "text" },
              ].map((f) => (
                <div key={f.key} className="field">
                  <label>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="field">
                <label>Descrição *</label>
                <textarea value={form.descricao} onChange={e => setForm(prev => ({ ...prev, descricao: e.target.value }))} placeholder="Descreva o serviço..." rows={3} style={{ background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "10px 14px", color: "var(--text)", fontSize: ".95rem", width: "100%", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
              </div>
              <div className="field">
                <label>Observações</label>
                <input type="text" placeholder="Prazo, condições..." value={form.observacoes} onChange={e => setForm(prev => ({ ...prev, observacoes: e.target.value }))} />
              </div>
              <button onClick={salvarNova} disabled={loading || !form.clienteNome || !form.descricao} style={{ background: "var(--brand)", color: "#fff", border: "none", padding: "14px", borderRadius: "var(--radius)", fontWeight: 700, fontSize: "1rem", cursor: "pointer", opacity: (!form.clienteNome || !form.descricao) ? .5 : 1 }}>
                {loading ? "Salvando..." : "Salvar cotação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
