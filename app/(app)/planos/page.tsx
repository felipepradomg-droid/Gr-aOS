import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function PlanosPage() {
  const session = await getServerSession(authOptions);
  const planoAtual = session!.user.plan;

  const planos = [
    {
      id: "free",
      name: "Free",
      price: 0,
      trial: false,
      features: [
        "1 guindaste",
        "10 OS por mês",
        "Cotações básicas",
        "Dashboard",
      ],
      destaque: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 97,
      trial: true,
      features: [
        "Frota ilimitada",
        "OS e Contratos ilimitados",
        "Boleto e PIX integrados",
        "NFS-e automática",
        "Manutenção preditiva",
        "BI e Inteligência",
        "Suporte por WhatsApp",
      ],
      destaque: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 197,
      trial: true,
      features: [
        "Tudo do Pro",
        "Múltiplos usuários",
        "API de integração",
        "Onboarding dedicado",
        "Suporte prioritário 24h",
        "Relatórios avançados",
        "SLA garantido",
      ],
      destaque: false,
    },
  ];

  return (
    <>
      <div className="app-topbar">
        <h1>Escolha seu plano</h1>
      </div>

      <div className="app-content">
        <p style={{ color: "var(--text-2)", marginBottom: "8px", textAlign: "center" }}>
          Seu plano atual:{" "}
          <strong style={{ color: "var(--brand)", textTransform: "capitalize" }}>
            {planoAtual}
          </strong>
        </p>
        <p style={{ color: "var(--text-3)", marginBottom: "32px", textAlign: "center", fontSize: ".875rem" }}>
          🎁 7 dias grátis nos planos Pro e Enterprise · Cartão obrigatório · Cancele quando quiser
        </p>

        <div className="pricing-grid">
          {planos.map((plano) => (
            <div key={plano.id} className={`pricing-card ${plano.destaque ? "featured" : ""}`}>
              {plano.destaque && <div className="plan-badge">Mais popular</div>}
              <div className="plan-name" style={{ marginTop: plano.destaque ? "16px" : "0" }}>
                {plano.name}
              </div>
              <div className="plan-price">
                {plano.price === 0 ? (
                  <>Grátis</>
                ) : (
                  <>R$ {plano.price}<span>/mês</span></>
                )}
              </div>
              {plano.trial && (
                <div style={{
                  background: "rgba(249,115,22,.1)",
                  border: "1px solid rgba(249,115,22,.3)",
                  borderRadius: "var(--radius)",
                  padding: "8px 12px",
                  marginBottom: "16px",
                  fontSize: ".8rem",
                  color: "var(--brand)",
                  fontWeight: 600,
                  textAlign: "center",
                }}>
                  🎁 7 dias grátis com cartão
                </div>
              )}
              <ul className="plan-features">
                {plano.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>

              {planoAtual === plano.id ? (
                <div style={{
                  textAlign: "center",
                  padding: "12px",
                  background: "rgba(34,197,94,.1)",
                  borderRadius: "var(--radius)",
                  color: "var(--success)",
                  fontWeight: 600,
                  fontSize: ".875rem",
                }}>
                  ✓ Plano atual
                </div>
              ) : plano.id === "free" ? (
                <div style={{
                  textAlign: "center",
                  padding: "12px",
                  background: "var(--bg-3)",
                  borderRadius: "var(--radius)",
                  color: "var(--text-3)",
                  fontWeight: 600,
                  fontSize: ".875rem",
                }}>
                  Plano gratuito
                </div>
              ) : (
                <Link
                  href={`/checkout?plan=${plano.id}`}
                  className={plano.destaque ? "btn-primary-full" : "btn-outline-full"}
                >
                  Começar 7 dias grátis →
                </Link>
              )}
            </div>
          ))}
        </div>

        <p style={{
          textAlign: "center",
          color: "var(--text-3)",
          fontSize: ".8rem",
          marginTop: "32px",
          lineHeight: 1.6,
        }}>
          💳 Cartão obrigatório · Não será cobrado nos primeiros 7 dias<br/>
          Cobrança automática após o trial · Cancele a qualquer momento
        </p>
      </div>
    </>
  );
}
