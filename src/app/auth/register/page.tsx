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
import { get_all_users, update_a_user, delete_a_user } from "@/Services/Admin/user";
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
  // Quando definido, o diálogo edita este utilizador em vez de criar um novo
  user?: UserModel | null;
}

const AddUserDialog = (props: IAddUserDialog) => {
  const { isVisible, handleHideDialog, onUserAdded, user } = props;
  const isEdit = !!user?._id;
  const [loader, setLoader] = useState(false);
  
  type Inputs = {
    name: string;
    email: string;
    password: string;
    role: string;
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Inputs>({
    criteriaMode: "all",
  });

  useEffect(() => {
    if (!isVisible) return;
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "user",
    });
  }, [isVisible, user, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    try {
      const res = isEdit
        ? await update_a_user({
            _id: user?._id,
            name: data.name,
            email: data.email,
            role: data.role,
            // Vazia = manter a password atual
            password: data.password || undefined,
          })
        : await register_me({
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
      toast.error(isEdit ? "Erro ao atualizar usuário" : "Erro ao adicionar usuário");
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
                {isEdit ? "Editar Usuário" : "Adicionar Usuário"}
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
                    color="#003087"
                    ariaLabel="Loading"
                    radius="12"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                  <p className="text-sm mt-3 font-medium text-brand">
                    {isEdit ? "A guardar alterações..." : "Adicionando usuário..."}
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
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-brand focus:border-brand block w-full p-3 sm:p-2.5 transition-shadow duration-200"
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
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-brand focus:border-brand block w-full p-3 sm:p-2.5 transition-shadow duration-200"
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

                    <div className="form-control w-full mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Função
                      </label>
                      <select
                        {...register("role", { required: true })}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-brand focus:border-brand block w-full p-3 sm:p-2.5 transition-shadow duration-200"
                        disabled={!isEdit}
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Administrador</option>
                      </select>
                      {!isEdit && (
                        <span className="text-gray-500 text-xs mt-1.5 block">
                          Novos utilizadores são criados como Usuário. A função pode ser alterada depois em Editar.
                        </span>
                      )}
                    </div>

                    <div className="form-control w-full mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Senha{isEdit ? " (deixe em branco para manter a atual)" : ""}
                      </label>
                      <input
                        {...register("password", { 
                          required: !isEdit,
                          minLength: 8
                        })}
                        type="password"
                        autoComplete="new-password"
                        placeholder={isEdit ? "Nova senha (opcional)" : "Senha do usuário"}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-brand focus:border-brand block w-full p-3 sm:p-2.5 transition-shadow duration-200"
                      />
                      {errors.password && errors.password.type === "required" && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          Este campo é obrigatório
                        </span>
                      )}
                      {errors.password && errors.password.type === "minLength" && (
                        <span className="text-red-500 text-xs mt-1.5 block">
                          A senha deve ter pelo menos 8 caracteres
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
                        className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-lg hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all duration-300"
                      >
                        {isEdit ? "Guardar" : "Adicionar"}
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
  const [editingUser, setEditingUser] = useState<UserModel | null>(null);
  const currentUserId = userAutenticated.checkUser()?._id;
  
  const { data: usersResponse, error } = useSWR(
    "/gettingAllUsersForAdmin",
    get_all_users
  );
  const userData: UserModel[] = usersResponse?.data || [];

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
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditUser(row);
                }}
                className="min-w-[80px] py-2 mr-2 text-xs text-brand hover:text-white my-2 hover:bg-brand border border-brand rounded-lg transition-all duration-300 shadow-sm hover:shadow focus:ring-2 focus:ring-brand/30 focus:outline-none"
              >
                Editar
              </button>
              {row?._id !== currentUserId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(row);
                  }}
                  className="min-w-[80px] py-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow focus:ring-2 focus:ring-red-300 focus:outline-none"
                >
                  Apagar
                </button>
              )}
            </div>
          ),
        }
      : {},
  ];

  useEffect(() => {
    if (usersResponse) {
      setIsLoading(false);
      if (!usersResponse.success) toast.error(usersResponse.message);
    }
  }, [usersResponse]);

  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast.error("Erro ao carregar os utilizadores");
    }
  }, [error]);

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
  }, [search, usersResponse]);

  const handleHideDialog = () => {
    setShowAddUserDialog(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: UserModel) => {
    setEditingUser(user);
    setShowAddUserDialog(true);
  };

  const handleDeleteUser = async (user: UserModel) => {
    if (!user?._id) return;
    if (!window.confirm(`Apagar o utilizador "${user.name}"? Esta ação não pode ser anulada.`)) return;
    const res = await delete_a_user(user._id);
    if (res?.success) {
      toast.success(res?.message);
      mutate("/gettingAllUsersForAdmin");
    } else {
      toast.error(res?.message ?? "Erro ao apagar o utilizador");
    }
  };
  
  const handleUserAdded = () => {
    // Atualizar a lista de utilizadores
    mutate("/gettingAllUsersForAdmin");
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
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-brand focus:border-brand block w-full p-2.5 pl-10 shadow-sm"
              placeholder="Procurar usuário"
              type={"search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingUser(null);
              setShowAddUserDialog(true);
            }}
            className="inline-flex items-center justify-center text-white bg-brand hover:bg-brand-dark focus:ring-4 focus:ring-brand/30 font-medium rounded-full text-sm px-5 py-2.5 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <IoIosAddCircle className="mr-2 text-lg" /> 
            <span className="whitespace-nowrap">Adicionar usuário</span>
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-surface overflow-hidden border border-gray-100 p-6 sm:p-8 flex justify-center items-center min-h-[400px]">
          <Loading />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-surface overflow-hidden border border-gray-100 animate-fadeIn">
          <DataTable
            columns={columns as any}
            data={filteredData || []}
            key={"UserListData"}
            pagination
            keyField="_id"
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
        user={editingUser}
      />
      
      <ToastContainer />
    </div>
  );
}
