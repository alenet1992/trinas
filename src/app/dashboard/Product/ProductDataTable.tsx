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
            className=" w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700"
          >
            Atualizar
          </button>
          <button
            onClick={() => handleDeleteProduct(row?._id)}
            className=" w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700"
          >
            Eliminar
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
    <div className="w-full h-full">
      <div className="text-right m-2 mr-0">
        <Link href={"/product/add-product"}>
          <button className="mb-4 sm:mb-0 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            <IoIosAddCircle className="mx-2" /> Pratos
          </button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredData || []}
        key={"ThisProductData"}
        pagination
        keyField="id"
        title={`Lista de Pratos`}
        fixedHeader
        fixedHeaderScrollHeight="500px"
        selectableRows
        selectableRowsHighlight
        persistTableHead
        progressPending={isLoading}
        progressComponent={<Loading />}
        subHeader
        subHeaderComponent={
          <input
            className="w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600"
            type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Procurar"}
          />
        }
        className="bg-white px-4 h-4/6 "
      />
    </div>
  );
}
