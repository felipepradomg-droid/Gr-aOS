"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PLAN_LABELS: Record<string, { name: string; price: number; features: string[] }> = {
  pro: {
    name: "GrúaOS Pro",
    price: 97,
    features: [
      "Frota ilimitada",
      "OS e Contratos",
      "Boleto e PIX integrados",
      "NFS-e automática",
      "Manutenção preditiva",
      "BI e Inteligência",
      "Suporte por WhatsApp",
    ],
  },
  enterprise: {
    name: "GrúaOS Enterprise",
    price: 197,
    features: [
      "Tudo do Pro",
      "Múltiplos usuários",
      "API de integração",
      "Onboarding dedicado",
      "Suporte prioritário 24h",
      "Relatórios avançados",
    ],
  },
};

function CheckoutForm() {
  const params = useSearchParams();
  const planId = params.get("plan") || "pro";
  const plan = PLAN_LABELS[planId] || PLAN_LABELS.pro;
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (e) {
      alert("Erro ao criar checkout. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-header">
          <h1>Assinar {plan.name}</h1>
          <p>Acesso imediato após confirmação do pagamento</p>
        </div>

        <div className="plan-summary">
          <div className="plan-summary-price">
            <span className="currency">R$</span>
            <span style={{ fontSize: "2.2rem", fontWeight: 800 }}>{plan.price}</span>
            <span className="period">/mês</span>
          </div>
          <ul className="plan-summary-features">
            {plan.features.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
        </div>

        <div style={{
          background: "var(--bg-3)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "16px",
          marginBottom: "20px",
        }}>
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>
            Formas de pagamento aceitas:
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["💳 Crédito", "💳 Débito", "🔑 PIX", "🌎 Internacional"].map((m) => (
              <span
                key={m}
                style={{
                  background: "var(--bg-2)",
                  border: "1px solid var(--border)",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: ".8rem",
                  color: "var(--text-2)",
                }}
              >
                {m}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "12px", fontSize: ".8rem", color: "var(--text-3)" }}>
            Até 12x no cartão · Processado pelo Stripe · Cancele quando quiser
          </div>
        </div>

        <button
          className="btn-checkout"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Redirecionando..." : `Pagar R$ ${plan.price}/mês →`}
        </button>

        <p className="checkout-note">
          🔒 Pagamento 100% seguro via Stripe · SSL · Cancele quando quiser
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  );
}
