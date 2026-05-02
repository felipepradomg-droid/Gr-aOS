import Link from "next/link";

const modules = [
  { icon: "🏗️", title: "Frota", desc: "Cadastre equipamentos com fotos, documentos e especificações técnicas. Status em tempo real." },
  { icon: "📋", title: "Ordens de Serviço", desc: "Gere OS a partir de cotações aprovadas. Controle operadores, endereços e status completo." },
  { icon: "📅", title: "Agenda", desc: "Calendário Gantt com disponibilidade da frota. Evite conflitos e maximize a ocupação." },
  { icon: "💬", title: "Cotações", desc: "Propostas profissionais em segundos. Envie por WhatsApp e converta com um clique." },
  { icon: "📃", title: "Contratos", desc: "Diária, hora, mês ou obra. Medições automáticas vinculadas à frota e ao cliente." },
  { icon: "👷", title: "Operadores", desc: "Cadastro completo com registros de trabalho, vinculação a OS e histórico de atividades." },
  { icon: "🔧", title: "Manutenção", desc: "Planos preditivos com alertas por horímetro. Preventivas e corretivas com histórico por máquina." },
  { icon: "⛽", title: "Combustível", desc: "Rastreamento de abastecimento por equipamento. Identifique desperdícios com dados reais." },
  { icon: "🧾", title: "NFS-e", desc: "Nota fiscal emitida com um clique direto da OS ou fatura. Integrado ao NFE.io." },
  { icon: "💰", title: "Faturas", desc: "Gere faturas vinculadas às OS. Controle pagamentos e envie por WhatsApp." },
  { icon: "🏦", title: "Cobranças", desc: "Boleto e PIX automáticos com conciliação bancária via Asaas. Zero lançamento manual." },
  { icon: "📑", title: "Impostos", desc: "Apuração mensal automática para Simples Nacional, Lucro Presumido ou Real." },
  { icon: "🧠", title: "Inteligência", desc: "KPIs, insights e indicadores em tempo real. Decisões baseadas em dados, não em achismo." },
];

