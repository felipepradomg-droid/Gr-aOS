import Link from "next/link";

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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 24px 60px",
      maxWidth: "480px",
      margin: "0 auto",
    }}>

      {/* Logo */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "32px",
      }}>
        <div style={{
          width: 72,
          height: 72,
          background: "#1a2744",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.2rem",
          marginBottom: "12px",
          border: "2px solid #f9731633",
        }}>
          🏗️
        </div>
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: 900,
          letterSpacing: "-1px",
          margin: 0,
        }}>
          Grúa<span style={{ color: "#f97316" }}>OS</span>
        </h1>
        <p style={{
          fontSize: "0.85rem",
          color: "#737373",
          marginTop: "4px",
          textAlign: "center",
        }}>
          ERP para locadoras de guindastes
        </p>
      </div>

      {/* Headline */}
      <div style={{
        textAlign: "center",
        marginBottom: "32px",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 900,
          lineHeight: 1.2,
          letterSpacing: "-0.5px",
          marginBottom: "12px",
        }}>
          Gerencie sua frota do{" "}
          <span style={{ color: "#f97316" }}>agendamento</span>{" "}
          ao faturamento
        </h2>
        <p style={{
          fontSize: "0.95rem",
          color: "#a3a3a3",
          lineHeight: 1.7,
          margin: 0,
        }}>
          Chega de planilha e WhatsApp para gerenciar guindaste.
          O GrúaOS coloca tudo em um só lugar.
        </p>
      </div>

      {/* Benefícios */}
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "36px",
      }}>
        {[
          { icon: "🏗️", text: "Frota completa com status em tempo real" },
          { icon: "📅", text: "Agenda e calendário de disponibilidade" },
          { icon: "📋", text: "Ordens de Serviço digitais e automáticas" },
          { icon: "🔧", text: "Histórico de manutenção por equipamento" },
          { icon: "💰", text: "Faturamento integrado com envio por WhatsApp" },
          { icon: "📊", text: "Dashboard com KPIs da sua operação" },
        ].map((item) => (
          <div
            key={item.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: "12px",
              padding: "14px 16px",
            }}
          >
            <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>
              {item.icon}
            </span>
            <span style={{
              fontSize: "0.875rem",
              color: "#d4d4d4",
              fontWeight: 500,
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Trial badge */}
      <div style={{
        background: "#f9731611",
        border: "1px solid #f9731633",
        borderRadius: "20px",
        padding: "8px 20px",
        marginBottom: "28px",
        fontSize: "0.85rem",
        color: "#f97316",
        fontWeight: 600,
        textAlign: "center",
      }}>
        ✅ 7 dias grátis · Sem cartão de crédito
      </div>

      {/* CTAs */}
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "32px",
      }}>
        {/* WhatsApp - CTA principal */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "16px",
            background: "#25D366",
            color: "white",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1rem",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>💬</span>
          Falar com especialista no WhatsApp
        </a>

        {/* Acessar o sistema */}
        <Link
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "16px",
            background: "#f97316",
            color: "white",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1rem",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>🚀</span>
          Começar teste grátis
        </Link>

        {/* Login */}
        <Link
          href="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px",
            background: "transparent",
            color: "#737373",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            border: "1px solid #1f1f1f",
          }}
        >
          Já tenho conta → Entrar
        </Link>
      </div>

      {/* Prova social */}
      <div style={{
        width: "100%",
        background: "#111",
        border: "1px solid #1f1f1f",
        borderRadius: "12px",
        padding: "20px",
        textAlign: "center",
        marginBottom: "32px",
      }}>
        <p style={{
          fontSize: "0.85rem",
          color: "#737373",
          margin: "0 0 12px",
          fontStyle: "italic",
          lineHeight: 1.6,
        }}>
          "Antes eu gerenciava tudo por planilha e WhatsApp.
          Hoje sei exatamente quais guindastes estão livres,
          quanto faturei e o que está em manutenção."
        </p>
        <p style={{
          fontSize: "0.8rem",
          color: "#525252",
          margin: 0,
          fontWeight: 600,
        }}>
          — Dono de locadora · Cliente GrúaOS
        </p>
      </div>

      {/* Comparativo rápido */}
      <div style={{
        width: "100%",
        marginBottom: "32px",
      }}>
        <p style={{
          fontSize: "0.8rem",
          color: "#525252",
          textAlign: "center",
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 600,
        }}>
          Por que o GrúaOS?
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
        }}>
          {[
            { icon: "⚡", text: "Leve e rápido" },
            { icon: "📱", text: "100% mobile" },
            { icon: "💬", text: "WhatsApp nativo" },
            { icon: "💰", text: "A partir R$97/mês" },
            { icon: "🔒", text: "Dados seguros" },
            { icon: "🚀", text: "Setup em 5 min" },
          ].map((item) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#111",
                border: "1px solid #1f1f1f",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <span style={{ fontSize: "1rem" }}>{item.icon}</span>
              <span style={{ fontSize: "0.78rem", color: "#a3a3a3", fontWeight: 500 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center",
        borderTop: "1px solid #1f1f1f",
        paddingTop: "24px",
        width: "100%",
      }}>
        <p style={{ fontSize: "0.75rem", color: "#525252", margin: "0 0 8px" }}>
          © {new Date().getFullYear()} GrúaOS · Todos os direitos reservados
        </p>
        <a
          href="https://instagram.com/gruaossolucoes"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.75rem", color: "#525252", textDecoration: "none" }}
        >
          @gruaossolucoes
        </a>
      </div>

    </main>
  );
}
