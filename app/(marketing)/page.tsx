import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{
      fontFamily: "Inter, sans-serif",
      background: "#0a0a0a",
      color: "#f5f5f5",
      minHeight: "100vh",
    }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid #1f1f1f",
        position: "sticky",
        top: 0,
        background: "#0a0a0a",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36,
            height: 36,
            background: "#f97316",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "1.1rem",
            color: "white",
          }}>G</div>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
            GrúaOS
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/login" style={{
            color: "#a3a3a3",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}>
            Entrar
          </Link>
          <Link href="/register" style={{
            background: "#f97316",
            color: "white",
            padding: "8px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}>
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        textAlign: "center",
        padding: "100px 24px 80px",
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "inline-block",
          background: "#f9731622",
          border: "1px solid #f9731644",
          color: "#f97316",
          padding: "6px 16px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: 600,
          marginBottom: "24px",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          ERP para locadoras de guindastes
        </div>

        <h1 style={{
          fontSize: "clamp(2.2rem, 6vw, 4rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: "24px",
          letterSpacing: "-1.5px",
        }}>
          Gerencie sua frota de{" "}
          <span style={{ color: "#f97316" }}>guindastes</span>{" "}
          do agendamento ao faturamento
        </h1>

        <p style={{
          fontSize: "1.15rem",
          color: "#a3a3a3",
          lineHeight: 1.7,
          marginBottom: "40px",
          maxWidth: "600px",
          margin: "0 auto 40px",
        }}>
          Frota, agenda, ordens de serviço, manutenção e faturas em um só lugar.
          Mais simples que planilha. Mais poderoso que qualquer ERP pesado.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{
            background: "#f97316",
            color: "white",
            padding: "14px 32px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "1rem",
            fontWeight: 700,
          }}>
            Começar grátis →
          </Link>
          <Link href="/login" style={{
            background: "#1a1a1a",
            color: "#f5f5f5",
            padding: "14px 32px",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "1rem",
            fontWeight: 600,
            border: "1px solid #333",
          }}>
            Já tenho conta
          </Link>
        </div>

        <p style={{
          marginTop: "24px",
          fontSize: "0.8rem",
          color: "#525252",
        }}>
          Sem cartão de crédito · Setup em 5 minutos · Cancele quando quiser
        </p>
      </section>

      {/* MÓDULOS */}
      <section style={{
        padding: "80px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
          fontWeight: 800,
          marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}>
          Tudo que sua locadora precisa
        </h2>
        <p style={{
          textAlign: "center",
          color: "#a3a3a3",
          marginBottom: "56px",
          fontSize: "1rem",
        }}>
          Módulos integrados que funcionam juntos do primeiro ao último passo
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {[
            {
              icon: "🏗️",
              title: "Gestão de Frota",
              desc: "Cadastre guindastes com fotos, especificações técnicas, documentos e acompanhe o status em tempo real.",
              color: "#3b82f6",
            },
            {
              icon: "📅",
              title: "Agenda / Calendário",
              desc: "Visualize a disponibilidade de toda a frota no calendário Gantt. Evite conflitos e maximize a ocupação.",
              color: "#8b5cf6",
            },
            {
              icon: "📋",
              title: "Ordens de Serviço",
              desc: "Gere OS diretamente das cotações aprovadas. Controle operadores, endereços e status em tempo real.",
              color: "#f97316",
            },
            {
              icon: "🔧",
              title: "Manutenção",
              desc: "Registre preventivas, corretivas e inspeções. Histórico completo por equipamento com controle de custos.",
              color: "#ef4444",
            },
            {
              icon: "💰",
              title: "Faturamento",
              desc: "Gere faturas a partir das OS concluídas. Controle o que foi pago, enviado e vencido. Envie por WhatsApp.",
              color: "#22c55e",
            },
            {
              icon: "📊",
              title: "Dashboard",
              desc: "KPIs em tempo real: taxa de ocupação da frota, receita do mês, OS ativas e alertas automáticos.",
              color: "#f59e0b",
            },
          ].map((item) => (
            <div key={item.title} style={{
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: "14px",
              padding: "28px",
            }}>
              <div style={{
                fontSize: "2rem",
                marginBottom: "16px",
                width: 52,
                height: 52,
                background: item.color + "22",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                marginBottom: "8px",
                color: "#f5f5f5",
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: "0.875rem",
                color: "#737373",
                lineHeight: 1.6,
                margin: 0,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{
        padding: "80px 24px",
        background: "#111",
        borderTop: "1px solid #1f1f1f",
        borderBottom: "1px solid #1f1f1f",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 800,
            marginBottom: "48px",
            letterSpacing: "-0.5px",
          }}>
            Por que o GrúaOS?
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "32px",
          }}>
            {[
              {
                icon: "⚡",
                title: "Leve e rápido",
                desc: "Nada de ERPs pesados que travam. O GrúaOS é rápido no desktop e no celular.",
              },
              {
                icon: "📱",
                title: "Mobile-first",
                desc: "Funciona perfeitamente no celular. Use na obra, no escritório ou em qualquer lugar.",
              },
              {
                icon: "💬",
                title: "WhatsApp integrado",
                desc: "Envie cotações, OS e faturas pelo WhatsApp com 1 clique. Seus clientes adoram.",
              },
              {
                icon: "🔒",
                title: "Seus dados, sua empresa",
                desc: "Cada empresa vê apenas seus próprios dados. Segurança total com isolamento por conta.",
              },
              {
                icon: "💰",
                title: "Preço justo",
                desc: "A partir de R$97/mês. Menos que uma planilha customizada e infinitamente mais poderoso.",
              },
              {
                icon: "🚀",
                title: "Setup em minutos",
                desc: "Cadastre sua empresa, adicione os equipamentos e comece a operar no mesmo dia.",
              },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  fontSize: "1.5rem",
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  background: "#1a1a1a",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "4px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#737373", lineHeight: 1.6, margin: 0 }}>
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
        <h2 style={{
          textAlign: "center",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 800,
          marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}>
          Planos simples e transparentes
        </h2>
        <p style={{
          textAlign: "center",
          color: "#a3a3a3",
          marginBottom: "48px",
        }}>
          Sem taxa de implantação. Sem contrato anual. Cancele quando quiser.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}>
          {[
            {
              name: "Free",
              price: "R$0",
              period: "/mês",
              desc: "Para experimentar",
              features: [
                "10 cotações/mês",
                "1 equipamento",
                "1 usuário",
                "Dashboard básico",
              ],
              cta: "Começar grátis",
              highlight: false,
            },
            {
              name: "Starter",
              price: "R$97",
              period: "/mês",
              desc: "Para começar",
              features: [
                "Até 3 equipamentos",
                "50 cotações/mês",
                "Agenda básica",
                "OS (10/mês)",
                "1 usuário",
                "PDF com sua marca",
              ],
              cta: "Assinar Starter",
              highlight: false,
            },
            {
              name: "Pro",
              price: "R$197",
              period: "/mês",
              desc: "Para crescer",
              features: [
                "Frota ilimitada",
                "Cotações ilimitadas",
                "Agenda + Gantt",
                "OS ilimitadas",
                "Manutenção completa",
                "Faturamento",
                "Dashboard completo",
                "3 usuários",
                "WhatsApp integrado",
              ],
              cta: "Assinar Pro",
              highlight: true,
            },
            {
              name: "Business",
              price: "R$347",
              period: "/mês",
              desc: "Para grandes operações",
              features: [
                "Tudo do Pro",
                "10 usuários",
                "Relatórios avançados",
                "Export CSV/Excel",
                "API de integração",
                "Suporte prioritário",
                "Onboarding dedicado",
              ],
              cta: "Falar com vendas",
              highlight: false,
            },
          ].map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlight ? "#f97316" : "#111",
              border: `1px solid ${plan.highlight ? "#f97316" : "#1f1f1f"}`,
              borderRadius: "16px",
              padding: "28px",
              position: "relative",
            }}>
              {plan.highlight && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  color: "#f97316",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                }}>
                  MAIS POPULAR
                </div>
              )}
              <h3 style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "4px",
                color: plan.highlight ? "white" : "#f5f5f5",
              }}>
                {plan.name}
              </h3>
              <p style={{
                fontSize: "0.8rem",
                color: plan.highlight ? "#fed7aa" : "#737373",
                marginBottom: "16px",
              }}>
                {plan.desc}
              </p>
              <div style={{ marginBottom: "20px" }}>
                <span style={{
                  fontSize: "2.2rem",
                  fontWeight: 900,
                  color: plan.highlight ? "white" : "#f5f5f5",
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: "0.85rem",
                  color: plan.highlight ? "#fed7aa" : "#737373",
                }}>
                  {plan.period}
                </span>
              </div>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 24px",
                display: "flex",
                flexDirection: "column",
                gap: "7px",
              }}>
                {plan.features.map((f) => (
                  <li key={f} style={{
                    fontSize: "0.82rem",
                    color: plan.highlight ? "#fff7ed" : "#a3a3a3",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                  }}>
                    <span style={{ color: plan.highlight ? "white" : "#22c55e", fontWeight: 700 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{
                display: "block",
                textAlign: "center",
                padding: "11px",
                borderRadius: "8px",
                background: plan.highlight ? "white" : "#1a1a1a",
                color: plan.highlight ? "#f97316" : "#f5f5f5",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                border: plan.highlight ? "none" : "1px solid #333",
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{
        padding: "80px 24px",
        textAlign: "center",
        background: "#111",
        borderTop: "1px solid #1f1f1f",
      }}>
        <h2 style={{
          fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
          fontWeight: 900,
          marginBottom: "16px",
          letterSpacing: "-1px",
        }}>
          Pronto para modernizar sua locadora?
        </h2>
        <p style={{
          color: "#a3a3a3",
          fontSize: "1rem",
          marginBottom: "36px",
          maxWidth: "500px",
          margin: "0 auto 36px",
        }}>
          Comece grátis hoje. Sem cartão de crédito. Configure em menos de 5 minutos.
        </p>
        <Link href="/register" style={{
          background: "#f97316",
          color: "white",
          padding: "16px 40px",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "1.05rem",
          fontWeight: 700,
          display: "inline-block",
        }}>
          Criar conta grátis →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: "32px 40px",
        borderTop: "1px solid #1f1f1f",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: 28,
            height: 28,
            background: "#f97316",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "0.9rem",
            color: "white",
          }}>G</div>
          <span style={{ fontWeight: 700, color: "#f5f5f5" }}>GrúaOS</span>
        </div>
        <p style={{ color: "#525252", fontSize: "0.8rem", margin: 0 }}>
          © {new Date().getFullYear()} GrúaOS. Todos os direitos reservados.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/login" style={{ color: "#525252", textDecoration: "none", fontSize: "0.8rem" }}>
            Entrar
          </Link>
          <Link href="/register" style={{ color: "#525252", textDecoration: "none", fontSize: "0.8rem" }}>
            Cadastrar
          </Link>
        </div>
      </footer>

    </main>
  );
}
