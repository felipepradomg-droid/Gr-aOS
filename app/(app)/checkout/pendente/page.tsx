import Link from "next/link";

export default function CheckoutPendentePage() {
  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-success">
          <div className="success-icon">⏳</div>
          <h1>Pagamento em processamento</h1>
          <p>Seu pagamento está sendo processado. Assim que confirmado, seu plano será ativado automaticamente.</p>
          <p style={{ color: "var(--text-3)", fontSize: ".875rem", marginBottom: "24px" }}>
            Se pagou via boleto, pode levar até 2 dias úteis para compensar.
          </p>
          <Link href="/dashboard" className="btn-checkout">
            Ir para o painel →
          </Link>
        </div>
      </div>
    </div>
  );
}
