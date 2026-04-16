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
              { icon: "📋", title: "Cotações em segundos", desc: "Monte propostas profissionais em menos de 2 minutos. Templates prontos para grua telescópica, articulada e mais." },
              { icon: "👥", title: "Gestão de clientes", desc: "Histórico completo de cada cliente: obras, cotações enviadas, aprovadas e rejeitadas." },
              { icon: "📱", title: "Envio por WhatsApp", desc: "Envie a proposta diretamente pelo sistema. O cliente recebe um PDF profissional com sua logo." },
              { icon: "📈", title: "Dashboard de vendas", desc: "Visualize taxa de aprovação, receita prevista e cotações em aberto." },
              { icon: "🔔", title: "Alertas de follow-up", desc: "Nunca esqueça de dar retorno. O sistema avisa quando uma cotação ficou sem resposta." },
              { icon: "🧾", title: "Relatórios em PDF", desc: "Gere relatórios mensais para apresentar à diretoria ou para controle financeiro." },
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

      <section className="testimonials">
        <div className="container">
          <h2>Empresas que já usam o GrúaOS</h2>
          <div className="testimonials-grid">
            {[
              { name: "Carlos M.", role: "Diretor — Gruas Sul Ltda.", text: "Antes eu perdia cotação por esquecer de responder. Hoje tenho tudo organizado e minha taxa de fechamento subiu 40%." },
              { name: "Fernanda R.", role: "Gerente Comercial — TecnoGuincho", text: "O cliente recebe a proposta em PDF com nossa marca. Isso gerou muito mais credibilidade e fechamos contratos maiores." },
              { name: "Paulo T.", role: "Sócio — Içamento Paraná", text: "Implementamos em uma tarde. A equipe adorou e agora toda cotação passa pelo sistema." },
            ].map((t) => (
              <div key={t.name} className="testimonial-card">
                <p>"{t.text}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇO — plano único R$97 */}
      <section className="pricing" id="preco">
        <div className="container">
          <div className="section-tag">Preço</div>
          <h2>Um plano. Tudo incluso.</h2>
          <p style={{ color: "var(--text-2)", marginBottom: "48px", fontSize: "1.05rem" }}>
            Sem surpresas, sem letras miúdas.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="pricing-card featured" style={{ maxWidth: "420px", width: "100%" }}>
              <div className="plan-badge">✅ Acesso completo</div>
              <div className="plan-name" style={{ marginTop: "16px" }}>GrúaOS Pro</div>

              <div style={{ margin: "16px 0 6px" }}>
                <span style={{ fontSize: "3.2rem", fontWeight: 800, letterSpacing: "-.04em" }}>R$ 97</span>
                <span style={{ color: "var(--text-2)", fontSize: "1rem" }}>/mês</span>
              </div>
              <p style={{ color: "var(--text-2)", fontSize: ".875rem", marginBottom: "24px" }}>
                Equivale a <strong style={{ color: "var(--text)" }}>R$ 3,23 por dia</strong> — menos que um café.
              </p>

              <ul className="plan-features">
                <li>✓ Cotações ilimitadas</li>
                <li>✓ Clientes ilimitados</li>
                <li>✓ Dashboard completo</li>
                <li>✓ PDF com sua marca</li>
                <li>✓ Envio por WhatsApp</li>
                <li>✓ Relatórios mensais</li>
                <li>✓ Alertas de follow-up</li>
                <li>✓ Suporte por email</li>
              </ul>

              <a href="/register" className="btn-primary-full" style={{ marginTop: "16px" }}>
                Começar grátis por 10 dias →
              </a>
              <p style={{ textAlign: "center", fontSize: ".8rem", color: "var(--text-3)", marginTop: "12px" }}>
                Sem cartão no trial · Cancele quando quiser
              </p>
            </div>
          </div>

          {/* Tabela comparativa */}
          <div style={{ marginTop: "56px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>
            <h3 style={{ textAlign: "center", marginBottom: "24px" }}>Por que R$ 97/mês vale a pena?</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 16px", textAlign: "left", background: "var(--bg-3)", color: "var(--text-3)", fontSize: ".8rem" }}>❌ Planilha / WhatsApp</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", background: "var(--bg-3)", color: "var(--brand)", fontSize: ".8rem" }}>✅ GrúaOS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cotações perdidas no chat", "Tudo centralizado"],
                  ["Sem histórico do cliente", "Histórico completo"],
                  ["PDF feio pelo celular", "Proposta profissional"],
                  ["Sem follow-up", "Alertas automáticos"],
                  ["Sem dados de venda", "Dashboard em tempo real"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", fontSize: ".875rem", color: "var(--error)" }}>✗ {row[0]}</td>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", fontSize: ".875rem", color: "var(--success)" }}>✓ {row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 0", background: "var(--bg-2)" }}>
        <div className="container" style={{ maxWidth: "640px" }}>
          <div className="section-tag">FAQ</div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "32px" }}>Perguntas frequentes</h2>
          {[
            { q: "Como funciona o período grátis?", a: "Você tem 10 dias para testar tudo sem precisar de cartão de crédito. Depois, é R$ 97/mês via PIX." },
            { q: "Como faço para pagar?", a: "Pagamento 100% via PIX, processado pelo Mercado Pago. Rápido, seguro e sem burocracia." },
            { q: "Posso cancelar quando quiser?", a: "Sim. Sem fidelidade, sem multa. Se cancelar, o acesso continua até o fim do mês pago." },
            { q: "Funciona para qualquer tipo de grua?", a: "Sim. Telescópica, articulada, sobre caminhão, pórtico — o sistema é flexível para qualquer serviço de içamento." },
            { q: "Meus dados ficam seguros?", a: "Sim. Todos os dados são armazenados com criptografia e backups automáticos diários." },
          ].map((item) => (
            <div key={item.q} style={{ borderBottom: "1px solid var(--border)", padding: "20px 0" }}>
              <div style={{ fontWeight: 600, marginBottom: "8px" }}>{item.q}</div>
              <div style={{ color: "var(--text-2)", fontSize: ".9rem", lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <h2>Comece grátis hoje.</h2>
          <p>10 dias sem cartão · R$ 97/mês depois · Cancele quando quiser</p>
          <a href="/register" className="btn-hero">Criar minha conta agora →</a>
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
          <p>© 2025 GrúaOS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
