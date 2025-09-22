"use Client";

import React, { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { delete_a_category, add_new_category, update_a_category } from "@/Services/Admin/category";
import DataTable from "react-data-table-component";
import Loading from "@/app/loading";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { useRouter } from "next/navigation";
import { ICategory } from "@/model/Category";
import { Dialog } from "@/components/Dialog";
import { useForm, SubmitHandler } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import { IoIosAddCircle } from "react-icons/io";

type Inputs = {
  name: string;
  description: string;
};

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [editLoader, setEditLoader] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm<Inputs>();

  useEffect(() => {
    if (selectedCategory && isEditDialogOpen) {
      setValue("name", selectedCategory.categoryName);
      setValue("description", selectedCategory.categoryDescription);
    }
  }, [selectedCategory, isEditDialogOpen, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isEditDialogOpen) {
      setEditLoader(true);
      const updatedData = {
        _id: selectedCategory?._id,
        name: data.name,
        description: data.description,
      };

      const res = await update_a_category(updatedData);
      if (res?.success) {
        toast.success(res?.message);
        mutate("/gettingAllCategoriesFOrAdmin");
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        reset();
        setEditLoader(false);
      } else {
        toast.error(res?.message);
        setEditLoader(false);
      }
      return;
    }

    // Adicionar nova categoria
    setAddLoader(true);
    const finalData = {
      name: data.name,
      description: data.description,
      image: "default-image"
    };

    const res = await add_new_category(finalData);
    if (res.success) {
      toast.success(res?.message);
      mutate("/gettingAllCategoriesFOrAdmin");
      setIsAddDialogOpen(false);
      reset();
      setAddLoader(false);
    } else {
      toast.error(res?.message);
      setAddLoader(false);
    }
  };

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
    {
      name: "Ação",
      cell: (row: CategoryData) => (
        <div className="flex items-center justify-start space-x-2">
          <button
            onClick={() => {
              setSelectedCategory(row);
              setIsEditDialogOpen(true);
            }}
            className="px-3 py-2 text-sm font-medium text-[#373a4e] hover:text-white hover:bg-[#373a4e] border border-[#373a4e] rounded-full transition-all duration-200 shadow-sm"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteCategory(row?._id)}
            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-full transition-all duration-200 shadow-sm"
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
    <div className="w-full h-full pt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestão de Categorias</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Procurar categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-[#373a4e] focus:border-[#373a4e] block w-full pl-10 p-2.5 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center text-white bg-[#373a4e] hover:bg-[#2f3141] focus:ring-4 focus:ring-[#373a4e]/30 font-medium rounded-full text-sm px-5 py-2.5 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <IoIosAddCircle className="mr-2 text-lg" /> Nova Categoria
          </button>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <DataTable
            columns={columns as any}
            data={filteredData || []}
            pagination
            keyField="id"
            fixedHeader
            fixedHeaderScrollHeight="100%"
            selectableRows
            selectableRowsHighlight
            persistTableHead
            subHeader
            progressPending={isLoading}
            progressComponent={
              <div className="w-full flex-col h-96 flex items-center justify-center">
                <ThreeDots
                  height="50"
                  width="50"
                  color="#373a4e"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
                <p className="text-sm mt-3 font-semibold text-gray-700">
                  Carregando categorias...
                </p>
              </div>
            }
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

      {/* Modal de Adicionar Categoria */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isAddDialogOpen ? 'visible' : 'invisible'}`}>
        <div className="fixed inset-0 bg-black/30" onClick={() => {
          setIsAddDialogOpen(false);
          reset();
        }}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Adicionar Nova Categoria</h3>
            <button
              onClick={() => {
                setIsAddDialogOpen(false);
                reset();
              }}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {addLoader ? (
            <div className="w-full flex-col h-40 flex items-center justify-center">
              <ThreeDots
                height="50"
                width="50"
                color="#373a4e"
                ariaLabel="three-dots-loading"
                visible={true}
              />
              <p className="text-sm mt-3 font-semibold text-gray-700">
                Adicionando categoria...
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-start justify-center p-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg py-2 flex-col space-y-4"
              >
                <div className="form-control w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Digite o nome da categoria"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373a4e] focus:border-transparent"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>
                
                <div className="form-control w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373a4e] focus:border-transparent h-24 resize-none"
                    placeholder="Digite a descrição da categoria"
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500 text-xs mt-1">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#373a4e] text-white hover:bg-[#2f3141] py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Criar Categoria
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Editar Categoria */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${isEditDialogOpen ? 'visible' : 'invisible'}`}>
        <div className="fixed inset-0 bg-black/30" onClick={() => {
          setIsEditDialogOpen(false);
          setSelectedCategory(null);
          reset();
        }}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Editar Categoria</h3>
            <button
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedCategory(null);
                reset();
              }}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {editLoader ? (
            <div className="w-full flex-col h-40 flex items-center justify-center">
              <ThreeDots
                height="50"
                width="50"
                color="#2563eb"
                ariaLabel="three-dots-loading"
                visible={true}
              />
              <p className="text-sm mt-3 font-semibold text-gray-700">
                Atualizando categoria...
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-start justify-center p-4">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg py-2 flex-col space-y-4"
              >
                <div className="form-control w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    defaultValue={selectedCategory?.categoryName}
                    placeholder="Digite o nome da categoria"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373a4e] focus:border-transparent"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>
                
                <div className="form-control w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    defaultValue={selectedCategory?.categoryDescription}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#373a4e] focus:border-transparent h-24 resize-none"
                    placeholder="Digite a descrição da categoria"
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500 text-xs mt-1">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#373a4e] text-white hover:bg-[#2f3141] py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Atualizar Categoria
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
