'use client';

import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { delete_a_product, get_all_products } from "@/Services/Admin/product";
import { IoIosAddCircle } from "react-icons/io";

import AddProductModal from "@/components/AddProductModal";

type ProductData = {
  _id: string;
  name: string;
  description: string;
  productImage: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function ProductDataTable() {
  const { mutate } = useSWRConfig();
  const [prodData, setprodData] = useState<ProductData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.product);
  const isLoading = useSelector(
    (state: RootState) => state.Admin.productLoading
  );
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ProductData[] | []>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const { data: productData } = useSWR(
    "/gettingAllProductsFOrAdmin",
    get_all_products
  );

  useEffect(() => {
    setprodData(data);
  }, [data]);

  useEffect(() => {
    setFilteredData(productData?.data);
  }, [productData]);

  const columns = [
    {
      name: "Nome",
      selector: (row: ProductData) => row?.name,
      sortable: true,
    },
    {
      name: "Categoria",
      selector: (row: ProductData) => row?.category?.name,
      sortable: true,
    },
    {
      name: "Descrição",
      cell: (row: ProductData) => <p>{row.description}</p>,
    },
    {
      name: "Ação",
      cell: (row: ProductData) => (
        <div className="flex items-center justify-start px-2">
          <button
            onClick={() => {
              setSelectedProductId(row?._id);
              setIsEditModalOpen(true);
            }}
            className="min-w-[80px] py-2 mx-1 text-xs text-[#373a4e] hover:text-white my-2 hover:bg-[#373a4e] border border-[#373a4e] rounded-full transition-all duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#373a4e]/20"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteProduct(row?._id)}
            className="min-w-[80px] py-2 mx-1 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded-full transition-all duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            Apagar
          </button>
        </div>
      ),
      right: true,
    },
  ];

  const handleDeleteProduct = async (id: string) => {
    const res = await delete_a_product(id);
    if (res?.success) {
      toast.success(res?.message);
      mutate("/gettingAllProductsFOrAdmin");
    } else {
      toast.error(res?.message);
    }
  };

  useEffect(() => {
    if (search === "") {
      setFilteredData(prodData);
    } else {
      setFilteredData(
        prodData?.filter((item) => {
          const itemData = item?.category?.name.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        })
      );
    }
  }, [search, prodData]);

  return (
    <div className="w-full h-full pt-8">
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productId={selectedProductId}
        isEditing={true}
        onSuccess={() => mutate("/gettingAllProductsFOrAdmin")}
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => mutate("/gettingAllProductsFOrAdmin")}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Lista de Pratos</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              placeholder="Procurar prato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center text-white bg-[#373a4e] hover:bg-[#2f3141] focus:ring-4 focus:ring-[#373a4e]/30 font-medium rounded-full text-sm px-5 py-2.5 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <IoIosAddCircle className="mr-2 text-lg" /> Novo Prato
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="relative min-h-[400px]">
          <DataTable
            columns={columns}
            data={filteredData || []}
            key={"ThisProductData"}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
            keyField="id"
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 300px)"
            selectableRows
            selectableRowsHighlight
            persistTableHead
            progressPending={isLoading}
            progressComponent={
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
                <div className="text-center">
                  <Loading />
                  <p className="mt-2 text-sm text-gray-500">Loading produtos...</p>
                </div>
              </div>
            }
            noDataComponent={
              <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                <p className="text-lg font-medium">Nenhum produto encontrado</p>
                <p className="text-sm">Tente ajustar sua pesquisa ou adicione um novo produto.</p>
              </div>
            }
            className="bg-white"
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#f9fafb',
                  borderBottomWidth: '1px',
                  borderBottomColor: '#e5e7eb',
                  fontSize: '14px',
                  color: '#374151',
                  minHeight: '48px',
                },
              },
              headCells: {
                style: {
                  padding: '12px 16px',
                  fontWeight: '600',
                },
              },
              rows: {
                style: {
                  fontSize: '14px',
                  color: '#1f2937',
                  backgroundColor: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    transition: 'all .2s ease',
                  },
                  minHeight: '72px',
                },
              },
              cells: {
                style: {
                  padding: '16px',
                },
              },
              pagination: {
                style: {
                  borderTopWidth: '1px',
                  borderTopColor: '#e5e7eb',
                  fontSize: '14px',
                  color: '#374151',
                  backgroundColor: '#ffffff',
                  minHeight: '64px',
                },
                pageButtonsStyle: {
                   borderRadius: '6px',
                   height: '32px',
                   minWidth: '32px',
                   padding: '0 6px',
                   margin: '0 2px',
                   cursor: 'pointer',
                   transition: 'all .2s ease',
                   backgroundColor: '#ffffff',
                   '&:disabled': {
                     cursor: 'not-allowed',
                     opacity: '0.4',
                   },
                   '&:hover:not(:disabled)': {
                     backgroundColor: '#f3f4f6',
                   },
                 },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
