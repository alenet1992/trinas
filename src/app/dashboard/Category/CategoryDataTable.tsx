"use Client";

import React, { useEffect, useState } from "react";

import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { delete_a_category } from "@/Services/Admin/category";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ICategory } from "@/model/Category";

type CategoryData = {
  _id: string;
  categoryName: string;
  categoryDescription: string;
  categoryImage: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
};

export default function CategoryDataTable() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const [catData, setCatData] = useState<CategoryData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.category);
  const isLoading = useSelector((state: RootState) => state.Admin.catLoading);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<CategoryData[] | []>([]);

  useEffect(() => {
    setCatData(data);
  }, [data]);

  useEffect(() => {
    setFilteredData(catData);
  }, [catData]);

  const columns = [
    {
      name: "Nome",
      selector: (row: ICategory) => row?.name,
      sortable: true,
    },
    // {
    //   name: 'Imagem',
    //   cell: (row: CategoryData) => <Image src={row?.categoryImage} alt='Nenhuma Imagem Encontrada' className='py-2' width={100} height={100} />
    // },
    {
      name: "Ação",
      cell: (row: CategoryData) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button
            onClick={() => router.push(`/category/update-category/${row?._id}`)}
            className=" w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700"
          >
            Atualizar
          </button>
          <button
            onClick={() => handleDeleteCategory(row?._id)}
            className=" w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteCategory = async (id: string) => {
    const res = await delete_a_category(id);
    if (res?.success) {
      toast.success(res?.message);
      mutate("/gettingAllCategoriesFOrAdmin");
    } else {
      toast.error(res?.message);
    }
  };

  useEffect(() => {
    if (search === "") {
      setFilteredData(catData);
    } else {
      setFilteredData(
        catData?.filter((item) => {
          const itemData = item?.categoryName.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        })
      );
    }
  }, [search, catData]);

  return (
    <div className="w-full h-full">
      <div className="text-right m-2 mr-0">
        <Link href={"/category/add-category"}>
          <button className="mb-4 sm:mb-0 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
            Nova categoria
          </button>
        </Link>
      </div>
      <DataTable
        columns={columns as any}
        data={filteredData || []}
        key={"ThisisCategoryData"}
        pagination
        keyField="id"
        title={`Lista de tipos de pratos`}
        fixedHeader
        fixedHeaderScrollHeight="500px"
        selectableRows
        selectableRowsHighlight
        persistTableHead
        progressPending={isLoading}
        progressComponent={<Loading />}
        className="bg-white px-4 h-4/6 "
      />
    </div>
  );
}
