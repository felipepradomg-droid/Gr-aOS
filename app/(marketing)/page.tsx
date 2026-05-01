import Link from "next/link";

const modules = [
  { icon: "🏗️", title: "Frota", desc: "Cadastre equipamentos com fotos, documentos e especificações. Acompanhe status e disponibilidade em tempo real." },
  { icon: "📋", title: "Ordens de Serviço", desc: "Gere OS a partir de cotações aprovadas. Controle operadores, endereços e status do início ao fim." },
  { icon: "📅", title: "Agenda", desc: "Calendário Gantt com disponibilidade de toda a frota. Evite conflitos e maximize a ocupação." },
  { icon: "💬", title: "Cotações", desc: "Propostas profissionais em segundos. Envie por WhatsApp e converta em OS com um clique." },
  { icon: "📃", title: "Contratos", desc: "Diária, hora, mês ou valor fechado por obra. Medições automáticas vinculadas à frota." },
  { icon: "👷", title: "Operadores", desc: "Cadastro de operadores com registros de trabalho, vinculação a OS e histórico completo." },
  { icon: "🔧", title: "Manutenção", desc: "Planos preditivos com alertas por horímetro. Preventivas, corretivas e inspeções com histórico por equipamento." },
  { icon: "⛽", title: "Combustível", desc: "Controle de abastecimento por equipamento. Identifique desperdícios e consuma com rastreabilidade total." },
  { icon: "🧾", title: "NFS-e", desc: "Emissão automática de nota fiscal com um clique, direto da OS ou fatura. Integrado ao NFE.io." },
  { icon: "💰", title: "Faturas", desc: "Gere faturas a partir das OS. Controle o que foi pago, enviado e vencido com envio por WhatsApp." },
  { icon: "🏦", title: "Cobranças", desc: "Boleto e PIX automáticos com conciliação bancária via Asaas. Sem lançamento manual." },
  { icon: "📑", title: "Impostos", desc: "Apuração mensal automática para Simples Nacional, Lucro Presumido ou Real." },
  { icon: "🧠", title: "Inteligência", desc: "Insights de negócio, KPIs e indicadores em tempo real. Tome decisões com dados, não com intuição." },
];

const reasons = [
  { stat: "13", label: "módulos integrados", desc: "Do agendamento ao faturamento, tudo conectado num só sistema." },
  { stat: "1", label: "clique para emitir NFS-e", desc: "Nota fiscal gerada automaticamente a partir da OS ou fatura." },
  { stat: "30%", label: "combustível economizado", desc: "Rastreamento por equipamento revela desperdícios invisíveis." },
  { stat: "5min", label: "para começar a operar", desc: "Cadastre sua empresa, adicione a frota e comece hoje mesmo." },
];

