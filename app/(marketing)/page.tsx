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
        <div className="hero-badge">Para empresas de grua e içamento</div>
        <h1 className="hero-title">
          Feche cotações<br />
          <span className="highlight">3x mais rápido.</span>
        </h1>
        <p className="hero-sub">
          GrúaOS centraliza suas cotações, clientes e propostas em um só lugar.
          Menos planilha. Mais obra.
        </p>
        <div className="hero-cta">
          <a href="/register" className="btn-hero">Criar conta grátis</a>
          <a href="#funcionalidades" className="btn-ghost">Ver funcionalidades</a>
        </div>
        <p className="hero-social-proof">
          Sem cartão de crédito · Setup em 5 minutos · Cancele quando quiser
        </p>
      </section>

      <section className="problem">
        <div className="container">
          <h2>Você ainda gerencia cotações por WhatsApp e planilha?</h2>
          <div className="pain-grid">
            <div className="pain-card"><span>😤</span><p>Cotações perdidas no WhatsApp</p></div>
            <div className="pain-card"><span>📊</span><p>Planilhas desatualizadas e confusas</p></div>
            <div className="pain-card"><span>⏱️</span><p>Horas calculando preços manualmente</p></div>
            <div className="pain-card"><span>❌</span><p>Clientes sem resposta rápida</p></div>
          </div>
        </div>
      </section>

      <section className="features" id="funcionalidades">
        <div className="container">
          <div className="section-tag">Funcionalidades</div>
          <h2>Tudo que sua empresa precisa para vender mais</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Cotações em segundos</h3>
              <p>Monte propostas profissionais em menos de 2 minutos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Gestão de clientes</h3>
              <p>Histórico completo de cada cliente e obras.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Envio por WhatsApp</h3>
              <p>PDF profissional direto pelo sistema.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Dashboard de vendas</h3>
              <p>Taxa de aprovação e receita prevista em tempo real.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Alertas de follow-up</h3>
              <p>O sistema avisa quando uma cotação ficou sem resposta.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧾</div>
              <h3>Relatórios em PDF</h3>
              <p>Relatórios mensais para controle financeiro.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="preco">
        <div className="container">
          <div className="section-tag">Planos</div>
          <h2>Escolha o plano ideal para sua empresa</h2>
          <p style={{ color: "var(--text-2)", marginBottom: "48px", fontSize: "1.05rem" }}>
            Comece grátis e faça upgrade quando quiser.
          </p>
          <div className="pricing-grid">
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
            <div className="pricing-card">
              <div className="plan-name">Starter</div>
              <div className="plan-price">R$ 97<span>/mês</span></div>
              <ul className="plan-features">
                <li>✓ 50 cotações/mês</li>
                <li>✓ 1 usuário</li>
                <li>✓ PDF com sua marca</li>
                <li>✓ Suporte por email</li>
                <li className="disabled">✗ Envio WhatsApp</li>
                <li className="disabled">✗ Relatórios</li>
              </ul>
              <a href="/register?plan=starter" className="btn-outline-full">Assinar Starter</a>
            </div>
            <div className="pricing-card featured">
              <div className="plan-badge">Mais popular</div>
              <div className="plan-name" style={{ marginTop: "16px" }}>Pro</div>
              <div className="plan-price">R$ 197<span>/mês</span></div>
              <ul className="plan-features">
                <li>✓ Cotações ilimitadas</li>
                <li>✓ 3 usuários</li>
                <li>✓ PDF com sua marca</li>
                <li>✓ Envio por WhatsApp</li>
                <li>✓ Relatórios mensais</li>
                <li>✓ Alertas de follow-up</li>
              </ul>
              <a href="/register?plan=pro" className="btn-primary-full">Assinar Pro</a>
            </div>
            <div className="pricing-card">
              <div className="plan-name">Business</div>
              <div className="plan-price">R$ 397<span>/mês</span></div>
              <ul className="plan-features">
                <li>✓ Tudo do Pro</li>
                <li>✓ 10 usuários</li>
                <li>✓ API de integração</li>
                <li>✓ Onboarding dedicado</li>
                <li>✓ Suporte prioritário</li>
                <li>✓ SLA garantido</li>
              </ul>
              <a href="/register?plan=business" className="btn-outline-full">Assinar Business</a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Comece grátis hoje.</h2>
          <p>Sem cartão de crédito · Cancele quando quiser</p>
          <a href="/register" className="btn-hero">Criar minha conta agora</a>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <span className="logo">GrúaOS</span>
          <div className="footer-links">
            <a href="/privacy">Privacidade</a>
            <a href="/terms">Termos</a>
            <a href="mailto:gruaossolucoes@gmail.com">Suporte</a>
          </div>
          <p>2025 GrúaOS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
