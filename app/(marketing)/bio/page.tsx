import Link from "next/link";

export default function BioPage() {
  const whatsappMsg = encodeURIComponent(
    "Olá! Vi o GrúaOS no Instagram e quero saber mais sobre o sistema para minha locadora de guindastes."
  );
  const whatsappUrl = `https://wa.me/5534991103401?text=${whatsappMsg}`;

  return (
    <main style={{
      fontFamily: "'Inter', sans-serif",
      background: "#ffffff",
      color: "#0a0a0a",
      minHeight: "100vh",
    }}>

      {/* ======= NAVBAR ======= */}
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.3rem" }}>🏗️</span>
          <span style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.5px", color: "#0a0a0a" }}>
            Grúa<span style={{ color: "#f97316" }}>OS</span>
          </span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#f97316",
            color: "white",
            padding: "8px 18px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          Falar no WhatsApp
        </a>
      </nav>

      {/* ======= HERO ======= */}
      <section style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 60%)",
        padding: "64px 24px 72px",
        textAlign: "center",
        borderBottom: "1px solid #f3f4f6",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          {/* Badge */}
          <div style={{
            display: "inline-block",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#ea580c",
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}>
            🔥 Sistema especializado em guindastes
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(2rem, 7vw, 3.2rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: "20px",
            color: "#0a0a0a",
          }}>
            Gerencie sua locadora de guindastes com{" "}
            <span style={{
              color: "#f97316",
              borderBottom: "4px solid #fed7aa",
              paddingBottom: "2px",
            }}>
              profissionalismo
            </span>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: "1.1rem",
            color: "#6b7280",
            lineHeight: 1.7,
            marginBottom: "36px",
          }}>
            Do agendamento ao faturamento — frota, OS, contratos, NFS-e e PIX
            em um sistema feito exclusivamente para locadoras de guindastes.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "400px",
            margin: "0 auto 40px",
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
                boxShadow: "0 4px 24px #25D36630",
              }}
            >
              💬 Falar com especialista agora
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
                boxShadow: "0 4px 24px #f9731630",
              }}
            >
              🚀 Começar 7 dias grátis
            </Link>
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px",
                background: "transparent",
                color: "#9ca3af",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                border: "1px solid #e5e7eb",
              }}
            >
              Já tenho conta → Entrar
            </Link>
          </div>

          {/* Números */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap",
          }}>
            {[
              { number: "7 dias", label: "grátis com cartão" },
              { number: "5 min", label: "para configurar" },
              { number: "100%", label: "mobile" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#f97316",
                  margin: 0,
                  letterSpacing: "-1px",
                }}>
                  {item.number}
                </p>
                <p style={{
                  fontSize: "0.72rem",
                  color: "#9ca3af",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= DORES ======= */}
      <section style={{
        padding: "64px 24px",
        maxWidth: "560px",
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
          fontSize: "1.6rem",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "36px",
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
          color: "#0a0a0a",
        }}>
          Isso ainda acontece na sua locadora?
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              emoji: "😤",
              dor: "Cotações perdidas no WhatsApp",
              desc: "O cliente perguntou o orçamento, você mandou, sumiu. Nunca sabe se recebeu ou ignorou.",
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
              desc: "Guindaste parou na obra. Revisão estava atrasada há meses. Prejuízo e desgaste.",
            },
            {
              emoji: "💰",
              dor: "Fim do mês sem saber quanto faturou",
              desc: "Soma nota por nota, conferência manual, horas perdidas para um número que pode estar errado.",
            },
          ].map((item) => (
            <div
              key={item.dor}
              style={{
                display: "flex",
                gap: "16px",
                background: "#ffffff",
                border: "1px solid #f3f4f6",
                borderLeft: "4px solid #fee2e2",
                borderRadius: "12px",
                padding: "18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                background: "#fff7ed",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                flexShrink: 0,
              }}>
                {item.emoji}
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.9rem", color: "#0a0a0a" }}>
                  {item.dor}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= SOLUÇÃO ======= */}
      <section style={{
        background: "#fff7ed",
        borderTop: "1px solid #fed7aa",
        borderBottom: "1px solid #fed7aa",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
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
            fontSize: "1.6rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "8px",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            color: "#0a0a0a",
          }}>
            O GrúaOS resolve tudo isso
          </h2>
          <p style={{
            fontSize: "0.9rem",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: "36px",
          }}>
            Um sistema completo feito para quem vive de guindaste
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { icon: "🏗️", title: "Gestão de Frota", desc: "Veja em tempo real quais guindastes estão livres, em operação ou em manutenção.", color: "#3b82f6" },
              { icon: "📅", title: "Agenda Inteligente", desc: "Calendário visual da sua frota. Nunca mais dois clientes no mesmo guindaste.", color: "#8b5cf6" },
              { icon: "📋", title: "Ordens de Serviço Digitais", desc: "OS gerada em 1 clique da cotação aprovada. Enviada pelo WhatsApp para o operador.", color: "#f97316" },
              { icon: "📃", title: "Contratos e Medições", desc: "Contratos por hora ou diária com medições mensais e fatura automática.", color: "#0ea5e9" },
              { icon: "🔧", title: "Manutenção Preditiva", desc: "Alertas por horímetro. Nunca mais revisão esquecida. TCO por equipamento.", color: "#ef4444" },
              { icon: "🧾", title: "NFS-e Automática", desc: "Emita nota fiscal de serviço para qualquer prefeitura do Brasil com 1 clique.", color: "#10b981" },
              { icon: "💰", title: "Boleto e PIX Integrados", desc: "Gere cobranças e receba a baixa automática quando o cliente pagar.", color: "#22c55e" },
              { icon: "🧠", title: "BI e Inteligência", desc: "Insights automáticos: equipamentos ociosos, clientes frequentes, receita vs mês anterior.", color: "#f59e0b" },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: "14px",
                  background: "#ffffff",
                  border: "1px solid #f3f4f6",
                  borderLeft: `4px solid ${item.color}`,
                  borderRadius: "12px",
                  padding: "16px",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  background: item.color + "15",
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
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.9rem", color: "#0a0a0a" }}>
                    {item.title}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af", lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= COMPARATIVO ======= */}
      <section style={{ padding: "64px 24px", maxWidth: "560px", margin: "0 auto" }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 900,
          textAlign: "center",
          marginBottom: "32px",
          letterSpacing: "-0.5px",
          color: "#0a0a0a",
        }}>
          Planilha vs GrúaOS
        </h2>

        <div style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}>
            <div style={{ padding: "14px 16px", fontSize: "0.8rem", color: "#9ca3af", fontWeight: 600 }}>Recurso</div>
            <div style={{ padding: "14px", fontSize: "0.8rem", color: "#ef4444", fontWeight: 700, textAlign: "center" }}>Planilha</div>
            <div style={{ padding: "14px", fontSize: "0.8rem", color: "#f97316", fontWeight: 700, textAlign: "center" }}>GrúaOS</div>
          </div>
          {[
            "Disponibilidade em tempo real",
            "OS digital com 1 clique",
            "Envio por WhatsApp",
            "Manutenção preditiva",
            "NFS-e automática",
            "Boleto e PIX integrados",
            "Acesso pelo celular",
            "Alertas automáticos",
          ].map((item, i) => (
            <div
              key={item}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                borderBottom: i < 7 ? "1px solid #f3f4f6" : "none",
                alignItems: "center",
              }}
            >
              <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#6b7280" }}>{item}</div>
              <div style={{ padding: "12px", textAlign: "center" }}>❌</div>
              <div style={{ padding: "12px", textAlign: "center" }}>✅</div>
            </div>
          ))}
        </div>
      </section>

      {/* ======= DEPOIMENTOS ======= */}
      <section style={{
        background: "#f9fafb",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <p style={{
            fontSize: "0.75rem",
            color: "#f97316",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "center",
            marginBottom: "12px",
          }}>
            Depoimentos
          </p>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "36px",
            letterSpacing: "-0.5px",
            color: "#0a0a0a",
          }}>
            O que dizem os clientes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                rating: "⭐⭐⭐⭐⭐",
                text: "Antes eu controlava tudo no WhatsApp e em planilha. Hoje sei exatamente quais guindastes estão livres e faturei 30% mais no primeiro mês usando o GrúaOS.",
                name: "Carlos M.",
                role: "Locadora de guindastes, MG",
              },
              {
                rating: "⭐⭐⭐⭐⭐",
                text: "O sistema é muito simples e funciona no celular. Configurei em menos de 5 minutos e já estava emitindo OS digital. Não erro mais na agenda.",
                name: "Roberto S.",
                role: "Operador e proprietário, SP",
              },
              {
                rating: "⭐⭐⭐⭐⭐",
                text: "O módulo de manutenção preditiva me salvou. O sistema avisou que a revisão estava vencendo antes de eu esquecer. Nunca mais vou perder equipamento parado na obra.",
                name: "Marcos F.",
                role: "Locadora de guindastes, RJ",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "14px",
                  padding: "20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <p style={{ margin: "0 0 4px", fontSize: "0.9rem" }}>{item.rating} 5/5</p>
                <p style={{
                  margin: "0 0 14px",
                  fontSize: "0.875rem",
                  color: "#374151",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}>
                  "{item.text}"
                </p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#0a0a0a" }}>
                  — {item.name}
                </p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= PLANOS ======= */}
      <section style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
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
            fontSize: "1.5rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "8px",
            letterSpacing: "-0.5px",
            color: "#0a0a0a",
          }}>
            Preço justo, sem surpresa
          </h2>
          <p style={{
            fontSize: "0.875rem",
            color: "#9ca3af",
            textAlign: "center",
            marginBottom: "36px",
          }}>
            7 dias grátis com cartão · Cancele quando quiser
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                name: "Free",
                price: "Grátis",
                desc: "1 guindaste · 10 OS por mês · Dashboard básico",
                highlight: false,
                href: "/login",
                cta: "Começar grátis",
              },
              {
                name: "Pro",
                price: "R$ 97",
                desc: "Frota ilimitada · OS, Contratos, NFS-e, PIX, BI",
                highlight: true,
                href: "/checkout?plan=pro",
                cta: "Começar 7 dias grátis",
                badge: "MAIS POPULAR",
              },
              {
                name: "Enterprise",
                price: "R$ 197",
                desc: "Tudo do Pro · Múltiplos usuários · Suporte prioritário",
                highlight: false,
                href: "/checkout?plan=enterprise",
                cta: "Começar 7 dias grátis",
              },
            ].map((plan) => (
              <a
                key={plan.name}
                href={plan.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  background: plan.highlight ? "#f97316" : "#ffffff",
                  border: `2px solid ${plan.highlight ? "#f97316" : "#e5e7eb"}`,
                  borderRadius: "14px",
                  textDecoration: "none",
                  gap: "12px",
                  boxShadow: plan.highlight ? "0 8px 32px #f9731630" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div>
                  <p style={{
                    margin: "0 0 3px",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: plan.highlight ? "white" : "#0a0a0a",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}>
                    {plan.name}
                    {plan.badge && (
                      <span style={{
                        background: "white",
                        color: "#f97316",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "999px",
                      }}>
                        {plan.badge}
                      </span>
                    )}
                  </p>
                  <p style={{
                    margin: "0 0 8px",
                    fontSize: "0.78rem",
                    color: plan.highlight ? "#fed7aa" : "#9ca3af",
                  }}>
                    {plan.desc}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: plan.highlight ? "#fff7ed" : "#f97316",
                  }}>
                    {plan.cta} →
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{
                    margin: 0,
                    fontWeight: 900,
                    fontSize: "1.4rem",
                    color: plan.highlight ? "white" : "#0a0a0a",
                    letterSpacing: "-1px",
                  }}>
                    {plan.price}
                  </p>
                  {plan.price !== "Grátis" && (
                    <p style={{
                      margin: 0,
                      fontSize: "0.7rem",
                      color: plan.highlight ? "#fed7aa" : "#9ca3af",
                    }}>
                      /mês
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FAQ ======= */}
      <section style={{
        background: "#f9fafb",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 900,
            textAlign: "center",
            marginBottom: "36px",
            letterSpacing: "-0.5px",
            color: "#0a0a0a",
          }}>
            Perguntas Frequentes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { q: "Precisa instalar alguma coisa?", a: "Não. O GrúaOS funciona direto no navegador do celular ou computador. Sem download, sem instalação." },
              { q: "Como funciona o teste grátis?", a: "7 dias com acesso completo. Cartão obrigatório, mas não há cobrança durante o período de teste. Cancele antes do 8º dia e não paga nada." },
              { q: "É difícil de configurar?", a: "Não. Em menos de 5 minutos você cadastra sua empresa, adiciona os equipamentos e já começa a usar." },
              { q: "Funciona no celular?", a: "100%. O GrúaOS foi desenvolvido mobile-first. Funciona perfeitamente em qualquer smartphone." },
              { q: "Posso cancelar quando quiser?", a: "Sim. Sem fidelidade, sem multa. Cancele a qualquer momento direto pelo painel." },
              { q: "O GrúaOS emite nota fiscal?", a: "Sim. O sistema emite NFS-e automaticamente para qualquer prefeitura do Brasil, integrado ao NFE.io." },
            ].map((item) => (
              <div
                key={item.q}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "0.875rem", color: "#0a0a0a" }}>
                  {item.q}
                </p>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA FINAL ======= */}
      <section style={{
        background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)",
        borderTop: "1px solid #fed7aa",
        padding: "64px 24px 80px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "440px", margin: "0 auto" }}>
          <span style={{ fontSize: "3rem" }}>🏗️</span>
          <h2 style={{
            fontSize: "1.7rem",
            fontWeight: 900,
            margin: "16px 0 12px",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            color: "#0a0a0a",
          }}>
            Sua locadora merece um sistema profissional
          </h2>
          <p style={{
            fontSize: "0.95rem",
            color: "#6b7280",
            marginBottom: "32px",
            lineHeight: 1.7,
          }}>
            7 dias grátis com cartão. Configure em 5 minutos e comece hoje.
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
                boxShadow: "0 4px 24px #25D36630",
              }}
            >
              💬 Falar com especialista no WhatsApp
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
                boxShadow: "0 4px 24px #f9731630",
              }}
            >
              🚀 Começar 7 dias grátis agora
            </Link>
          </div>

          <div style={{
            marginTop: "24px",
            padding: "14px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "0.78rem",
            color: "#9ca3af",
            lineHeight: 1.6,
          }}>
            🔒 Pagamento seguro via Stripe · Cancele quando quiser · Seus dados sempre seguros
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer style={{
        padding: "32px 24px",
        borderTop: "1px solid #e5e7eb",
        textAlign: "center",
        background: "#ffffff",
      }}>
        <p style={{
          fontSize: "0.9rem",
          fontWeight: 900,
          margin: "0 0 4px",
          letterSpacing: "-0.3px",
          color: "#0a0a0a",
        }}>
          Grúa<span style={{ color: "#f97316" }}>OS</span>
        </p>
        <p style={{ fontSize: "0.72rem", color: "#9ca3af", margin: "0 0 14px" }}>
          © {new Date().getFullYear()} · Todos os direitos reservados
        </p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          <a href="https://instagram.com/gruaossolucoes" target="_blank" rel="noopener noreferrer"
            style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.78rem" }}>
            @gruaossolucoes
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.78rem" }}>
            Suporte
          </a>
          <Link href="/login"
            style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.78rem" }}>
            Entrar
          </Link>
        </div>
      </footer>

    </main>
  );
}
