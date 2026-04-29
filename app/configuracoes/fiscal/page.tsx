"use client";

import { useEffect, useState } from "react";

interface FormState {
  ibgeCode: string;
  nfeApiKey: string;
  nfeCompanyId: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoMunicipal: string;
  codigoServico: string;
  aliquotaIss: string;
  ambiente: "homologacao" | "producao";
  ativo: boolean;
}

const initialForm: FormState = {
  ibgeCode: "",
  nfeApiKey: "",
  nfeCompanyId: "",
  razaoSocial: "",
  cnpj: "",
  inscricaoMunicipal: "",
  codigoServico: "07.09",
  aliquotaIss: "",
  ambiente: "homologacao",
  ativo: true,
};

export default function ConfiguracaoFiscalPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [municipio, setMunicipio] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    fetch("/api/configuracoes/fiscal")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setForm({
            ibgeCode: data.municipalityConfig?.ibgeCode ?? "",
            nfeApiKey: data.nfeApiKey ?? "",
            nfeCompanyId: data.nfeCompanyId ?? "",
            razaoSocial: data.razaoSocial ?? "",
            cnpj: data.cnpj ?? "",
            inscricaoMunicipal: data.inscricaoMunicipal ?? "",
            codigoServico: data.codigoServico ?? "07.09",
            aliquotaIss: data.aliquotaIss ? String(data.aliquotaIss) : "",
            ambiente: data.ambiente ?? "homologacao",
            ativo: data.ativo ?? true,
          });
          setMunicipio(
            data.municipalityConfig
              ? `${data.municipalityConfig.cityName} - ${data.municipalityConfig.state}`
              : null
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function set(field: keyof FormState, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function salvar() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/configuracoes/fiscal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao salvar");
      setMsg({ tipo: "ok", texto: "✅ Configuração salva com sucesso!" });
    } catch (e: any) {
      setMsg({ tipo: "erro", texto: `❌ ${e.message}` });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuração Fiscal</h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure os dados do município e as credenciais do NFE.io para emitir NFS-e.
        </p>
      </div>

      {/* Dados da Empresa */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-700">Dados da Empresa</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
          <input
            type="text"
            placeholder="Ex: Locações Silva Ltda"
            value={form.razaoSocial}
            onChange={(e) => set("razaoSocial", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
            <input
              type="text"
              placeholder="00.000.000/0001-00"
              value={form.cnpj}
              onChange={(e) => set("cnpj", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição Municipal</label>
            <input
              type="text"
              placeholder="Número da IM"
              value={form.inscricaoMunicipal}
              onChange={(e) => set("inscricaoMunicipal", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Dados do Município */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-700">Município</h2>

        {municipio && (
          <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2">
            Município atual: <strong>{municipio}</strong>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código IBGE da cidade *
          </label>
          <input
            type="text"
            placeholder="Ex: 3550308"
            value={form.ibgeCode}
            onChange={(e) => set("ibgeCode", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Consulte em{" "}
            <a
              href="https://www.ibge.gov.br/explica/codigos-dos-municipios.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              ibge.gov.br
            </a>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de serviço</label>
            <input
              type="text"
              placeholder="Ex: 07.09"
              value={form.codigoServico}
              onChange={(e) => set("codigoServico", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alíquota ISS (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="Ex: 5"
              value={form.aliquotaIss}
              onChange={(e) => set("aliquotaIss", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Credenciais NFE.io */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-700">Credenciais NFE.io</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key *</label>
          <input
            type="password"
            placeholder="Sua chave de API"
            value={form.nfeApiKey}
            onChange={(e) => set("nfeApiKey", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Em{" "}
            <a
              href="https://app.nfe.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              app.nfe.io
            </a>{" "}
            → Configurações → API Keys
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company ID *</label>
          <input
            type="text"
            placeholder="ID da empresa no NFE.io"
            value={form.nfeCompanyId}
            onChange={(e) => set("nfeCompanyId", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ambiente</label>
          <select
            value={form.ambiente}
            onChange={(e) => set("ambiente", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="homologacao">Homologação (testes)</option>
            <option value="producao">Produção</option>
          </select>
        </div>
      </div>

      {/* Toggle ativo */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Emissão de NFS-e ativa</p>
          <p className="text-xs text-gray-400">Desative para pausar sem apagar os dados</p>
        </div>
        <button
          type="button"
          onClick={() => set("ativo", !form.ativo)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.ativo ? "bg-blue-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              form.ativo ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Feedback */}
      {msg && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            msg.tipo === "ok"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {msg.texto}
        </div>
      )}

      <button
        onClick={salvar}
        disabled={saving}
        className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saving ? "Salvando..." : "Salvar configuração"}
      </button>
    </div>
  );
}
