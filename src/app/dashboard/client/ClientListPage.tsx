"use Client";

import React, { useEffect, useState } from "react";

import useSWR, { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { useRouter } from "next/navigation";
import { delete_a_product, get_all_clientes } from "@/Services/Admin/product";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";
import { ClientModel } from "@/model/Client";
import { Button } from "bosch-react-ui";

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
  const router = useRouter();
  const [prodData, setprodData] = useState<ProductData[] | []>([]);
  const isLoading = useSelector(
    (state: RootState) => state.Admin.productLoading
  );
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ClientModel[] | []>([]);

  const { data: clientData, isLoading: clientLoading } = useSWR(
    "/gettingAllClientesFOrAdmin",
    get_all_clientes
  );

  useEffect(() => {
    clientData?.data && setFilteredData(clientData.data);
  }, [clientData]);

  const columns = [
    {
      name: "Name",
      selector: (row: ClientModel) => row?.name,
      sortable: true,
    },
    {
      name: "Street",
      selector: (row: ClientModel) => row?.street,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: ClientModel) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button
            onClick={() => router.push(`/product/update-product/${row?._id}`)}
            className=" w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700"
          >
            Update
          </button>
          <button
            onClick={() => handleDeleteCliente(row?._id)}
            className=" w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteCliente = async (id: String = "") => {
    // const res = await delete_a_product(id);
    // if (res?.success) {
    //   toast.success(res?.message);
    //   mutate("/gettingAllProductsFOrAdmin");
    // } else {
    //   toast.error(res?.message);
    // }
  };

  useEffect(() => {
    if (search === "") {
      //setFilteredData(prodData);
    } else {
      // setFilteredData(
      //   prodData?.filter((item) => {
      //     const itemData = item?.productCategory?.categoryName.toUpperCase();
      //     const textData = search.toUpperCase();
      //     return itemData.indexOf(textData) > -1;
      //   })
      // );
    }
  }, [search, prodData]);

  return (
    <div className="w-full h-full">
      <div className="text-right m-2 mr-0">
        <Link href={"/dashboard/client/add-client"}>
          <button className="mb-4 sm:mb-0 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            <IoIosAddCircle className="mx-2" /> Add Cliente
          </button>
        </Link>
      </div>
      <div className="shadow-xl table-effect">
        <DataTable
          columns={columns as any}
          data={filteredData || []}
          key={"ThisClienttData"}
          pagination
          keyField="id"
          title={`Lista de clientes`}
          fixedHeader
          fixedHeaderScrollHeight="100%"
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
          className="bg-white px-4 "
        />
      </div>
    </div>
  );
}
