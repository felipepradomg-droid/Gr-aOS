"use client";
// app/(app)/checkout/page.tsx

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const PLAN_LABELS: Record<string, { name: string; price: number; features: string[] }> = {
  pro: {
    name: "GrúaOS Pro",
    price: 97,
    features: ["Cotações ilimitadas", "3 usuários", "PDF com sua marca", "Envio WhatsApp"],
  },
  enterprise: {
    name: "GrúaOS Enterprise",
    price: 247,
    features: ["Tudo do Pro", "Usuários ilimitados", "Suporte 24h", "API de integração"],
  },
};

export default function CheckoutPage() {
  const params = useSearchParams();
  const planId = params.get("plan") || "pro";
  const plan = PLAN_LABELS[planId] || PLAN_LABELS.pro;

  const [step, setStep] = useState<"summary" | "pix" | "success">("summary");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    pixQrCodeBase64?: string;
    pixCopyPaste?: string;
    paymentId?: number;
    expiresAt?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  async function generatePix() {
    setLoading(true);
    try {
      const res = await fetch("/api/mp/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPixData(data);
      setStep("pix");

      // Polling para verificar pagamento aprovado
      startPolling(data.paymentId);
    } catch (e) {
      alert("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function startPolling(paymentId: number) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mp/status?paymentId=${paymentId}`);
        const data = await res.json();
        if (data.status === "approved") {
          clearInterval(interval);
          setStep("success");
        }
      } catch {}
    }, 5000); // verifica a cada 5s

    // Para após 30min (expiração do PIX)
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
  }

  function copyPix() {
    if (pixData?.pixCopyPaste) {
      navigator.clipboard.writeText(pixData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        {/* STEP 1 — Resumo */}
        {step === "summary" && (
          <>
            <div className="checkout-header">
              <h1>Assinar {plan.name}</h1>
              <p>Acesso imediato após confirmação do pagamento</p>
            </div>

            <div className="plan-summary">
              <div className="plan-summary-price">
                <span className="currency">R$</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/mês</span>
              </div>
              <ul className="plan-summary-features">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
            </div>

            <div className="payment-method">
              <div className="pix-badge">
                <span className="pix-icon">PIX</span>
                <div>
                  <strong>Pagamento via PIX</strong>
                  <p>Aprovação em segundos</p>
                </div>
              </div>
            </div>

            <button
              className="btn-checkout"
              onClick={generatePix}
              disabled={loading}
            >
              {loading ? "Gerando PIX..." : `Pagar R$ ${plan.price} via PIX`}
            </button>

            <p className="checkout-note">
              🔒 Pagamento seguro via Mercado Pago · Renovação mensal · Cancele quando quiser
            </p>
          </>
        )}

        {/* STEP 2 — QR Code PIX */}
        {step === "pix" && pixData && (
          <>
            <div className="checkout-header">
              <h1>Pague via PIX</h1>
              <p>O QR Code expira em <strong>30 minutos</strong></p>
            </div>

            <div className="pix-qr-wrapper">
              {pixData.pixQrCodeBase64 && (
                <img
                  src={`data:image/png;base64,${pixData.pixQrCodeBase64}`}
                  alt="QR Code PIX"
                  className="pix-qr"
                />
              )}
            </div>

            <p className="pix-instructions">
              Abra o app do seu banco → Pix → Ler QR Code
            </p>

            {pixData.pixCopyPaste && (
              <div className="pix-copypaste">
                <input
                  readOnly
                  value={pixData.pixCopyPaste}
                  className="pix-code-input"
                />
                <button onClick={copyPix} className="btn-copy">
                  {copied ? "✓ Copiado!" : "Copiar código"}
                </button>
              </div>
            )}

            <div className="pix-waiting">
              <div className="spinner" />
              <p>Aguardando confirmação do pagamento...</p>
            </div>

            <p className="checkout-note">
              Após o pagamento, seu plano será ativado automaticamente em segundos.
            </p>
          </>
        )}

        {/* STEP 3 — Sucesso */}
        {step === "success" && (
          <div className="checkout-success">
            <div className="success-icon">🎉</div>
            <h1>Pagamento confirmado!</h1>
            <p>Seu plano <strong>{plan.name}</strong> está ativo.</p>
            <a href="/dashboard" className="btn-checkout">
              Acessar meu painel →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
