import Link from "next/link";

export default function CheckoutSucessoPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-success">
          <div className="success-icon">🎉</div>
          <h1>Pagamento confirmado!</h1>
          <p>Seu plano está sendo ativado. Em alguns segundos você terá acesso completo.</p>
          <Link href="/dashboard" className="btn-checkout">
            Acessar meu painel →
          </Link>
        </div>
      </div>
    </div>
  );
}
