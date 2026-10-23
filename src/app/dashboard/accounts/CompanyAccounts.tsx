"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "react-toastify";
import { FiCopy, FiEdit2, FiExternalLink, FiEye, FiEyeOff, FiLock, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import type { CompanyAccountModel } from "@/model/CompanyAccount";
import {
  delete_company_account,
  get_company_account_password,
  get_company_accounts,
  save_company_account,
} from "@/Services/Admin/accounts";

const ACCOUNTS_KEY = "/gettingCompanyAccounts";

const emptyForm: CompanyAccountModel = { service: "", email: "", password: "", url: "", note: "" };

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-sm transition focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/10";

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition hover:bg-brand-50 hover:text-brand";

export default function CompanyAccounts() {
  const { data, isLoading, mutate } = useSWR(ACCOUNTS_KEY, get_company_accounts);
  const accounts: CompanyAccountModel[] = data?.success ? data.data : [];

  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CompanyAccountModel | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  // Passwords já pedidas ao servidor, por id da conta
  const [revealed, setRevealed] = useState<Record<string, string>>({});

  const filtered = accounts.filter((a) =>
    `${a.service} ${a.email} ${a.note ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const fetchPassword = async (id: string) => {
    if (revealed[id] !== undefined) return revealed[id];
    const res = await get_company_account_password(id);
    if (!res?.success) {
      toast.error(res?.message || "Não foi possível obter a password");
      return null;
    }
    return res.data.password as string;
  };

  const togglePassword = async (id: string) => {
    if (revealed[id] !== undefined) {
      setRevealed(({ [id]: _, ...rest }) => rest);
      return;
    }
    const password = await fetchPassword(id);
    if (password !== null) setRevealed((prev) => ({ ...prev, [id]: password }));
  };

  const copy = async (text: string | null, label: string) => {
    if (text === null) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado`);
    } catch (error) {
      toast.error("Não foi possível copiar");
    }
  };

  const openForm = (account?: CompanyAccountModel) => {
    setShowFormPassword(false);
    setForm(account ? { ...emptyForm, ...account, password: "" } : { ...emptyForm });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const res = await save_company_account(form);
    setSaving(false);
    if (res?.success) {
      toast.success(res.message);
      if (form._id) setRevealed(({ [form._id!]: _, ...rest }) => rest);
      setForm(null);
      mutate();
    } else {
      toast.error(res?.message || "Erro ao guardar a conta");
    }
  };

  const handleDelete = async (account: CompanyAccountModel) => {
    if (!confirm(`Eliminar a conta "${account.service}"?`)) return;
    const res = await delete_company_account(account._id!);
    if (res?.success) {
      toast.success(res.message);
      mutate();
    } else {
      toast.error(res?.message || "Erro ao eliminar a conta");
    }
  };

  return (
    <div className="w-full max-w-6xl pt-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Contas da empresa</h1>
          <p className="text-sm !text-ink-muted">
            Emails e passwords das contas da empresa. Só os administradores têm acesso a esta área.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar..."
            className={`${inputClass} md:w-64`}
          />
          <button
            onClick={() => openForm()}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
          >
            <FiPlus /> Nova conta
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-line shadow-surface overflow-hidden">
        {isLoading ? (
          <div className="h-64 animate-pulse bg-canvas" />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <FiLock className="h-8 w-8 text-ink-muted" />
            <p className="text-sm !text-ink-muted">
              {accounts.length === 0 ? "Ainda não há contas guardadas." : "Nenhuma conta encontrada."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((account) => {
              const id = account._id!;
              const password = revealed[id];
              return (
                <li key={id} className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 lg:w-1/4">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-ink">{account.service}</span>
                      {account.url && (
                        <a href={account.url} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-brand">
                          <FiExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    {account.note && <p className="truncate text-xs !text-ink-muted">{account.note}</p>}
                  </div>

                  <div className="flex min-w-0 items-center gap-1 lg:w-1/3">
                    <span className="truncate text-sm text-ink">{account.email}</span>
                    <button title="Copiar email" onClick={() => copy(account.email, "Email")} className={iconButton}>
                      <FiCopy />
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    <span className="truncate font-mono text-sm text-ink">{password ?? "••••••••••"}</span>
                    <button title={password ? "Esconder" : "Mostrar"} onClick={() => togglePassword(id)} className={iconButton}>
                      {password !== undefined ? <FiEyeOff /> : <FiEye />}
                    </button>
                    <button title="Copiar password" onClick={async () => copy(await fetchPassword(id), "Password")} className={iconButton}>
                      <FiCopy />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button title="Alterar" onClick={() => openForm(account)} className={iconButton}>
                      <FiEdit2 />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => handleDelete(account)}
                      className={`${iconButton} hover:!bg-red-50 hover:!text-red-600`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 p-4" onClick={() => setForm(null)}>
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-lg font-semibold text-ink">{form._id ? "Alterar conta" : "Nova conta"}</h2>
              <button type="button" onClick={() => setForm(null)} className={iconButton}>
                <FiX />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Serviço *</label>
                <input
                  required
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  placeholder="Ex: Gmail, Uber Eats, Banco..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email / utilizador *</label>
                <input
                  required
                  autoComplete="off"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Password {form._id ? "" : "*"}
                </label>
                <div className="relative">
                  <input
                    required={!form._id}
                    type={showFormPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword((v) => !v)}
                    className={`${iconButton} absolute right-2 top-1/2 -translate-y-1/2`}
                  >
                    {showFormPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {form._id && <p className="mt-1.5 text-xs !text-ink-muted">Deixe vazio para manter a password atual.</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Link</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Notas</label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-canvas hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark disabled:opacity-50"
              >
                {saving ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
