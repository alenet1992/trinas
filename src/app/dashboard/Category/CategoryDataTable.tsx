"use Client";

import React, { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { delete_a_category, add_new_category, update_a_category } from "@/Services/Admin/category";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { ICategory } from "@/model/Category";
import { useForm, SubmitHandler } from "react-hook-form";
import { Grid } from "react-loader-spinner";
import { IoIosAddCircle } from "react-icons/io";

type Inputs = {
  name: string;
  description: string;
};

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  categoryImage: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
};

export default function CategoryDataTable() {
  const { mutate } = useSWRConfig();
  const [catData, setCatData] = useState<CategoryData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.category);
  const isLoading = useSelector((state: RootState) => state.Admin.catLoading);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<CategoryData[] | []>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
    if (selectedCategory && isAddDialogOpen) {
      setValue("name", selectedCategory.name);
      setValue("description", selectedCategory.description);
    }
  }, [selectedCategory, isAddDialogOpen, setValue]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (isAddDialogOpen && selectedCategory) {
      setEditLoader(true);
      const updatedData = {
        _id: selectedCategory?._id,
        name: data.name,
        description: data.description,
      };

      const res = await update_a_category(updatedData);

      debugger
      if (res?.success) {
        toast.success(res?.message);
        mutate("/gettingAllCategoriesFOrAdmin");
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
        <div className="flex items-center justify-start gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              console.log('row', row);
              setSelectedCategory(row);
              setIsAddDialogOpen(true);
            }}
            className="min-w-[90px] px-3 py-2 text-sm font-medium text-[#373a4e] hover:text-white hover:bg-[#373a4e] border border-[#373a4e] rounded-full transition-all duration-200 shadow-sm focus:ring-2 focus:ring-[#373a4e]/30 focus:outline-none"
          >
            Editar
          </button>
          <button
            onClick={() => handleDeleteCategory(row?._id)}
            className="min-w-[90px] px-3 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-full transition-all duration-200 shadow-sm focus:ring-2 focus:ring-red-600/30 focus:outline-none"
          >
            Eliminar
          </button>
        </div>
      ),
      width: "200px",
      style: {
        paddingRight: "16px",
      },
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
          const itemData = item?.name.toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        })
      );
    }
  }, [search, catData]);

  return (
    <div className="w-full h-full pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Tipo de pratos</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
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
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center justify-center text-white bg-[#373a4e] hover:bg-[#2f3141] focus:ring-4 focus:ring-[#373a4e]/30 font-medium rounded-full text-sm px-5 py-3 sm:py-2.5 w-full sm:w-auto transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <IoIosAddCircle className="mr-2 text-lg" /> Adicionar
          </button>
        </div>
      </div>
      <div className="block w-full overflow-x-auto bg-white rounded-lg shadow-sm">
        <DataTable
            columns={columns as any}
            data={filteredData || []}
            pagination
            keyField="id"
            fixedHeaderScrollHeight="calc(100vh - 250px)"
            selectableRows
            selectableRowsHighlight
            persistTableHead
            progressPending={isLoading}
            progressComponent={
              <div className="w-full flex-col h-[50vh] sm:h-96 flex items-center justify-center">
                <Grid
                  height="60"
                  width="60"
                  color="#373a4e"
                  ariaLabel="grid-loading"
                  radius="12"
                  visible={true}
                />
                <p className="text-sm sm:text-base mt-4 font-semibold text-gray-700">
                  Carregando categorias...
                </p>
              </div>
            }
            className="rounded-lg overflow-hidden"
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: '#f9fafb',
                  borderBottomWidth: '1px',
                  borderBottomColor: '#e5e7eb',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '16px 8px',
                },
              },
              rows: {
                style: {
                  minHeight: '72px',
                  fontSize: '14px',
                  padding: '12px 8px',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                  },
                },
              },
              cells: {
                style: {
                  paddingLeft: '8px',
                  paddingRight: '8px',
                },
              },
              pagination: {
                style: {
                  borderTopWidth: '1px',
                  borderTopColor: '#e5e7eb',
                  padding: '12px 8px',
                },
                pageButtonsStyle: {
                  borderRadius: '9999px',
                  height: '32px',
                  minWidth: '32px',
                  padding: '0 8px',
                  margin: '0 4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  '&:hover:not(:disabled)': {
                    backgroundColor: '#f9fafb',
                  },
                  '&:disabled': {
                    cursor: 'default',
                    opacity: '0.6',
                  },
                },
              },
            }}
            noDataComponent={
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm sm:text-base">Nenhuma categoria encontrada</p>
              </div>
            }
          />
      </div>

      {/* Modal de Adicionar Categoria */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isAddDialogOpen ? 'visible' : 'invisible'}`}>
        <div className="fixed inset-0 bg-black/30" onClick={() => {
          setIsAddDialogOpen(false);
          reset();
        }}></div>
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 flex items-center justify-between p-4 sm:p-5 border-b bg-white z-10">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{selectedCategory?.name ? 'Editar' : 'Adicionar'} Categoria</h3>
            <button
              onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedCategory(null);
                reset();
              }}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#373a4e] rounded-lg p-1"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {addLoader || editLoader ? (
            <div className="w-full flex-col h-48 flex items-center justify-center p-4">
              <Grid
                height="60"
                width="60"
                color="#373a4e"
                ariaLabel="grid-loading"
                radius="12"
                visible={true}
              />
              <p className="text-sm sm:text-base mt-4 font-semibold text-gray-700">
                {selectedCategory?.name ? 'Atualizando' : 'Adicionando'} categoria...
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-start justify-center p-4 sm:p-5">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col space-y-5"
              >
                <div className="form-control w-full">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    defaultValue={selectedCategory?.name}
                    placeholder="Digite o nome da categoria"
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-[#373a4e] focus:border-[#373a4e] block w-full p-3 sm:p-3.5 shadow-sm"
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm mt-2 font-medium">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>
                
                <div className="form-control w-full">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    defaultValue={selectedCategory?.description}
                    rows={4}
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm sm:text-base rounded-xl focus:ring-2 focus:ring-[#373a4e] focus:border-[#373a4e] block w-full p-3 sm:p-3.5 shadow-sm resize-none"
                    placeholder="Digite a descrição da categoria"
                  ></textarea>
                  {errors.description && (
                    <span className="text-red-500 text-sm mt-2 font-medium">
                      Este campo é obrigatório
                    </span>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#373a4e] text-white hover:bg-[#2f3141] py-3 sm:py-3.5 rounded-xl text-sm sm:text-base transition-colors duration-200 font-medium shadow-sm hover:shadow-md mt-2"
                >
                  {selectedCategory?.name ? 'Atualizar Categoria' : 'Adicionar Categoria'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
