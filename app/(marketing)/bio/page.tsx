import Link from "next/link";
import SocialProofNotification from "@/components/SocialProofNotification";

export default function BioPage() {
  const whatsappMsg = encodeURIComponent(
    "Olá! Vi o GrúaOS no Instagram e quero saber mais sobre o sistema para minha locadora de guindastes."
  );
  const whatsappUrl = `https://wa.me/5534991103401?text=${whatsappMsg}`;

  return (
    <main style={{
      fontFamily: "Inter, sans-serif",
      background: "#0a0a0a",
      color: "#f5f5f5",
      minHeight: "100vh",
    }}>
      <SocialProofNotification />

      {/* ======= HERO ======= */}
      <section style={{
        background: "linear-gradient(180deg, #0d1a2e 0%, #0a0a0a 100%)",
        padding: "48px 24px 56px",
        textAlign: "center",
        borderBottom: "1px solid #1f1f1f",
      }}>
        {/* Logo */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "28px",
          background: "#ffffff0a",
          border: "1px solid #ffffff11",
          padding: "8px 16px",
          borderRadius: "20px",
        }}>
          <span style={{ fontSize: "1.2rem" }}>🏗️</span>
          <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.5px" }}>
            Grúa<span style={{ color: "#f97316" }}>OS</span>
          </span>
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-block",
          background: "#f9731615",
          border: "1px solid #f9731640",
          color: "#f97316",
          padding: "5px 14px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "20px",
        }}>
          🔥 7 dias grátis · sem cartão
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(1.8rem, 7vw, 2.8rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-1px",
          marginBottom: "16px",
          maxWidth: "480px",
          margin: "0 auto 16px",
        }}>
          Sua locadora no{" "}
          <span style={{
            color: "#f97316",
            borderBottom: "3px solid #f97316",
            paddingBottom: "2px",
          }}>
            próximo nível
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: "1.05rem",
          color: "#a3a3a3",
          lineHeight: 1.7,
          maxWidth: "400px",
          margin: "0 auto 32px",
        }}>
          Do agendamento ao faturamento — tudo em um sistema
          feito exclusivamente para locadoras de guindastes.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "400px",
          margin: "0 auto",
        }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "17px",
              background: "#25D366",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "1rem",
              boxShadow: "0 4px 20px #25D36640",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>💬</span>
            Falar com especialista agora
          </a>

          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "17px",
              background: "#f97316",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "1rem",
              boxShadow: "0 4px 20px #f9731640",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🚀</span>
            Começar teste grátis
          </Link>

          <Link
            href="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px",
              background: "transparent",
              color: "#525252",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "1px solid #1f1f1f",
            }}
          >
            Já tenho conta → Entrar
          </Link>
        </div>

        {/* Números */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          marginTop: "36px",
          flexWrap: "wrap",
        }}>
          {[
            { number: "7 dias", label: "grátis" },
            { number: "5 min", label: "pra configurar" },
            { number: "100%", label: "mobile" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <p style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "#f97316",
                margin: 0,
                letterSpacing: "-0.5px",
              }}>
                {item.number}
              </p>
              <p style={{
                fontSize: "0.75rem",
                color: "#525252",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= DORES ======= */}
      <section style={{
        padding: "48px 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <p style={{
          fontSize: "0.75rem",
          color: "#f97316",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          textAlign: "center",
          marginBottom: "12px",
        }}>
          Você se identifica?
        </p>
        <h2 style={{
          fontSize: "1.4rem",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "28px",
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
        }}>
          Isso ainda acontece na sua locadora?
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              emoji: "😤",
              dor: "Cotações perdidas no WhatsApp",
              desc: "O cliente perguntou o orçamento, você mandou, sumiu. Você nunca sabe se ele recebeu ou ignorou.",
            },
            {
              emoji: "📊",
              dor: "Planilha desatualizada todo dia",
              desc: "Cada pessoa salva uma versão diferente. Ninguém sabe qual é a certa. Decisão no chute.",
            },
            {
              emoji: "🏗️",
              dor: "Não sabe quais guindastes estão livres",
              desc: "Cliente liga pedindo disponibilidade. Você precisa ligar para 3 pessoas para descobrir.",
            },
            {
              emoji: "🔧",
              dor: "Manutenção esquecida até a máquina quebrar",
              desc: "Guindaste parou na obra do cliente. Revisão estava atrasada há meses. Prejuízo e desgaste.",
            },
            {
              emoji: "💰",
              dor: "Fim do mês e você não sabe quanto faturou",
              desc: "Soma nota por nota, conferência manual, horas perdidas para um número que pode estar errado.",
            },
          ].map((item) => (
            <div
              key={item.dor}
              style={{
                display: "flex",
                gap: "14px",
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                background: "#1a1a1a",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                flexShrink: 0,
              }}>
                {item.emoji}
              </div>
              <div>
                <p style={{
                  margin: "0 0 4px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#f5f5f5",
                }}>
                  {item.dor}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#737373",
                  lineHeight: 1.5,
                }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= SOLUÇÃO ======= */}
      <section style={{
        background: "#0d1a2e",
        borderTop: "1px solid #1a2744",
        borderBottom: "1px solid #1a2744",
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <p style={{
            fontSize: "0.75rem",
            color: "#f97316",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "center",
            marginBottom: "12px",
          }}>
            A solução
          </p>
          <h2 style={{
            fontSize: "1.4rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "8px",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}>
            O GrúaOS resolve tudo isso
          </h2>
          <p style={{
            fontSize: "0.875rem",
            color: "#737373",
            textAlign: "center",
            marginBottom: "28px",
          }}>
            Um sistema completo feito para quem vive de guindaste
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                icon: "🏗️",
                title: "Gestão de Frota",
                desc: "Veja em tempo real quais guindastes estão livres, em operação ou em manutenção.",
                color: "#3b82f6",
              },
              {
                icon: "📅",
                title: "Agenda Inteligente",
                desc: "Calendário visual da sua frota. Nunca mais dois clientes no mesmo guindaste.",
                color: "#8b5cf6",
              },
              {
                icon: "📋",
                title: "Ordens de Serviço Digitais",
                desc: "OS gerada em 1 clique da cotação aprovada. Enviada pelo WhatsApp para o operador.",
                color: "#f97316",
              },
              {
                icon: "🔧",
                title: "Controle de Manutenção",
                desc: "Histórico completo por equipamento. Nunca mais revisão esquecida.",
                color: "#ef4444",
              },
              {
                icon: "💰",
                title: "Faturamento Integrado",
                desc: "Gere a fatura da OS com 1 clique. Envie pelo WhatsApp. Controle o que foi pago.",
                color: "#22c55e",
              },
              {
                icon: "📊",
                title: "Dashboard Completo",
                desc: "Receita do mês, ocupação da frota e alertas — tudo em uma tela só.",
                color: "#f59e0b",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: "14px",
                  background: "#0a0a0a",
                  border: "1px solid #1a2744",
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: "12px",
                  padding: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  background: item.color + "22",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{
                    margin: "0 0 4px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#f5f5f5",
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "#737373",
                    lineHeight: 1.5,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= COMPARATIVO ======= */}
      <section style={{
        padding: "48px 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: "1.3rem",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "24px",
          lineHeight: 1.2,
        }}>
          Planilha vs GrúaOS
        </h2>

        <div style={{
          background: "#111",
          border: "1px solid #1f1f1f",
          borderRadius: "14px",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            background: "#1a1a1a",
            borderBottom: "1px solid #1f1f1f",
          }}>
            <div style={{ padding: "12px 16px", fontSize: "0.8rem", color: "#525252", fontWeight: 600 }}>
              Recurso
            </div>
            <div style={{
              padding: "12px",
              fontSize: "0.8rem",
              color: "#ef4444",
              fontWeight: 700,
              textAlign: "center",
            }}>
              Planilha
            </div>
            <div style={{
              padding: "12px",
              fontSize: "0.8rem",
              color: "#f97316",
              fontWeight: 700,
              textAlign: "center",
            }}>
              GrúaOS
            </div>
          </div>

          {[
            "Disponibilidade em tempo real",
            "OS digital com 1 clique",
            "Envio por WhatsApp",
            "Histórico de manutenção",
            "Faturamento integrado",
            "Dashboard de receita",
            "Acesso pelo celular",
            "Alertas automáticos",
          ].map((item, i) => (
            <div
              key={item}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: i < 7 ? "1px solid #1a1a1a" : "none",
                alignItems: "center",
              }}
            >
              <div style={{
                padding: "11px 16px",
                fontSize: "0.78rem",
                color: "#a3a3a3",
              }}>
                {item}
              </div>
              <div style={{
                padding: "11px",
                textAlign: "center",
                fontSize: "1rem",
              }}>
                ❌
              </div>
              <div style={{
                padding: "11px",
                textAlign: "center",
                fontSize: "1rem",
              }}>
                ✅
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= PLANOS ======= */}
      <section style={{
        background: "#0d1a2e",
        borderTop: "1px solid #1a2744",
        borderBottom: "1px solid #1a2744",
        padding: "48px 24px",
      }}>
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <p style={{
            fontSize: "0.75rem",
            color: "#f97316",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "center",
            marginBottom: "12px",
          }}>
            Planos
          </p>
          <h2 style={{
            fontSize: "1.4rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "8px",
          }}>
            Preço justo, sem surpresa
          </h2>
          <p style={{
            fontSize: "0.85rem",
            color: "#737373",
            textAlign: "center",
            marginBottom: "28px",
          }}>
            Sem contrato anual · Cancele quando quiser
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                name: "Starter",
                price: "R$97",
                desc: "Até 3 equipamentos · 1 usuário · OS básica",
                highlight: false,
                href: "/checkout?plan=starter",
              },
              {
                name: "Pro",
                price: "R$197",
                desc: "Frota ilimitada · 3 usuários · Tudo incluído",
                highlight: true,
                href: "/checkout?plan=pro",
              },
              {
                name: "Business",
                price: "R$347",
                desc: "10 usuários · API · Suporte prioritário",
                highlight: false,
                href: whatsappUrl,
              },
            ].map((plan) => (
              <a
                key={plan.name}
                href={plan.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: plan.highlight ? "#f97316" : "#0a0a0a",
                  border: `1px solid ${plan.highlight ? "#f97316" : "#1a2744"}`,
                  borderRadius: "12px",
                  textDecoration: "none",
                  gap: "12px",
                }}
              >
                <div>
                  <p style={{
                    margin: "0 0 3px",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "white",
                  }}>
                    {plan.name}
                    {plan.highlight && (
                      <span style={{
                        marginLeft: "8px",
                        background: "white",
                        color: "#f97316",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        verticalAlign: "middle",
                      }}>
                        POPULAR
                      </span>
                    )}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: plan.highlight ? "#fed7aa" : "#737373",
                  }}>
                    {plan.desc}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    margin: 0,
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    color: "white",
                  }}>
                    {plan.price}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "0.7rem",
                    color: plan.highlight ? "#fed7aa" : "#525252",
                  }}>
                    /mês
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FAQ ======= */}
      <section style={{
        padding: "48px 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: "1.3rem",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "24px",
        }}>
          Perguntas frequentes
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            {
              q: "Precisa instalar alguma coisa?",
              a: "Não. O GrúaOS funciona direto no navegador do celular ou computador. Sem download, sem instalação.",
            },
            {
              q: "Meus dados ficam salvos se eu cancelar?",
              a: "Sim. Todos os seus dados ficam salvos por 30 dias após o cancelamento. Você pode exportar tudo.",
            },
            {
              q: "É difícil de configurar?",
              a: "Não. Em menos de 5 minutos você cadastra sua empresa, adiciona os equipamentos e já começa a usar.",
            },
            {
              q: "Funciona no celular?",
              a: "100%. O GrúaOS foi desenvolvido mobile-first. Funciona perfeitamente em qualquer smartphone.",
            },
            {
              q: "Como funciona o teste grátis?",
              a: "7 dias com acesso completo a todas as funcionalidades. Sem cartão de crédito. Sem compromisso.",
            },
          ].map((item) => (
            <div
              key={item.q}
              style={{
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <p style={{
                margin: "0 0 6px",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#f5f5f5",
              }}>
                {item.q}
              </p>
              <p style={{
                margin: 0,
                fontSize: "0.8rem",
                color: "#737373",
                lineHeight: 1.6,
              }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ======= CTA FINAL ======= */}
      <section style={{
        background: "linear-gradient(180deg, #0d1a2e 0%, #0a0a0a 100%)",
        borderTop: "1px solid #1a2744",
        padding: "48px 24px 60px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <span style={{ fontSize: "2.5rem" }}>🏗️</span>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            margin: "16px 0 12px",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}>
            Sua locadora merece um sistema profissional
          </h2>
          <p style={{
            fontSize: "0.9rem",
            color: "#a3a3a3",
            marginBottom: "28px",
            lineHeight: 1.6,
          }}>
            7 dias grátis. Sem cartão. Sem burocracia.
            Configure em 5 minutos e comece hoje.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "17px",
                background: "#25D366",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: "0 4px 20px #25D36640",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>💬</span>
              Falar com especialista no WhatsApp
            </a>

            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "17px",
                background: "#f97316",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: "0 4px 20px #f9731640",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🚀</span>
              Começar teste grátis agora
            </Link>
          </div>

          {/* Garantia */}
          <div style={{
            marginTop: "24px",
            padding: "14px",
            background: "#ffffff05",
            border: "1px solid #1f1f1f",
            borderRadius: "10px",
            fontSize: "0.78rem",
            color: "#525252",
            lineHeight: 1.6,
          }}>
            🔒 Pagamento seguro via Mercado Pago · Cancele quando quiser · Seus dados sempre seguros
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer style={{
        padding: "24px",
        borderTop: "1px solid #1f1f1f",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "0.8rem",
          fontWeight: 800,
          margin: "0 0 4px",
          letterSpacing: "-0.3px",
        }}>
          Grúa<span style={{ color: "#f97316" }}>OS</span>
        </p>
        <p style={{ fontSize: "0.72rem", color: "#525252", margin: "0 0 10px" }}>
          © {new Date().getFullYear()} · Todos os direitos reservados
        </p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <a
            href="https://instagram.com/gruaossolucoes"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#525252", textDecoration: "none", fontSize: "0.75rem" }}
          >
            @gruaossolucoes
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#525252", textDecoration: "none", fontSize: "0.75rem" }}
          >
            Suporte
          </a>
          <Link
            href="/login"
            style={{ color: "#525252", textDecoration: "none", fontSize: "0.75rem" }}
          >
            Entrar
          </Link>
        </div>
      </footer>

    </main>
  );
}
