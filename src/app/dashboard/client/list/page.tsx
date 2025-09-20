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

type ProductData = {
  _id: string;
  productName: string;
  productDescription: string;
  productImage: string;
  productSlug: string;
  productPrice: Number;
  productQuantity: Number;
  productFeatured: Boolean;
  productCategory: {
    _id: string;
    categoryName: string;
    categorySlug: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function ClientListPage() {
  const { mutate } = useSWRConfig();
  const withPadding = !userAutenticated.isAdmin();
  const [prodData, setprodData] = useState<ProductData[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ClientModel[] | []>([]);
  const [userInfo, setUserInfo] = useState<ClientModel>();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showAddClientDialog, setShowAddClientDialog] = useState<boolean>(false);

  const { data: clientData, error } = useSWR(
    "/gettingAllClientesFOrAdmin",
    get_all_clientes
  );

  const columns = [
    {
      name: "Nome",
      selector: (row: ClientModel) => row?.name,
      sortable: true,
    },
    {
      name: "Morada",
      selector: (row: ClientModel) => row?.address,
      sortable: true,
    },
    {
      name: "Contacto",
      selector: (row: ClientModel) => row?.contact,
      sortable: true,
    },
    {
      name: "Observações",
      selector: (row: ClientModel) => row?.note,
      sortable: true,
    },
    userAutenticated.isAdmin()
      ? {
          name: "Ações",
          cell: (row: ClientModel) => (
            <div className="flex items-center justify-start px-2 h-20">
              {/* <button
            onClick={() => router.push(`/product/update-product/${row?._id}`)}
            className=" w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700"
          >
            Atualizar
          </button> */}
              <button
                onClick={() => handleDeleteCliente(row?._id as string)}
                className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded-full transition-all duration-300 shadow-sm hover:shadow"
              >
                Apagar
              </button>
            </div>
          ),
        }
      : {},
  ];

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
          let itemData = item?.name?.toUpperCase();
          const textData = search.toUpperCase();
          // search on name
          if (itemData.indexOf(textData) > -1) {
            return itemData.indexOf(textData) > -1;
          }
          // search on nif
          itemData = item?.nif?.toUpperCase();
          if (itemData?.indexOf(textData) > -1) {
            return itemData.indexOf(textData) > -1;
          }

          // search on contact
          itemData = item?.contact.toString();
          if (itemData?.indexOf(textData) > -1) {
            return itemData.indexOf(textData) > -1;
          }

          itemData = item?.address.toLowerCase();
          if (itemData?.indexOf(textData) > -1) {
            return itemData.indexOf(textData) > -1;
          }
        })
      );
    }
  }, [search, clientData?.data]);

  useEffect(() => {
    if (clientData?.data) {
      setFilteredData(clientData.data);
      setIsLoading(false);
    }
  }, [clientData]);
  
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      toast.error("Erro ao carregar os dados dos clientes");
    }
  }, [error]);

  const handleHideDialog = () => {
    console.log("handleHideDialog");
    setIsVisible(false);
  };
  
  const handleClientAdded = () => {
    // Atualizar a lista de clientes
    mutate("/gettingAllClientesFOrAdmin");
  };

  return (
    <div className={`w-full h-full ${withPadding ? " p-12" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Lista de Clientes</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              id="simple-search"
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
              placeholder="Procurar cliente"
              type={"search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddClientDialog(true)}
            className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 transition-all duration-300 shadow-md hover:shadow-lg">
            <IoIosAddCircle className="mr-2 text-lg" /> Adicionar cliente
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fadeIn">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-fadeIn">
          <DataTable
            columns={columns as any}
            data={filteredData || []}
            key={"ThisClienttData"}
            pagination
            keyField="id"
            fixedHeader
            fixedHeaderScrollHeight="100%"
            selectableRows
            selectableRowsHighlight
            persistTableHead
            subHeader
          subHeaderComponent={
            <>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  id="simple-search"
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 shadow-sm"
                  placeholder="Procurar cliente"
                  type={"search"}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          }
          className="bg-white px-4"
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
              },
            },
            headCells: {
              style: {
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#4b5563',
                paddingLeft: '16px',
                paddingRight: '16px',
              },
            },
            rows: {
              style: {
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                  transition: '0.2s',
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
              },
              pageButtonsStyle: {
                borderRadius: '50%',
                height: '40px',
                width: '40px',
                padding: '8px',
                margin: '0px 4px',
                cursor: 'pointer',
                transition: '0.2s',
                color: '#4b5563',
                fill: '#4b5563',
                backgroundColor: 'transparent',
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
         handleHideDialog={() => setShowAddClientDialog(false)}
         onClientAdded={handleClientAdded}
       />
    </div>
  );
}
