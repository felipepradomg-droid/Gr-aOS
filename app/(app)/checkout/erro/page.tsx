import Link from "next/link";

export default function CheckoutErroPage() {
  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-success">
          <div className="success-icon">😕</div>
          <h1>Pagamento não concluído</h1>
          <p>Houve um problema com seu pagamento. Tente novamente ou escolha outra forma de pagamento.</p>
          <Link href="/planos" className="btn-checkout">
            Tentar novamente →
          </Link>
        </div>
      </div>
    </div>
  );
}
