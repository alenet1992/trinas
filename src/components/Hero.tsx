import Link from "next/link";
import React, { useEffect, useState } from "react";
import { userAutenticated } from "@/Services/auth/UserAutenticated";
import PublicSiteLoader from "@/components/site/PublicSiteLoader";
import { IoIosAddCircle } from 'react-icons/io';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiUsers, FiSettings, FiArrowUpRight } from 'react-icons/fi';

interface IProps {
  setRatio: (value: number) => void;
}

export default function Hero({ setRatio }: IProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [checked, setChecked] = useState(false);
  
  useEffect(() => {
    const user = userAutenticated.checkUser();
    setIsAuthenticated(!!user && Object.keys(user).length > 0);
    setIsUser(user?.role === "user");
    setChecked(true);
  }, []);

  if (!checked) return <div className="w-full min-h-screen bg-grey" />;

  return (
    <div className="w-full min-h-screen relative bg-grey">

      {isAuthenticated ? (
        <div className="w-full min-h-screen relative bg-canvas pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <header className="mb-10 text-center sm:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-line shadow-surface px-3 py-1 text-xs font-medium text-ink-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Trinas · Gestão de Encomendas
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-ink">O que vamos fazer hoje?</h1>
              <p className="mt-2 text-base sm:text-lg text-ink-muted">Sistema integrado para gestão eficiente de encomendas e clientes</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Card para Criação de Encomenda */}
              <Link href="/order/view-orders" className="group">
                <div className="h-full rounded-2xl bg-brand p-6 flex flex-col shadow-lg shadow-brand/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-brand-dark group-hover:shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center">
                      <IoIosAddCircle className="text-2xl text-white" />
                    </div>
                    <FiArrowUpRight className="text-xl text-white/60 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Criação de Encomenda</h2>
                  <p className="mt-1 text-sm text-white/70">Adicione novas encomendas ao sistema</p>
                </div>
              </Link>

              {/* Card para Lista de Encomendas do Dia */}
              <Link href="/order/daily-orders" className="group">
                <div className="h-full rounded-2xl bg-white border border-line p-6 flex flex-col shadow-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand/20 group-hover:shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                      <HiOutlineDocumentText className="text-2xl text-brand" />
                    </div>
                    <FiArrowUpRight className="text-xl text-ink-muted transition-all duration-300 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h2 className="text-lg font-semibold text-ink">Encomendas do Dia</h2>
                  <p className="mt-1 text-sm text-ink-muted">Visualize todas as encomendas diárias</p>
                </div>
              </Link>

              {/* Card para Lista de Clientes */}
              <Link href="/client/list" className="group">
                <div className="h-full rounded-2xl bg-white border border-line p-6 flex flex-col shadow-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand/20 group-hover:shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                      <FiUsers className="text-2xl text-brand" />
                    </div>
                    <FiArrowUpRight className="text-xl text-ink-muted transition-all duration-300 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h2 className="text-lg font-semibold text-ink">Lista de Clientes</h2>
                  <p className="mt-1 text-sm text-ink-muted">Gerencie todos os clientes cadastrados</p>
                </div>
              </Link>

              {/* Card para Configurações */}
              {!isUser && (
                <Link href="/dashboard" className="group">
                  <div className="h-full rounded-2xl bg-white border border-line p-6 flex flex-col shadow-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand/20 group-hover:shadow-lg">
                    <div className="flex items-center justify-between mb-8">
                      <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                        <FiSettings className="text-2xl text-brand" />
                      </div>
                      <FiArrowUpRight className="text-xl text-ink-muted transition-all duration-300 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <h2 className="text-lg font-semibold text-ink">Configurações</h2>
                    <p className="mt-1 text-sm text-ink-muted">Gerencie as configurações do sistema</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <PublicSiteLoader />
      )}
    </div>
  );
}
