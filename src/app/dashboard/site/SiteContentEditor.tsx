"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FiExternalLink, FiRotateCcw, FiSave, FiUpload } from "react-icons/fi";
import { storage } from "@/utils/Firebase";
import { get_site_content, update_site_content } from "@/Services/common/siteContent";
import { SITE_CONTENT_KEY } from "@/components/site/PublicSiteLoader";
import {
  SiteContentData,
  SiteSectionKey,
  mergeSiteContent,
  siteContentDefaults,
} from "@/utils/siteContentDefaults";

type FieldType = "text" | "textarea" | "image" | "url";

interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
}

const RICH_HINT = "Use **texto** para negrito. Deixe uma linha em branco para separar parágrafos.";

const SECTIONS: { key: SiteSectionKey; label: string; description: string; fields: FieldConfig[] }[] = [
  {
    key: "hero",
    label: "Início",
    description: "Primeiro ecrã do site, com o título principal e a imagem do pão.",
    fields: [
      { key: "titleLine1", label: "Título — linha 1", type: "text" },
      { key: "titleLine2", label: "Título — linha 2", type: "text" },
      { key: "subtitle", label: "Subtítulo", type: "text" },
      { key: "text", label: "Texto", type: "textarea", hint: RICH_HINT },
      { key: "buttonLabel", label: "Texto do botão", type: "text" },
      { key: "sideLabel", label: "Texto vertical (lateral)", type: "text" },
      { key: "image", label: "Imagem principal", type: "image" },
      { key: "backgroundImage", label: "Imagem de fundo", type: "image" },
    ],
  },
  {
    key: "selection",
    label: "Produtos",
    description: "Secção “A nossa seleção da”, com a colagem de fotografias.",
    fields: [
      { key: "scriptText", label: "Texto decorativo grande", type: "text" },
      { key: "title", label: "Título", type: "text" },
      { key: "text", label: "Texto", type: "textarea", hint: RICH_HINT },
      { key: "sideLabel", label: "Texto vertical (lateral)", type: "text" },
      { key: "circleText", label: "Texto em círculo", type: "text" },
      { key: "image1", label: "Fotografia 1 (arco)", type: "image" },
      { key: "image2", label: "Fotografia 2", type: "image" },
      { key: "image3", label: "Fotografia 3", type: "image" },
      { key: "image4", label: "Fotografia 4", type: "image" },
      { key: "decorationImage", label: "Ilustração de fundo (trigo)", type: "image" },
    ],
  },
  {
    key: "about",
    label: "Sobre nós",
    description: "Secção “Desde 1881” com a história da padaria.",
    fields: [
      { key: "titleLine1", label: "Título — linha 1", type: "text" },
      { key: "titleLine2", label: "Título — linha 2", type: "text" },
      { key: "text", label: "Texto", type: "textarea", hint: RICH_HINT },
      { key: "bigWord", label: "Palavra grande sobre a imagem", type: "text" },
      { key: "sideLabel", label: "Texto vertical (lateral)", type: "text" },
      { key: "circleText", label: "Texto em círculo", type: "text" },
      { key: "image", label: "Imagem", type: "image" },
    ],
  },
  {
    key: "local",
    label: "Produtos locais",
    description: "Secção verde sobre os produtores locais.",
    fields: [
      { key: "titleLine1", label: "Título — linha 1", type: "text" },
      { key: "titleLine2", label: "Título — linha 2", type: "text" },
      { key: "heading", label: "Subtítulo", type: "text" },
      { key: "text", label: "Texto", type: "textarea", hint: RICH_HINT },
      { key: "bigWord", label: "Palavra grande sobre a imagem", type: "text" },
      { key: "sideLabel", label: "Texto vertical (lateral)", type: "text" },
      { key: "circleText", label: "Texto em círculo", type: "text" },
      { key: "image", label: "Imagem", type: "image" },
    ],
  },
  {
    key: "team",
    label: "Equipa",
    description: "Secção castanha sobre o ambiente de trabalho.",
    fields: [
      { key: "titleLine1", label: "Título — linha 1", type: "text" },
      { key: "titleLine2", label: "Título — linha 2", type: "text" },
      { key: "heading", label: "Subtítulo", type: "text" },
      { key: "text", label: "Texto", type: "textarea", hint: RICH_HINT },
      { key: "bigWord", label: "Palavra grande sobre a imagem", type: "text" },
      { key: "sideLabel", label: "Texto vertical (lateral)", type: "text" },
      { key: "image", label: "Imagem", type: "image" },
    ],
  },
  {
    key: "contacts",
    label: "Contactos",
    description: "Rodapé com morada, telefone, email e redes sociais.",
    fields: [
      { key: "title", label: "Título", type: "text" },
      { key: "address", label: "Morada", type: "textarea", hint: "Cada linha aparece numa linha separada." },
      { key: "phone", label: "Telefone", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "facebookLabel", label: "Texto do Facebook", type: "text" },
      { key: "facebookUrl", label: "Link do Facebook", type: "url" },
      { key: "copyright", label: "Direitos reservados", type: "text", hint: "{ano} é substituído pelo ano atual." },
      { key: "credit", label: "Crédito do website", type: "text", hint: "Deixe vazio para esconder." },
      { key: "creditUrl", label: "Link do crédito", type: "url" },
    ],
  },
  {
    key: "header",
    label: "Cabeçalho",
    description: "Logótipo e textos do menu.",
    fields: [
      { key: "logo", label: "Logótipo", type: "image" },
      { key: "menuProducts", label: "Menu — produtos", type: "text" },
      { key: "menuAbout", label: "Menu — sobre nós", type: "text" },
      { key: "menuContacts", label: "Menu — contactos", type: "text" },
      { key: "menuLogin", label: "Menu — login", type: "text" },
    ],
  },
  {
    key: "map",
    label: "Mapa",
    description: "Mapa do Google entre a equipa e os contactos.",
    fields: [
      {
        key: "embedUrl",
        label: "Link de incorporação do Google Maps",
        type: "url",
        hint: "No Google Maps: Partilhar → Incorporar um mapa → copie o endereço do atributo src. Deixe vazio para esconder o mapa.",
      },
    ],
  },
];

