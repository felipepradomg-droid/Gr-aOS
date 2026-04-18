export default function LandingPage() {
  return (
    <main>
      <nav className="nav">
        <div className="nav-inner">
          <span className="logo">GrúaOS</span>
          <div className="nav-links">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#preco">Preço</a>
            <a href="/login" className="btn-outline">Entrar</a>
            <a href="/register" className="btn-primary">Começar grátis →</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">🏗️ Para empresas de grua e içamento</div>
        <h1 className="hero-title">
          Feche cotações<br />
          <span className="highlight">3x mais rápido.</span>
        </h1>
        <p className="hero-sub">
          GrúaOS centraliza suas cotações, clientes e propostas em um só lugar.
          Menos planilha. Mais obra.
        </p>
        <div className="hero-cta">
          <a href="/register" className="btn-hero">Criar conta grátis →</a>
          <a href="#funcionalidades" className="btn-ghost">Ver funcionalidades ↓</a>
        </div>
        <p className="hero-social-proof">
          ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ Setup em 5 minutos &nbsp;·&nbsp; ✓ Cancele quando quiser
        </p>
      </section>

      <section className="problem">
        <div className="container">
          <h2>Você ainda gerencia cotações por WhatsApp e planilha?</h2>
          <div className="pain-grid">
            {[
              { icon: "😤", text: "Cotações perdidas no WhatsApp" },
              { icon: "📊", text: "Planilhas desatualizadas e confusas" },
              { icon: "⏱️", text: "Horas calculando preços manualmente" },
              { icon: "❌", text: "Clientes sem resposta rápida" },
            ].map((p) => (
              <div key={p.text} className="pain-card">
                <span>{p.icon}</span>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features" id="funcionalidades">
        <div className="container">
          <div className="section-tag">Funcionalidades</div>
          <h2>Tudo que sua empresa precisa para vender mais</h2>
          <div className="features-grid">
            {[
              { icon: "📋", title: "Cotações em segundos", desc: "Monte propostas profissionais em menos de 2 minutos." },
              { icon: "👥", title: "Gestão de clientes", desc: "Histórico completo de cada cliente: obras, cotações enviadas, aprovadas e rejeitadas." },
              { icon: "📱", title: "Envio por WhatsApp", desc: "Envie a proposta diretamente pelo sistema com PDF profissional." },
              { icon: "📈", title: "Dashboard de vendas", desc: "Visualize taxa de aprovação, receita prevista e cotações em aberto." },
              { icon: "🔔", title: "Alertas de follow-up", desc: "Nunca esqueça de dar retorno. O sistema avisa quando uma cotação ficou sem resposta." },
              { icon: "🧾", title: "Relatórios em PDF", desc: "Gere relatórios mensais para controle financeiro." },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="pricing" id="preco">
        <div className="container">
          <div className="section-tag">Planos</div>
          <h2>Escolha o plano ideal para sua empresa</h2>
          <p style={{ color: "var(--text-2)", marginBottom: "48px", fontSize: "1.05rem" }}>
            Comece grátis e faça upgrade quando quiser.
          </p>

          <div className="pricing-grid">
            {/* FREE */}
            <div className="pricing-card">
              <div className="plan-name">Free</div>
              <div className="plan-price">R$ 0<span>/mês</span></div>
              <ul className="plan-features">
                <li>✓ 10 cotações/mês</li>
                <li>✓ 1 usuário</li>
                <li>✓ Dashboard básico</li>
                <li className="disabled">✗ Envio WhatsApp</li>
                <li className="disabled">✗ Relatórios</li>
              </ul>
              <a href="/register" className="btn-outline-full">Começar grátis</a>
            </div>

            {/* STARTER */}
            <div className="pricing-card">
              <div className="plan-name">Starter</div>
              <div className="plan-price">R$ 97<span>/mês</span></div>
              <ul className="plan-features">
                <li>✓ 50 cotações/mês</li>
                <li>✓ 1 usuário</li>
                <li>✓ PDF com sua marca</li>
                <li>✓ Suporte por email</li>
                <li className="disabled">✗ Envio WhatsApp</li>
                <li className="disabled">✗ Relatórios</li​​​​​​​​​​​​​​​​
