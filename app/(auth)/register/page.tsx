"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const planFromUrl = params.get("plan");
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
      if (!res.ok) { setError(data.error || "Erro ao criar conta."); return; }
      await signIn("credentials", { email, password, redirect: false });
      if (planFromUrl && planFromUrl !== "free") router.push(`/checkout?plan=${planFromUrl}`);
      else router.push("/dashboard");
    } catch { setError("Erro de conexão."); }
    finally { setLoading(false); }
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
            <label>Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="João da Silva" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@empresa.com" required />
          </div>
          <div className="field">
            <label>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>{loading ? "Criando..." : "Criar conta grátis →"}</button>
        </form>
        <p className="auth-footer">Já tem conta? <Link href="/login">Entrar</Link></p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
