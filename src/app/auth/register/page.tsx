"use client";

import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircle } from "react-icons/io";
import { userAutenticated } from "@/Services/auth/UserAutenticated";
import { useForm, SubmitHandler } from "react-hook-form";
import { register_me } from "@/Services/auth";
import { Grid } from 'react-loader-spinner';

// Interface para o modelo de usuário
interface UserModel {
  _id?: string;
  name: string;
  email: string;
  role: string;
}

// Componente de diálogo para adicionar usuário
interface IAddUserDialog {
  isVisible: boolean;
  handleHideDialog: () => void;
  onUserAdded?: () => void;
}

const AddUserDialog = (props: IAddUserDialog) => {
  const { isVisible, handleHideDialog, onUserAdded } = props;
  const [loader, setLoader] = useState(false);
  
  type Inputs = {
    name: string;
    email: string;
    password: string;
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    try {
      const res = await register_me({
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      if (res.success) {
        toast.success(res?.message);
        // Resetar o formulário
        reset();
        // Fechar o diálogo
        handleHideDialog();
        // Callback opcional
        if (onUserAdded) {
          onUserAdded();
        }
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error("Erro ao adicionar usuário");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <div
        id="add-user-modal"
        data-modal-backdrop="static"
        aria-hidden="true"
        className={`${
          !isVisible ? "hidden" : ""
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[100dvh]`}
        style={{ backgroundColor: "rgba(17, 24, 39, 0.7)", backdropFilter: "blur(4px)" }}
      >
        <div className="p-3 sm:p-4 w-full max-w-2xl max-h-[95dvh] mx-auto animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b rounded-t border-gray-100">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Adicionar Usuário
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-all duration-200"
                data-modal-hide="add-user-modal"
                onClick={handleHideDialog}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Fechar</span>
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-5 space-y-4 bg-gray-50 bg-opacity-50 rounded-b-2xl max-h-[calc(95dvh-4rem)] overflow-y-auto">
              {loader ? (
                <div className="w-full flex-col h-48 sm:h-64 flex items-center justify-center">
                  <Grid
                    height="40"
                    width="40"
                    color="#2563eb"
                    ariaLabel="Loading"
                    radius="12"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                  <p className="text-sm mt-3 font-medium text-blue-600">
                    Adicionando usuário...
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-start justify-center">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full py-2 flex-col"
                  >
                    <div className="form-control w-full mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nome
                      </label>
                      <input
                        {...register("name", { required: true })}
                        type="text"
                        placeholder="Nome do usuário"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 sm:p-2.5 transition-shadow duration-200"
                      />
                      {errors.name && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          Este campo é obrigatório
                        </span>
                      )}
                    </div>

                    <div className="form-control w-full mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        {...register("email", { 
                          required: true,
                          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        })}
                        type="email"
                        placeholder="Email do usuário"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 sm:p-2.5 transition-shadow duration-200"
                      />
                      {errors.email && errors.email.type === "required" && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          Este campo é obrigatório
                        </span>
                      )}
                      {errors.email && errors.email.type === "pattern" && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          Email inválido
                        </span>
                      )}
                    </div>

                    <div className="form-control w-full mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Senha
                      </label>
                      <input
                        {...register("password", { 
                          required: true,
                          minLength: 6
                        })}
                        type="password"
                        placeholder="Senha do usuário"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 sm:p-2.5 transition-shadow duration-200"
                      />
                      {errors.password && errors.password.type === "required" && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          Este campo é obrigatório
                        </span>
                      )}
                      {errors.password && errors.password.type === "minLength" && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          A senha deve ter pelo menos 6 caracteres
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={handleHideDialog}
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-[#373a4e] rounded-lg hover:bg-[#373a4e]/90 focus:outline-none focus:ring-2 focus:ring-[#373a4e]/50 transition-all duration-300"
                      >
                        Adicionar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente principal de listagem de usuários
export default function UserList() {
  const { mutate } = useSWRConfig();
  const withPadding = !userAutenticated.isAdmin();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<UserModel[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  
  // Dados de exemplo para usuários (em um cenário real, isso viria de uma API)
  const [userData, setUserData] = useState<UserModel[]>([
    { _id: "1", name: "Admin", email: "admin@example.com", role: "admin" },
    { _id: "2", name: "Usuário Teste", email: "user@example.com", role: "user" },
    { _id: "3", name: "João Silva", email: "joao@example.com", role: "user" },
  ]);

  const columns = [
    {
      name: "Nome",
      selector: (row: UserModel) => row?.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: UserModel) => row?.email,
      sortable: true,
    },
    {
      name: "Função",
      selector: (row: UserModel) => row?.role === "admin" ? "Administrador" : "Usuário",
      sortable: true,
    },
    userAutenticated.isAdmin()
      ? {
          name: "Ações",
          width: "200px",
          cell: (row: UserModel) => (
            <div className="flex items-center justify-start h-20 pr-4">
              <button 
                className="min-w-[80px] py-2 mr-2 text-xs text-blue-600 hover:text-white my-2 hover:bg-[#373a4e] border border-blue-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                Editar
              </button>
              <button
                className="min-w-[80px] py-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow focus:ring-2 focus:ring-red-300 focus:outline-none"
              >
                Apagar
              </button>
            </div>
          ),
        }
      : {},
  ];

  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setFilteredData(userData);
      setIsLoading(false);
    }, 1000);
  }, [userData]);

  useEffect(() => {
    if (search === "") {
      setFilteredData(userData);
    } else {
      setFilteredData(
        userData?.filter((item: UserModel) => {
          const nameMatch = item?.name?.toUpperCase().indexOf(search.toUpperCase()) > -1;
          const emailMatch = item?.email?.toUpperCase().indexOf(search.toUpperCase()) > -1;
          const roleMatch = item?.role?.toUpperCase().indexOf(search.toUpperCase()) > -1;
          return nameMatch || emailMatch || roleMatch;
        })
      );
    }
  }, [search, userData]);

  const handleHideDialog = () => {
    setShowAddUserDialog(false);
  };
  
  const handleUserAdded = () => {
    // Em um cenário real, aqui atualizaríamos a lista de usuários
    // mutate("/api/users");
    
    // Para o exemplo, vamos apenas simular a adição de um novo usuário
    const newUser: UserModel = {
      _id: (userData.length + 1).toString(),
      name: "Novo Usuário",
      email: `usuario${userData.length + 1}@example.com`,
      role: "user"
    };
    
    setUserData([...userData, newUser]);
  };

  return (
    <div className={`w-full h-full ${withPadding ? "px-4 md:px-8 lg:px-12" : ""} pt-6 md:pt-12`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Lista de Utilizadores</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              id="simple-search"
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10 shadow-sm"
              placeholder="Procurar usuário"
              type={"search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddUserDialog(true)}
            className="inline-flex items-center justify-center text-white bg-[#373a4e] hover:bg-[#2f3141] focus:ring-4 focus:ring-[#373a4e]/30 font-medium rounded-full text-sm px-5 py-2.5 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <IoIosAddCircle className="mr-2 text-lg" /> 
            <span className="whitespace-nowrap">Adicionar usuário</span>
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6 sm:p-8 flex justify-center items-center min-h-[400px]">
          <Loading />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fadeIn">
          <DataTable
            columns={columns as any}
            data={filteredData || []}
            key={"UserListData"}
            pagination
            keyField="id"
            fixedHeaderScrollHeight="calc(100vh - 300px)"
            selectableRows
            selectableRowsHighlight
            persistTableHead
            className="bg-white"
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#f9fafb',
                  borderBottomWidth: '1px',
                  borderBottomColor: '#e5e7eb',
                  fontSize: '14px',
                  fontWeight: '600',
                },
              },
              headCells: {
                style: {
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                },
              },
              rows: {
                style: {
                  minHeight: '72px',
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                  },
                },
              },
              cells: {
                style: {
                  paddingLeft: '16px',
                  paddingRight: '16px',
                },
              },
              pagination: {
                style: {
                  borderTopWidth: '1px',
                  borderTopColor: '#e5e7eb',
                  fontSize: '14px',
                },
                pageButtonsStyle: {
                  borderRadius: '0.5rem',
                  height: '32px',
                  minWidth: '32px',
                  padding: '0 6px',
                  margin: '0 4px',
                  cursor: 'pointer',
                  transition: 'all .2s ease-in-out',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  '&:hover:not(:disabled)': {
                    backgroundColor: '#f3f4f6',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
                  },
                },
              },
            }}
            noDataComponent={
              <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                <p className="text-sm">Tente ajustar sua pesquisa</p>
              </div>
            }
          />
        </div>
      )}
      
      {/* Diálogo para adicionar usuário */}
      <AddUserDialog 
        isVisible={showAddUserDialog} 
        handleHideDialog={handleHideDialog} 
        onUserAdded={handleUserAdded}
      />
      
      <ToastContainer />
    </div>
  );
}
