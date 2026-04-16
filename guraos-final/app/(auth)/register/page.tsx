"use client";
// app/(auth)/register/page.tsx

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const planFromUrl = params.get("plan"); // vem da landing page

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao criar conta.");
        return;
      }

      // Faz login automático após cadastro
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Se veio com plano, manda pro checkout
      if (planFromUrl && planFromUrl !== "free") {
        router.push(`/checkout?plan=${planFromUrl}`);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">GrúaOS</div>
        <h1 className="auth-title">Criar conta grátis</h1>
        <p className="auth-subtitle">Sem cartão de crédito · Setup em 5 minutos</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="name">Nome completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="João da Silva"
              required
              minLength={2}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email corporativo</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com.br"
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta grátis →"}
          </button>
        </form>

        <p className="auth-legal">
          Ao criar conta, você concorda com os{" "}
          <Link href="/terms">Termos de Uso</Link> e{" "}
          <Link href="/privacy">Política de Privacidade</Link>.
        </p>

        <p className="auth-footer">
          Já tem conta?{" "}
          <Link href="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
