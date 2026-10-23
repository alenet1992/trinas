"use client";

import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { get_all_clientes } from "@/Services/Admin/product";
import { IoIosAddCircle } from "react-icons/io";
import { ClientModel } from "@/model/Client";
import { delete_a_client } from "@/Services/Admin/cliente";
import { toast } from "react-toastify";
import { userAutenticated } from "@/Services/auth/UserAutenticated";
import { Dialog } from "@/components/Dialog";
import { AddClientDialog } from "@/components/AddClientDialog";
import { userData } from '@/model/User';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";


export default function ClientList() {
  const { mutate } = useSWRConfig();
  const withPadding = !userAutenticated.isAdmin();
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ClientModel[] | []>([]);
  const [userInfo, setUserInfo] = useState<ClientModel>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddClientDialog, setShowAddClientDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientModel | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth < 640 : false);
  const Router = useRouter();
  const dispatch = useDispatch();

  const { data: clientData, error } = useSWR(
    "/gettingAllClientesFOrAdmin",
    get_all_clientes
  );

  const columns = [
    {
      name: "Nome",
      selector: (row: ClientModel) => row?.name,
      sortable: true,
      wrap: true,
      minWidth: '120px',
    },
    {
      name: "Morada",
      selector: (row: ClientModel) => row?.address,
      sortable: true,
      wrap: true,
      minWidth: '150px',
      omit: isMobile,
    },
    {
      name: "Contacto",
      selector: (row: ClientModel) => row?.contact,
      sortable: true,
      wrap: true,
      minWidth: '100px',
    },
    {
      name: "Observações",
      selector: (row: ClientModel) => row?.note,
      sortable: true,
      wrap: true,
      minWidth: '120px',
      omit: isSmallScreen,
    },
    {
      name: "Ações",
      cell: (row: ClientModel) => (
        <div className="flex flex-col sm:flex-row items-center justify-start px-1 sm:px-2 py-1 h-auto sm:h-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditCliente(row);
            }}
            className="w-full sm:w-20 py-1 sm:py-2 mx-1 sm:mx-2 text-xs text-brand hover:text-white my-1 sm:my-2 hover:bg-brand border border-brand rounded-full transition-all duration-300 shadow-sm hover:shadow"
          >
            Editar
          </button>
          {userAutenticated.isAdmin() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCliente(row?._id as string);
              }}
              className="w-full sm:w-20 py-1 sm:py-2 mx-1 sm:mx-2 text-xs text-red-600 hover:text-white my-1 sm:my-2 hover:bg-red-600 border border-red-600 rounded-full transition-all duration-300 shadow-sm hover:shadow"
            >
              Apagar
            </button>
          )}
        </div>
      ),
      minWidth: "120px",
    },
  ];

  const handleEditCliente = (client: ClientModel) => {
    setEditingClient(client);
    setShowAddClientDialog(true);
  };

  const handleDeleteCliente = async (id: string = "") => {
    const res = await delete_a_client(id);
    if (res?.success) {
      toast.success(res?.message);
      mutate("/gettingAllClientesFOrAdmin");
    } else {
      toast.error(res?.message);
    }
  };

  useEffect(() => {
    if (search === "") {
      setFilteredData(clientData?.data);
    } else {
      setFilteredData(
        clientData?.data?.filter((item: ClientModel) => {
          const textData = search.toUpperCase();
          // procurar por nome, nif, contacto e morada
          return [item?.name, item?.nif, item?.contact, item?.address].some(
            (value) => value?.toString().toUpperCase().includes(textData)
          );
        })
      );
    }
  }, [search, clientData?.data]);

  useEffect(() => {
    if (clientData) {
      setFilteredData(clientData.data || []);
      setIsLoading(false);
      if (!clientData.success) toast.error(clientData.message);
    }
  }, [clientData]);
  
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast.error("Erro ao carregar os dados dos clientes");
    }
  }, [error]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const user: userData | null = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    if (!Cookies.get("token")) {
      Router.push("/");
    }
  }, [dispatch, Cookies, Router]);

  const handleHideDialog = () => {
    setIsVisible(false);
  };
  
  const handleClientAdded = () => {
    // Atualizar a lista de clientes
    mutate("/gettingAllClientesFOrAdmin");
  };

  return (
    <div className={`w-full h-full ${withPadding ? "" : ""} p-3 md:p-6 `}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3 md:mb-0">Lista de Clientes</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              id="simple-search"
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-brand focus:border-brand block w-full pl-10 p-2.5 shadow-sm"
              placeholder="Procurar cliente"
              type={"search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingClient(null);
              setShowAddClientDialog(true);
            }}
            className="inline-flex items-center justify-center text-white bg-brand hover:bg-brand-dark focus:ring-4 focus:ring-brand/30 font-medium rounded-full text-sm px-4 py-2 md:px-5 md:py-2.5 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <IoIosAddCircle className="mr-1 md:mr-2 text-base md:text-lg" /> Adicionar cliente
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-surface overflow-hidden border border-gray-100 p-4 md:p-8 flex justify-center items-center min-h-[300px] md:min-h-[400px]">
          <div className="scale-75 md:scale-100">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-surface overflow-hidden border border-gray-100 animate-fadeIn overflow-x-auto">
          <DataTable
            columns={columns as any}
            data={filteredData || []}
            key={"ThisClienttData"}
            pagination
            keyField="_id"
            fixedHeader
            fixedHeaderScrollHeight="100%"
            persistTableHead
            responsive
            className="bg-white"
            onRowClicked={(e) => {
              setUserInfo(e);
              setIsVisible(true);
            }}
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#f9fafb',
                  borderBottomWidth: '1px',
                  borderBottomColor: '#e5e7eb',
                  '@media (max-width: 768px)': {
                    paddingTop: '8px',
                    paddingBottom: '8px',
                  },
                },
              },
              headCells: {
                style: {
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#4b5563',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  '@media (min-width: 768px)': {
                    fontSize: '0.875rem',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                  },
                },
              },
              cells: {
                style: {
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  '@media (min-width: 768px)': {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                  },
                },
              },
              rows: {
                style: {
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  minHeight: '48px',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    transition: '0.2s',
                  },
                  '@media (min-width: 768px)': {
                    fontSize: '0.875rem',
                    minHeight: '52px',
                  },
                },
                highlightOnHoverStyle: {
                  backgroundColor: '#f3f4f6',
                  borderRadius: '4px',
                  outline: '1px solid #e5e7eb',
                  transition: '0.2s',
                },
              },
              pagination: {
                style: {
                  borderTopWidth: '1px',
                  borderTopColor: '#e5e7eb',
                  fontSize: '0.75rem',
                  '@media (min-width: 768px)': {
                    fontSize: '0.875rem',
                  },
                },
                pageButtonsStyle: {
                  borderRadius: '50%',
                  height: '32px',
                  width: '32px',
                  padding: '6px',
                  margin: '0px 2px',
                  cursor: 'pointer',
                  transition: '0.2s',
                  color: '#4b5563',
                  fill: '#4b5563',
                  backgroundColor: 'transparent',
                  '@media (min-width: 768px)': {
                    height: '40px',
                    width: '40px',
                    padding: '8px',
                    margin: '0px 4px',
                  },
                  '&:disabled': {
                    cursor: 'not-allowed',
                    color: '#9ca3af',
                    fill: '#9ca3af',
                  },
                  '&:hover:not(:disabled)': {
                    backgroundColor: '#f3f4f6',
                  },
                  '&:focus': {
                    outline: 'none',
                    backgroundColor: '#e5e7eb',
                  },
                },
              },
            }}
          />
        </div>
      )}
      
      <Dialog
        isVisible={isVisible}
        info={userInfo}
        handleHideDialog={handleHideDialog}
      ></Dialog>
      
      <AddClientDialog
         isVisible={showAddClientDialog}
         handleHideDialog={() => {
           setShowAddClientDialog(false);
           setEditingClient(null);
         }}
         onClientAdded={handleClientAdded}
         client={editingClient}
       />
    </div>
  );
}