const uploadImage = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${file.name}`;
    const uploadTask = uploadBytesResumable(ref(storage, `site/${fileName}`), file);
    uploadTask.on("state_changed", undefined, reject, () => {
      getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
    });
  });

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-sm transition focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/10";

export default function SiteContentEditor() {
  const { mutate } = useSWRConfig();
  const { data, isLoading } = useSWR(SITE_CONTENT_KEY, get_site_content);
  const saved = useMemo(() => mergeSiteContent(data?.success ? data.data : null), [data]);

  const [draft, setDraft] = useState<SiteContentData>(saved);
  const [activeSection, setActiveSection] = useState<SiteSectionKey>("hero");
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const section = SECTIONS.find((s) => s.key === activeSection)!;
  const values = draft[activeSection] as unknown as Record<string, string>;
  const defaults = siteContentDefaults[activeSection] as unknown as Record<string, string>;

  const setField = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [activeSection]: { ...prev[activeSection], [field]: value } }));
  };

  const handleUpload = async (field: string, file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem tem de ter menos de 5 MB");
      return;
    }
    setUploadingField(field);
    try {
      setField(field, await uploadImage(file));
      toast.success("Imagem carregada. Guarde para publicar.");
    } catch (error) {
      toast.error("Não foi possível carregar a imagem");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await update_site_content(draft);
    setSaving(false);
    if (res?.success) {
      toast.success(res.message);
      mutate(SITE_CONTENT_KEY, { success: true, data: res.data }, false);
    } else {
      toast.error(res?.message || "Erro ao guardar o conteúdo do site");
    }
  };

  const resetSection = () => {
    setDraft((prev) => ({ ...prev, [activeSection]: { ...siteContentDefaults[activeSection] } }));
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl pt-6">
        <div className="h-96 rounded-2xl bg-white border border-line shadow-surface animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl pt-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Conteúdo do site</h1>
          <p className="text-sm !text-ink-muted">
            Edite os textos e imagens do site público da padaria. As alterações só ficam visíveis depois de guardar.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/site"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition hover:border-brand/30 hover:text-brand"
          >
            <FiExternalLink /> Ver site
          </a>
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiSave /> {saving ? "A guardar..." : "Guardar alterações"}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              activeSection === s.key
                ? "bg-brand text-white shadow-md shadow-brand/20"
                : "bg-white text-ink border border-line hover:bg-brand-50 hover:text-brand"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-line shadow-surface">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">{section.label}</h2>
            <p className="text-sm !text-ink-muted">{section.description}</p>
          </div>
          <button
            onClick={resetSection}
            className="inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-ink"
          >
            <FiRotateCcw /> Repor conteúdo original
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 p-6">
          {section.fields.map((field) => {
            const value = values[field.key] ?? "";
            const changed = value !== (saved[activeSection] as unknown as Record<string, string>)[field.key];
            const wide = field.type === "textarea" || field.type === "url";

            return (
              <div key={field.key} className={wide ? "lg:col-span-2" : ""}>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink">
                  {field.label}
                  {changed && <span className="h-1.5 w-1.5 rounded-full bg-brand" title="Alterado" />}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    value={value}
                    onChange={(e) => setField(field.key, e.target.value)}
                    rows={field.key === "address" ? 3 : 7}
                    className={`${inputClass} leading-relaxed`}
                  />
                ) : field.type === "image" ? (
                  <div className="flex gap-4">
                    <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-line bg-canvas">
                      {value && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={value} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <input
                        value={value}
                        onChange={(e) => setField(field.key, e.target.value)}
                        placeholder="Endereço da imagem"
                        className={inputClass}
                      />
                      <div className="flex flex-wrap gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand transition hover:bg-brand-100">
                          <FiUpload />
                          {uploadingField === field.key ? "A carregar..." : "Carregar imagem"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingField !== null}
                            onChange={(e) => {
                              handleUpload(field.key, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {value !== defaults[field.key] && (
                          <button
                            onClick={() => setField(field.key, defaults[field.key])}
                            className="rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:bg-canvas hover:text-ink"
                          >
                            Usar imagem original
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <input
                    value={value}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className={inputClass}
                  />
                )}

                {field.hint && <p className="mt-1.5 text-xs !text-ink-muted">{field.hint}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {isDirty && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-5 py-3 text-sm text-white shadow-xl md:ml-32">
          <span>Tem alterações por guardar</span>
          <button
            onClick={() => setDraft(saved)}
            className="rounded-full px-3 py-1 text-white/70 transition hover:text-white"
          >
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-white px-4 py-1.5 font-medium text-ink transition hover:bg-brand-50"
          >
            {saving ? "A guardar..." : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}