const stats = [
  { value: "13", label: "Módulos integrados" },
  { value: "1", label: "Clique para emitir NFS-e" },
  { value: "30%", label: "Combustível economizado" },
  { value: "5min", label: "Para começar a operar" },
];

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #04080f;
          --bg2: #07101f;
          --bg3: #0a1628;
          --border: #152035;
          --border2: #1e3050;
          --blue: #2563eb;
          --blue2: #3b82f6;
          --blue-glow: rgba(37,99,235,0.15);
          --amber: #f59e0b;
          --white: #eef2ff;
          --gray: #7b90b8;
          --gray2: #3d5070;
        }
        body { background: var(--bg); }
        .land { font-family: 'Montserrat', sans-serif; background: var(--bg); color: var(--white); min-height: 100vh; }

        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 100;
          background: rgba(4,8,15,0.85);
          backdrop-filter: blur(16px);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark {
          width: 36px; height: 36px; background: var(--blue); border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 1rem; color: white; font-family: 'Montserrat', sans-serif;
        }
        .nav-logo-text { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.5px; color: var(--white); }
        .nav-logo-text span { color: var(--amber); }
        .nav-links { display: flex; gap: 12px; align-items: center; }
        .nav-login { color: var(--gray); text-decoration: none; font-size: 0.875rem; font-weight: 600; padding: 8px 16px; }
        .nav-cta {
          background: var(--blue); color: white;
          padding: 9px 22px; border-radius: 8px;
          text-decoration: none; font-size: 0.875rem; font-weight: 700;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: var(--blue2); }

        .hero {
          padding: 130px 48px 110px;
          max-width: 1100px; margin: 0 auto;
          position: relative;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--bg3); border: 1px solid var(--border2);
          padding: 6px 14px; border-radius: 100px;
          font-size: 0.72rem; font-weight: 700; color: var(--gray);
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 36px;
        }
        .hero-badge-dot { width: 6px; height: 6px; background: var(--blue2); border-radius: 50%; }
        .hero-h1 {
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 900; line-height: 1.0;
          letter-spacing: -2.5px; margin-bottom: 28px;
          max-width: 800px;
        }
        .hero-h1 em { font-style: normal; color: var(--blue2); }
        .hero-h1 strong { font-style: normal; color: var(--amber); font-weight: 900; }
        .hero-sub {
          font-size: 1.1rem; color: var(--gray); line-height: 1.75;
          max-width: 520px; margin-bottom: 52px; font-weight: 500;
        }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
        .btn-primary {
          background: var(--blue); color: white;
          padding: 15px 36px; border-radius: 8px;
          text-decoration: none; font-size: 1rem; font-weight: 800;
          letter-spacing: -0.3px; transition: all 0.2s;
          box-shadow: 0 0 40px rgba(37,99,235,0.35);
        }
        .btn-primary:hover { background: var(--blue2); box-shadow: 0 0 60px rgba(37,99,235,0.5); }
        .btn-ghost {
          background: transparent; color: var(--gray);
          padding: 15px 28px; border-radius: 8px;
          text-decoration: none; font-size: 1rem; font-weight: 600;
          border: 1px solid var(--border2); transition: border-color 0.2s;
        }
        .btn-ghost:hover { border-color: var(--blue); color: var(--white); }
        .hero-note { font-size: 0.75rem; color: var(--gray2); font-weight: 500; }
        .hero-glow {
          position: absolute; top: 60px; right: -100px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .hero > * { position: relative; z-index: 1; }

        .stats { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--bg2); }
        .stats-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, 1fr);
        }
        .stat { padding: 40px 36px; border-right: 1px solid var(--border); }
        .stat:last-child { border-right: none; }
        .stat-val { font-size: 2.8rem; font-weight: 900; color: var(--blue2); letter-spacing: -2px; line-height: 1; margin-bottom: 8px; }
        .stat-label { font-size: 0.8rem; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: 0.06em; }

        .section { padding: 100px 48px; max-width: 1100px; margin: 0 auto; }
        .section-eyebrow { font-size: 0.72rem; font-weight: 800; color: var(--blue2); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 16px; }
        .section-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 900; letter-spacing: -1.5px; margin-bottom: 16px; line-height: 1.1; }
        .section-sub { color: var(--gray); font-size: 1rem; line-height: 1.7; max-width: 500px; font-weight: 500; margin-bottom: 56px; }

        .modules-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
        }
        .module-card {
          background: var(--bg2); padding: 28px;
          border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }
        .module-card:hover { background: var(--bg3); }
        .module-icon {
          width: 44px; height: 44px; background: var(--bg3); border: 1px solid var(--border2);
          border-radius: 10px; display: flex; align-items: center;
          justify-content: center; font-size: 1.3rem; margin-bottom: 16px;
        }
        .module-title { font-size: 0.95rem; font-weight: 800; margin-bottom: 6px; color: var(--white); }
        .module-desc { font-size: 0.82rem; color: var(--gray); line-height: 1.65; font-weight: 500; }

        .why-section { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .why-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 40px; }
        .why-item { display: flex; gap: 18px; }
        .why-icon {
          width: 42px; height: 42px; flex-shrink: 0;
          background: var(--blue-glow); border: 1px solid var(--border2);
          border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
        }
        .why-title { font-size: 0.95rem; font-weight: 800; margin-bottom: 6px; }
        .why-desc { font-size: 0.82rem; color: var(--gray); line-height: 1.65; font-weight: 500; }

        .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .plan-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 36px; position: relative; }
        .plan-card.featured { border-color: var(--blue); background: var(--bg3); box-shadow: 0 0 60px rgba(37,99,235,0.12); }
        .plan-badge {
          position: absolute; top: -12px; left: 28px;
          background: var(--blue); color: white;
          padding: 4px 14px; border-radius: 100px;
          font-size: 0.68rem; font-weight: 800; letter-spacing: 0.06em;
        }
        .plan-name { font-size: 0.85rem; font-weight: 800; color: var(--gray); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .plan-desc { font-size: 0.82rem; color: var(--gray2); margin-bottom: 24px; font-weight: 500; }
        .plan-price { margin-bottom: 28px; }
        .plan-amount { font-size: 2.8rem; font-weight: 900; letter-spacing: -2px; color: var(--white); }
        .plan-period { font-size: 0.85rem; color: var(--gray); font-weight: 500; }
        .plan-saving {
          display: inline-block; margin-top: 8px;
          background: rgba(37,99,235,0.15); border: 1px solid var(--border2);
          color: var(--blue2); font-size: 0.72rem; font-weight: 700;
          padding: 3px 10px; border-radius: 100px; letter-spacing: 0.04em;
        }
        .plan-features { list-style: none; margin-bottom: 32px; display: flex; flex-direction: column; gap: 10px; }
        .plan-features li { font-size: 0.82rem; color: var(--gray); display: flex; align-items: center; gap: 10px; font-weight: 500; }
        .plan-features li::before { content: ""; width: 5px; height: 5px; background: var(--blue2); border-radius: 50%; flex-shrink: 0; }
        .plan-btn { display: block; text-align: center; padding: 13px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.9rem; transition: all 0.2s; }
        .plan-btn.primary { background: var(--blue); color: white; }
        .plan-btn.primary:hover { background: var(--blue2); }
        .plan-btn.secondary { background: transparent; color: var(--gray); border: 1px solid var(--border2); }
        .plan-btn.secondary:hover { border-color: var(--blue); color: var(--white); }

        .cta-section { padding: 120px 48px; text-align: center; background: var(--bg2); border-top: 1px solid var(--border); position: relative; overflow: hidden; }
        .cta-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
        .cta-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; letter-spacing: -2px; line-height: 1.1; margin-bottom: 20px; }
        .cta-sub { color: var(--gray); font-size: 1rem; line-height: 1.7; margin-bottom: 44px; font-weight: 500; }
        .cta-note { margin-top: 18px; font-size: 0.75rem; color: var(--gray2); font-weight: 500; }

        .footer {
          padding: 32px 48px; border-top: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
        }
        .footer-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .footer-logo-mark { width: 28px; height: 28px; background: var(--blue); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.85rem; color: white; }
        .footer-logo-text { font-size: 0.9rem; font-weight: 800; color: var(--white); }
        .footer-logo-text span { color: var(--amber); }
        .footer-copy { font-size: 0.75rem; color: var(--gray2); font-weight: 500; }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 0.78rem; color: var(--gray2); text-decoration: none; font-weight: 600; transition: color 0.2s; }
        .footer-links a:hover { color: var(--gray); }

        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .hero { padding: 80px 20px 70px; }
          .section { padding: 70px 20px; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat { border-bottom: 1px solid var(--border); }
          .cta-section { padding: 80px 20px; }
          .footer { padding: 24px 20px; }
          .hero-glow { display: none; }
        }
      `}</style>

      <div className="land">

        <nav className="nav">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-mark">G</div>
            <span className="nav-logo-text">Grúa<span>OS</span></span>
          </Link>
          <div className="nav-links">
            <Link href="/login" className="nav-login">Entrar</Link>
            <Link href="/register?plan=pro" className="nav-cta">Testar grátis</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            ERP para locadoras de equipamentos pesados
          </div>
          <h1 className="hero-h1">
            Gestão completa<br />
            para sua <em>locadora</em><br />
            de <strong>guindastes.</strong>
          </h1>
          <p className="hero-sub">
            13 módulos integrados — frota, OS, contratos, fiscal e financeiro em um só lugar.
            Substitua planilhas e sistemas genéricos de uma vez por todas.
          </p>
          <div className="hero-actions">
            <Link href="/register?plan=pro" className="btn-primary">Testar 7 dias grátis →</Link>
            <Link href="/login" className="btn-ghost">Já tenho conta</Link>
          </div>
          <p className="hero-note">Cartão obrigatório · Sem cobrança nos primeiros 7 dias · Cancele quando quiser</p>
        </section>

        <div className="stats">
          <div className="stats-inner">
            {stats.map((s) => (
              <div key={s.value} className="stat">
                <div className="stat-val">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <p className="section-eyebrow">Módulos</p>
          <h2 className="section-title">Tudo integrado.<br />Zero retrabalho.</h2>
          <p className="section-sub">
            Cada módulo foi construído a partir de conversas reais com donos de locadoras.
            Feito para esse setor, não adaptado de outro.
          </p>
          <div className="modules-grid">
            {modules.map((m) => (
              <div key={m.title} className="module-card">
                <div className="module-icon">{m.icon}</div>
                <div className="module-title">{m.title}</div>
                <div className="module-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="why-section">
          <div className="section">
            <p className="section-eyebrow">Por que GrúaOS</p>
            <h2 className="section-title">Feito para quem<br />opera no campo.</h2>
            <p className="section-sub">
              Simples no celular, poderoso no desktop. Sem treinamento técnico, sem instalação.
            </p>
            <div className="why-grid">
              {[
                { icon: "📱", title: "Desktop e mobile", desc: "Interface otimizada para qualquer dispositivo. Use no escritório ou direto da obra." },
                { icon: "⚡", title: "Rápido e sem instalação", desc: "Acessa pelo navegador. Sem travamento, sem atualização manual." },
                { icon: "💬", title: "WhatsApp integrado", desc: "Envie cotações, OS e faturas com 1 clique. Seus clientes recebem na hora." },
                { icon: "🧾", title: "Fiscal automatizado", desc: "NFS-e, impostos e cobranças geradas automaticamente. Sem burocracia." },
                { icon: "🔒", title: "Dados isolados por empresa", desc: "Cada conta vê apenas seus próprios dados. Segurança total." },
                { icon: "💰", title: "Preço justo", desc: "A partir de R$297/mês. Menos que um funcionário. Mais poderoso que qualquer planilha." },
              ].map((w) => (
                <div key={w.title} className="why-item">
                  <div className="why-icon">{w.icon}</div>
                  <div>
                    <div className="why-title">{w.title}</div>
                    <div className="why-desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section">
          <p className="section-eyebrow">Planos</p>
          <h2 className="section-title">Simples e transparentes.</h2>
          <p className="section-sub">
            Sem taxa de implantação. Sem contrato anual. Cancele quando quiser.
          </p>
          <div className="plans-grid">
            <div className="plan-card featured">
              <div className="plan-badge">MAIS POPULAR</div>
              <div className="plan-name">Pro</div>
              <div className="plan-desc">Para locadoras em crescimento</div>
              <div className="plan-price">
                <span className="plan-amount">R$297</span>
                <span className="plan-period">/mês</span>
                <br />
                <span className="plan-saving">✦ 7 dias grátis para testar</span>
              </div>
              <ul className="plan-features">
                {["Frota ilimitada","OS ilimitadas","Agenda + Gantt","Cotações ilimitadas","Contratos e medições","Operadores","Manutenção preditiva","NFS-e automática","Boleto e PIX","Apuração de impostos","BI e Inteligência","Suporte por WhatsApp"].map(f => <li key={f}>{f}</li>)}
              </ul>
              <Link href="/register?plan=pro" className="plan-btn primary">Testar 7 dias grátis</Link>
            </div>
            <div className="plan-card">
              <div className="plan-name">Enterprise</div>
              <div className="plan-desc">Para grandes operações</div>
              <div className="plan-price">
                <span className="plan-amount">R$597</span>
                <span className="plan-period">/mês</span>
                <br />
                <span className="plan-saving">✦ Onboarding dedicado incluso</span>
              </div>
              <ul className="plan-features">
                {["Tudo do Pro","Múltiplos usuários","Relatórios avançados","Export CSV/Excel","API de integração","Suporte prioritário 24h","Onboarding dedicado","SLA garantido"].map(f => <li key={f}>{f}</li>)}
              </ul>
              <a href="https://wa.me/5534991103401?text=Olá!%20Tenho%20interesse%20no%20plano%20Enterprise%20do%20GrúaOS." className="plan-btn secondary">Falar com vendas</a>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <div className="cta-glow" />
          <div className="cta-inner">
            <h2 className="cta-title">Sua locadora merece<br />um sistema à altura.</h2>
            <p className="cta-sub">
              Configure em menos de 5 minutos. Cadastre sua frota e comece a operar hoje mesmo.
            </p>
            <Link href="/register?plan=pro" className="btn-primary">Testar 7 dias grátis →</Link>
            <p className="cta-note">Cartão obrigatório · Sem cobrança nos primeiros 7 dias</p>
          </div>
        </div>

        <footer className="footer">
          <Link href="/" className="footer-logo">
            <div className="footer-logo-mark">G</div>
            <span className="footer-logo-text">Grúa<span>OS</span></span>
          </Link>
          <p className="footer-copy">© {new Date().getFullYear()} GrúaOS. Todos os direitos reservados.</p>
          <div className="footer-links">
            <Link href="/login">Entrar</Link>
            <a href="https://wa.me/5534991103401">Suporte</a>
          </div>
        </footer>

      </div>
    </>
  );
}
