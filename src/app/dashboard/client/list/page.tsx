"use client";

import React, { useEffect, useState } from "react";

import useSWR, { useSWRConfig } from "swr";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { get_all_clientes } from "@/Services/Admin/product";
import Link from "next/link";
import { IoIosAddCircle } from "react-icons/io";
import { ClientModel } from "@/model/Client";
import { delete_a_client } from "@/Services/Admin/cliente";
import { toast } from "react-toastify";
import { userAutenticated } from "@/Services/auth/UserAutenticated";
import { Dialog } from "@/components/Dialog";

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
  const isLoading = useSelector(
    (state: RootState) => state.Admin.productLoading
  );
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<ClientModel[] | []>([]);
  const [userInfo, setUserInfo] = useState<ClientModel>();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { data: clientData } = useSWR(
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
                className=" w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700"
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
        clientData.data?.filter((item: ClientModel) => {
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
  }, [search, prodData]);

  useEffect(() => {
    clientData?.data && setFilteredData(clientData.data);
  }, [clientData]);

  const handleHideDialog = () => {
    console.log("handleHideDialog");
    setIsVisible(false);
  };

  return (
    <div className={`w-full h-full ${withPadding ? " p-12" : ""}`}>
      <div className="text-right m-2 mr-0">
        <Link href={"/dashboard/client/add-client"}>
          <button className="mb-4 sm:mb-0 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            <IoIosAddCircle className="mx-2" /> Adicionar cliente
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
            <>
              <div className="relative w-full">
                <input
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5   dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Porcurar cliente"
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
        />
      </div>
      <Dialog
        isVisible={isVisible}
        info={userInfo}
        handleHideDialog={handleHideDialog}
      ></Dialog>
    </div>
  );
}
