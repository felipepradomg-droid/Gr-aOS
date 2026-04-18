import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function PlanosPage() {
  const session = await getServerSession(authOptions);
  const planoAtual = session!.user.plan;

  const planos = [
    {
      id: "starter",
      name: "Starter",
      price: 97,
      features: ["50 cotações/mês", "1 usuário", "PDF com sua marca", "Suporte por email"],
      destaque: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 197,
      features: ["Cotações ilimitadas", "3 usuários", "PDF com sua marca", "Envio por WhatsApp", "Relatórios mensais", "Alertas de follow-up"],
      destaque: true,
    },
    {
      id: "business",
      name: "Business",
      price: 397,
      features: ["Tudo do Pro", "10 usuários", "API de integração", "Onboarding dedicado", "Suporte prioritário", "SLA garantido"],
      destaque: false,
    },
  ];

  return (
    <>
      <div className="app-topbar">
        <h1>Escolha seu plano</h1>
      </div>

      <div className="app-content">
        <p style={{ color: "var(--text-2)", marginBottom: "32px", textAlign: "center" }}>
          Seu plano atual: <strong style={{ color: "var(--brand)", textTransform: "capitalize" }}>{planoAtual}</strong>
        </p>

        <div className="pricing-grid">
          {planos.map((plano) => (
            <div key={plano.id} className={`pricing-card ${plano.destaque ? "featured" : ""}`}>
              {plano.destaque && <div className="plan-badge">Mais popular</div>}
              <div className="plan-name" style={{ marginTop: plano.destaque ? "16px" : "0" }}>
                {plano.name}
              </div>
              <div className="plan-price">
                R$ {plano.price}<span>/mês</span>
              </div>
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
              ) : (
                <Link
                  href={`/checkout?plan=${plano.id}`}
                  className={plano.destaque ? "btn-primary-full" : "btn-outline-full"}
                >
                  Assinar {plano.name} →
                </Link>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "var(--text-3)", fontSize: ".875rem", marginTop: "32px" }}>
          Pagamento via PIX · Ativação imediata · Cancele quando quiser
        </p>
      </div>
    </>
  );
}
