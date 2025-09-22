"use Client";

import React, { useEffect, useState } from "react";

import useSWR, { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { useRouter } from "next/navigation";
import { delete_a_product, get_all_products } from "@/Services/Admin/product";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";

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
  const router = useRouter();
  const [prodData, setprodData] = useState<ProductData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.product);
  const isLoading = useSelector(
    (state: RootState) => state.Admin.productLoading
  );
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ProductData[] | []>([]);

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
      name: "Imagem",
      cell: (row: ProductData) => <p>{row.createdAt}</p>,
    },
    {
      name: "Ação",
      cell: (row: ProductData) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button
            onClick={() => router.push(`/product/update-product/${row?._id}`)}
            className="w-20 py-2 mx-2 text-xs text-[#373a4e] hover:text-white my-2 hover:bg-[#373a4e] border border-[#373a4e] rounded-full transition-all duration-300 shadow-sm hover:shadow"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteProduct(row?._id)}
            className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded-full transition-all duration-300 shadow-sm hover:shadow"
          >
            Apagar
          </button>
        </div>
      ),
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
    <div className="w-full h-full pt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Lista de Pratos</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
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
          <Link href={"/product/add-product"}>
            <button className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 transition-all duration-300 shadow-md hover:shadow-lg">
              <IoIosAddCircle className="mr-2 text-lg" /> Novo Prato
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
         <DataTable
          columns={columns}
          data={filteredData || []}
          key={"ThisProductData"}
          pagination
          keyField="id"
          fixedHeader
          fixedHeaderScrollHeight="100%"
          selectableRows
          selectableRowsHighlight
          persistTableHead
          progressPending={isLoading}
          progressComponent={<Loading />}
          subHeader
          className="bg-white px-4"
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#f9fafb',
                borderBottomWidth: '1px',
                borderBottomColor: '#e5e7eb',
              },
            },
            rows: {
              style: {
                minHeight: '72px',
                fontSize: '14px',
              },
            },
            pagination: {
              style: {
                borderTopWidth: '1px',
                borderTopColor: '#e5e7eb',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
