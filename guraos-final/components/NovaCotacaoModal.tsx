"use client";
// components/NovaCotacaoModal.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaCotacaoModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clienteNome: "",
    clienteEmail: "",
    clienteTel: "",
    descricao: "",
    valor: "",
    observacoes: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.clienteNome || !form.descricao) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cotacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          valor: form.valor ? parseFloat(form.valor.replace(",", ".")) : null,
        }),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
      setForm({ clienteNome: "", clienteEmail: "", clienteTel: "", descricao: "", valor: "", observacoes: "" });
      router.refresh();
    } catch {
      alert("Erro ao salvar cotação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn-primary"
        style={{ fontSize: ".875rem", padding: "8px 16px", border: "none", cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        + Nova cotação
      </button>

      {open && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Nova cotação</h2>
              <button className="btn-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="modal-form">
              <div className="field">
                <label>Nome do cliente *</label>
                <input
                  type="text"
                  value={form.clienteNome}
                  onChange={(e) => update("clienteNome", e.target.value)}
                  placeholder="Construtora ABC"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="field">
                  <label>Telefone / WhatsApp</label>
                  <input
                    type="tel"
                    value={form.clienteTel}
                    onChange={(e) => update("clienteTel", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.clienteEmail}
                    onChange={(e) => update("clienteEmail", e.target.value)}
                    placeholder="cliente@empresa.com"
                  />
                </div>
              </div>

              <div className="field">
                <label>Descrição do serviço *</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => update("descricao", e.target.value)}
                  placeholder="Ex: Içamento de estrutura metálica, grua 50T, 1 dia de operação..."
                  rows={3}
                  style={{
                    background: "var(--bg-3)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "10px 14px",
                    color: "var(--text)",
                    fontSize: ".95rem",
                    resize: "vertical",
                    width: "100%",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="field">
                <label>Valor (R$)</label>
                <input
                  type="text"
                  value={form.valor}
                  onChange={(e) => update("valor", e.target.value)}
                  placeholder="0,00"
                  inputMode="decimal"
                />
              </div>

              <div className="field">
                <label>Observações</label>
                <input
                  type="text"
                  value={form.observacoes}
                  onChange={(e) => update("observacoes", e.target.value)}
                  placeholder="Condições, prazo, validade da proposta..."
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button className="btn-sm btn-sm-ghost" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button
                className="btn-sm btn-sm-primary"
                onClick={handleSubmit}
                disabled={loading || !form.clienteNome || !form.descricao}
                style={{ border: "none", cursor: "pointer", opacity: (!form.clienteNome || !form.descricao) ? .5 : 1 }}
              >
                {loading ? "Salvando..." : "Salvar cotação"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
