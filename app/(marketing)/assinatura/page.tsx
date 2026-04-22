import Link from "next/link";

export default function AssinaturaPage() {
  return (
    <main style={{
      fontFamily: "Inter, sans-serif",
      background: "#0a0a0a",
      color: "#f5f5f5",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        maxWidth: "520px",
        width: "100%",
        textAlign: "center",
      }}>
        {/* Ícone */}
        <div style={{
          width: 72,
          height: 72,
          background: "#f9731622",
          border: "2px solid #f9731644",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          margin: "0 auto 24px",
        }}>
          🔒
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: 900,
          marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}>
          Seu período de teste encerrou
        </h1>

        <p style={{
          color: "#a3a3a3",
          fontSize: "1rem",
          lineHeight: 1.7,
          marginBottom: "36px",
        }}>
          Seus 7 dias gratuitos acabaram. Assine um plano para continuar
          usando o GrúaOS e não perder nenhum dado cadastrado.
        </p>

        {/* Planos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
          marginBottom: "32px",
        }}>
          {[
            {
              name: "Starter",
              price: "R$97",
              href: "/checkout?plan=starter",
              highlight: false,
            },
            {
              name: "Pro",
              price: "R$197",
              href: "/checkout?plan=pro",
              highlight: true,
            },
            {
              name: "Business",
              price: "R$347",
              href: "https://wa.me/5534991103401?text=Olá!%20Quero%20assinar%20o%20plano%20Business%20do%20GrúaOS.",
              highlight: false,
            },
          ].map((plan) => (
            <a
              key={plan.name}
              href={plan.href}
              style={{
                display: "block",
                padding: "16px 12px",
                borderRadius: "12px",
                background: plan.highlight ? "#f97316" : "#111",
                border: `1px solid ${plan.highlight ? "#f97316" : "#1f1f1f"}`,
                textDecoration: "none",
                color: "white",
                transition: "opacity 0.15s",
              }}
            >
              <div style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: plan.highlight ? "#fff7ed" : "#a3a3a3",
                marginBottom: "4px",
              }}>
                {plan.name}
              </div>
              <div style={{
                fontSize: "1.2rem",
                fontWeight: 900,
              }}>
                {plan.price}
              </div>
              <div style={{
                fontSize: "0.7rem",
                color: plan.highlight ? "#fed7aa" : "#525252",
              }}>
                /mês
              </div>
            </a>
          ))}
        </div>

        {/* CTA principal */}
        <Link href="/checkout?plan=pro" style={{
          display: "block",
          padding: "14px",
          background: "#f97316",
          color: "white",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: 700,
          fontSize: "1rem",
          marginBottom: "16px",
        }}>
          Assinar Pro por R$197/mês →
        </Link>

        {/* Ver todos os planos */}
        <Link href="/#planos" style={{
          color: "#525252",
          textDecoration: "none",
          fontSize: "0.85rem",
        }}>
          Ver detalhes de todos os planos
        </Link>

        {/* Garantia */}
        <div style={{
          marginTop: "32px",
          padding: "16px",
          background: "#111",
          border: "1px solid #1f1f1f",
          borderRadius: "10px",
          fontSize: "0.8rem",
          color: "#737373",
          lineHeight: 1.6,
        }}>
          🔒 Pagamento seguro via Mercado Pago · Cancele quando quiser ·
          Seus dados ficam salvos
        </div>

        {/* Logout */}
        <div style={{ marginTop: "24px" }}>
          <a href="/api/auth/signout" style={{
            color: "#525252",
            textDecoration: "none",
            fontSize: "0.8rem",
          }}>
            Sair da conta
          </a>
        </div>
      </div>
    </main>
  );
}