export default function LandingPage() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#080808", color: "#f0f0f0", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 40px", borderBottom: "1px solid #1c1c1c",
        position: "sticky", top: 0, background: "#080808cc",
        backdropFilter: "blur(12px)", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 34, height: 34, background: "#f59e0b",
            borderRadius: "6px", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 900, fontSize: "1rem", color: "#080808",
          }}>G</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px" }}>GrúaOS</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/login" style={{ color: "#737373", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
            Entrar
          </Link>
          <Link href="/register?plan=pro" style={{
            background: "#f59e0b", color: "#080808",
            padding: "8px 20px", borderRadius: "6px",
            textDecoration: "none", fontSize: "0.875rem", fontWeight: 700,
          }}>
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "120px 24px 100px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#1a1a1a", border: "1px solid #2a2a2a",
          padding: "6px 14px", borderRadius: "4px",
          fontSize: "0.75rem", fontWeight: 600, color: "#737373",
          marginBottom: "32px", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          <span style={{ width: 6, height: 6, background: "#f59e0b", borderRadius: "50%", display: "inline-block" }} />
          ERP para locadoras de guindastes e equipamentos pesados
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
          fontWeight: 900, lineHeight: 1.05,
          marginBottom: "28px", letterSpacing: "-2px",
          color: "#f0f0f0",
        }}>
          Sua operação.<br />
          <span style={{
            color: "#f59e0b",
            borderBottom: "3px solid #f59e0b",
            paddingBottom: "2px",
          }}>Do primeiro agendamento</span><br />
          ao último real recebido.
        </h1>

        <p style={{
          fontSize: "1.1rem", color: "#737373", lineHeight: 1.7,
          maxWidth: "580px", margin: "0 auto 48px",
        }}>
          13 módulos integrados para locadoras de guindastes e equipamentos pesados.
          Substitua planilhas, WhatsApps soltos e sistemas genéricos de uma vez por todas.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register?plan=pro" style={{
            background: "#f59e0b", color: "#080808",
            padding: "14px 36px", borderRadius: "6px",
            textDecoration: "none", fontSize: "1rem", fontWeight: 800,
            letterSpacing: "-0.3px",
          }}>
            Testar 7 dias grátis →
          </Link>
          <Link href="/login" style={{
            background: "transparent", color: "#a3a3a3",
            padding: "14px 28px", borderRadius: "6px",
            textDecoration: "none", fontSize: "1rem", fontWeight: 600,
            border: "1px solid #2a2a2a",
          }}>
            Já tenho conta
          </Link>
        </div>

        <p style={{ marginTop: "20px", fontSize: "0.78rem", color: "#404040" }}>
          Cartão obrigatório · Sem cobrança nos primeiros 7 dias · Cancele quando quiser
        </p>
      </section>

      {/* DIVISOR */}
      <div style={{ borderTop: "1px solid #1c1c1c", maxWidth: "1100px", margin: "0 auto" }} />

      {/* NÚMEROS */}
      <section style={{ padding: "72px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1px", background: "#1c1c1c",
          border: "1px solid #1c1c1c", borderRadius: "12px", overflow: "hidden",
        }}>
          {reasons.map((r) => (
            <div key={r.stat} style={{
              background: "#0e0e0e", padding: "36px 28px",
            }}>
              <div style={{
                fontSize: "2.6rem", fontWeight: 900,
                color: "#f59e0b", letterSpacing: "-2px", marginBottom: "4px",
              }}>
                {r.stat}
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f0f0f0", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {r.label}
              </div>
              <div style={{ fontSize: "0.825rem", color: "#525252", lineHeight: 1.5 }}>
                {r.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MÓDULOS */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "56px" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px",
          }}>
            Módulos
          </p>
          <h2 style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 900, letterSpacing: "-1px",
            marginBottom: "12px", maxWidth: "600px",
          }}>
            Tudo integrado. Nada de retrabalho.
          </h2>
          <p style={{ color: "#525252", fontSize: "0.95rem", maxWidth: "500px", lineHeight: 1.6 }}>
            Cada módulo foi construído a partir de conversas reais com donos de locadoras.
            Não é sistema genérico adaptado — é feito para esse setor.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1px", background: "#1c1c1c",
          border: "1px solid #1c1c1c", borderRadius: "12px", overflow: "hidden",
        }}>
          {modules.map((m) => (
            <div key={m.title} style={{
              background: "#0e0e0e", padding: "28px",
              transition: "background 0.2s",
            }}>
              <div style={{
                fontSize: "1.4rem", marginBottom: "14px",
                width: 44, height: 44,
                background: "#1a1a1a", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid #242424",
              }}>
                {m.icon}
              </div>
              <h3 style={{
                fontSize: "0.95rem", fontWeight: 700,
                marginBottom: "6px", color: "#e0e0e0",
              }}>
                {m.title}
              </h3>
              <p style={{ fontSize: "0.825rem", color: "#525252", lineHeight: 1.6, margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{
        padding: "80px 24px",
        borderTop: "1px solid #1c1c1c",
        borderBottom: "1px solid #1c1c1c",
        background: "#0b0b0b",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "56px" }}>
            <p style={{
              fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b",
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px",
            }}>
              Por que o GrúaOS
            </p>
            <h2 style={{
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 900, letterSpacing: "-1px", maxWidth: "500px",
            }}>
              Feito para quem opera no campo.
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "32px",
          }}>
            {[
              { icon: "📱", title: "Mobile-first", desc: "Use na obra, no escritório ou em qualquer lugar. Interface pensada para o celular." },
              { icon: "⚡", title: "Rápido e leve", desc: "Sem instalação, sem travamento. Acessa pelo navegador em qualquer dispositivo." },
              { icon: "💬", title: "WhatsApp integrado", desc: "Envie cotações, OS e faturas pelo WhatsApp com 1 clique. Seus clientes adoram." },
              { icon: "🔒", title: "Isolamento total", desc: "Cada empresa vê apenas seus próprios dados. Segurança e privacidade garantidas." },
              { icon: "🧾", title: "Fiscal automatizado", desc: "NFS-e, apuração de impostos e cobranças automáticas. Sem retrabalho burocrático." },
              { icon: "💰", title: "Preço justo", desc: "A partir de R$97/mês. Menos que um funcionário. Mais poderoso que qualquer planilha." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  fontSize: "1.2rem", flexShrink: 0,
                  width: 40, height: 40,
                  background: "#141414", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #1f1f1f",
                }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "4px", color: "#e0e0e0" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.825rem", color: "#525252", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "56px" }}>
          <p style={{
            fontSize: "0.75rem", fontWeight: 700, color: "#f59e0b",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px",
          }}>
            Planos
          </p>
          <h2 style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px",
          }}>
            Simples e transparentes.
          </h2>
          <p style={{ color: "#525252", fontSize: "0.95rem" }}>
            Sem taxa de implantação. Sem contrato anual. Cancele quando quiser.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "16px",
        }}>
          {[
            {
              name: "Pro", price: "R$97", period: "/mês",
              desc: "Para locadoras em crescimento",
              features: ["Frota ilimitada", "Cotações ilimitadas", "OS ilimitadas", "Agenda + Gantt", "Manutenção preditiva", "Faturamento integrado", "NFS-e automática", "Boleto e PIX", "WhatsApp integrado", "BI e Inteligência"],
              cta: "Testar 7 dias grátis", href: "/register?plan=pro", highlight: true,
            },
            {
              name: "Enterprise", price: "R$197", period: "/mês",
              desc: "Para grandes operações",
              features: ["Tudo do Pro", "Múltiplos usuários", "Relatórios avançados", "Export CSV/Excel", "API de integração", "Suporte prioritário", "Onboarding dedicado", "SLA garantido"],
              cta: "Falar com vendas",
              href: "https://wa.me/5534991103401?text=Olá!%20Tenho%20interesse%20no%20plano%20Enterprise%20do%20GrúaOS.",
              highlight: false,
            },
          ].map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlight ? "#111" : "#0e0e0e",
              border: `1px solid ${plan.highlight ? "#f59e0b44" : "#1c1c1c"}`,
              borderRadius: "12px", padding: "32px", position: "relative",
            }}>
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -12, left: 28,
                  background: "#f59e0b", color: "#080808",
                  padding: "3px 14px", borderRadius: "4px",
                  fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.05em",
                }}>
                  MAIS POPULAR
                </div>
              )}
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px" }}>{plan.name}</h3>
              <p style={{ fontSize: "0.8rem", color: "#525252", marginBottom: "20px" }}>{plan.desc}</p>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-1px", color: "#f0f0f0" }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: "0.85rem", color: "#525252" }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: "0.825rem", color: "#a3a3a3", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.7rem" }}>✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.href} style={{
                display: "block", textAlign: "center",
                padding: "12px", borderRadius: "6px",
                background: plan.highlight ? "#f59e0b" : "#1a1a1a",
                color: plan.highlight ? "#080808" : "#f0f0f0",
                textDecoration: "none", fontWeight: 700, fontSize: "0.875rem",
                border: plan.highlight ? "none" : "1px solid #2a2a2a",
              }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: "100px 24px", textAlign: "center",
        borderTop: "1px solid #1c1c1c", background: "#0b0b0b",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{
            width: 56, height: 56, background: "#f59e0b",
            borderRadius: "10px", margin: "0 auto 32px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem",
          }}>
            🏗️
          </div>
          <h2 style={{
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            fontWeight: 900, letterSpacing: "-1.5px",
            marginBottom: "16px", lineHeight: 1.1,
          }}>
            Sua locadora merece um sistema à altura.
          </h2>
          <p style={{
            color: "#525252", fontSize: "1rem",
            marginBottom: "40px", lineHeight: 1.6,
          }}>
            Configure em menos de 5 minutos. Comece a operar hoje mesmo.
          </p>
          <Link href="/register?plan=pro" style={{
            background: "#f59e0b", color: "#080808",
            padding: "16px 44px", borderRadius: "6px",
            textDecoration: "none", fontSize: "1rem", fontWeight: 800,
            display: "inline-block", letterSpacing: "-0.3px",
          }}>
            Testar 7 dias grátis →
          </Link>
          <p style={{ marginTop: "16px", fontSize: "0.78rem", color: "#2a2a2a" }}>
            Cartão obrigatório · Sem cobrança nos primeiros 7 dias
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "28px 40px", borderTop: "1px solid #1c1c1c",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: 28, height: 28, background: "#f59e0b",
            borderRadius: "5px", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 900, fontSize: "0.85rem", color: "#080808",
          }}>G</div>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>GrúaOS</span>
        </div>
        <p style={{ color: "#2a2a2a", fontSize: "0.78rem", margin: 0 }}>
          © {new Date().getFullYear()} GrúaOS. Todos os direitos reservados.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/login" style={{ color: "#404040", textDecoration: "none", fontSize: "0.78rem" }}>Entrar</Link>
          <a href="https://wa.me/5534991103401" style={{ color: "#404040", textDecoration: "none", fontSize: "0.78rem" }}>Suporte</a>
        </div>
      </footer>

    </main>
  );
}
