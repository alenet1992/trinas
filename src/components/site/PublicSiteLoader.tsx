"use client";

import React from "react";
import useSWR from "swr";
import PublicSite from "@/components/site/PublicSite";
import { get_site_content } from "@/Services/common/siteContent";
import { mergeSiteContent } from "@/utils/siteContentDefaults";

export const SITE_CONTENT_KEY = "/gettingSiteContent";

export default function PublicSiteLoader() {
  const { data, error } = useSWR(SITE_CONTENT_KEY, get_site_content);

  // Enquanto carrega mostra só a cor de fundo, para não piscar texto antigo
  if (!data && !error) {
    return <div className="min-h-screen" style={{ backgroundColor: "#2a2420" }} />;
  }

  return <PublicSite content={mergeSiteContent(data?.success ? data.data : null)} />;
}
