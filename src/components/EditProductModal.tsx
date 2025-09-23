'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { get_product_by_id, update_a_product } from '@/Services/Admin/product';
import useSWR from 'swr';

type Inputs = {
  _id: string;
  name: string;
  description: string;
  slug: string;
  feature: Boolean;
  price: Number;
  quantity: Number;
  categoryID: string;
};

type ProductData = {
  _id: string;
  productName: string;
  productDescription: string;
  productImage: string;
  productSlug: string;
  productPrice: Number;
  productQuantity: Number;
  productFeatured: Boolean;
  productCategory: string;
  createdAt: string;
  updatedAt: string;
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

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSuccess: () => void;
}

export default function EditProductModal({ isOpen, onClose, productId, onSuccess }: EditProductModalProps) {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [prodData, setprodData] = useState<ProductData | undefined>(undefined);
  const category = useSelector((state: RootState) => state.Admin.category) as CategoryData[] | undefined;

  const { data, isLoading } = useSWR(
    isOpen ? `/gettingProductbyID/${productId}` : null,
    () => get_product_by_id(productId)
  );

  useEffect(() => {
    if (data?.success !== true) toast.error(data?.message);
    setprodData(data?.data);
  }, [data]);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    criteriaMode: 'all',
  });

  const setValueofFormData = () => {
    if (prodData) {
      setValue('name', prodData?.productName);
      setValue('description', prodData?.productDescription);
      setValue('slug', prodData?.productSlug);
      setValue('feature', prodData?.productFeatured);
      setValue('categoryID', prodData?.productCategory);
      setValue('quantity', prodData?.productQuantity);
      setValue('price', prodData?.productPrice);
    }
  };

  useEffect(() => {
    if (prodData) setValueofFormData();
  }, [prodData]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoader(true);

    const updatedData: Inputs = {
      _id: productId,
      name: data.name !== prodData?.productName ? data.name : prodData?.productName,
      description: data.description !== prodData?.productDescription ? data.description : prodData?.productDescription,
      slug: data.slug !== prodData?.productSlug ? data.slug : prodData?.productSlug,
      feature: data.feature !== prodData?.productFeatured ? data.feature : prodData?.productFeatured,
      quantity: data.quantity !== prodData?.productQuantity ? data.quantity : prodData?.productQuantity,
      price: data.price !== prodData?.productPrice ? data.price : prodData?.productPrice,
      categoryID: data.categoryID !== prodData?.productCategory ? data.categoryID : prodData?.productCategory,
    };

    const res = await update_a_product(updatedData);
    if (res?.success) {
      toast.success(res?.message);
      onSuccess();
      onClose();
    } else {
      toast.error(res?.message);
    }
    setLoader(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading || loader ? (
          <div className="w-full flex-col h-48 flex items-center justify-center">
            <ThreeDots
              height="50"
              width="50"
              radius="9"
              color="orange"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <p className="text-sm mt-2 font-semibold text-orange-500">
              {loader ? 'Atualizando produto...' : 'Carregando produto...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Escolha a Categoria</span>
              </label>
              <select
                {...register('categoryID', { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled>Selecione uma categoria</option>
                {category?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nome do Produto</span>
              </label>
              <input
                {...register('name', { required: true })}
                type="text"
                placeholder="Digite aqui"
                className="input input-bordered w-full"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Slug do Produto</span>
              </label>
              <input
                {...register('slug', { required: true })}
                type="text"
                placeholder="Digite aqui"
                className="input input-bordered w-full"
              />
              {errors.slug && (
                <span className="text-red-500 text-xs mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Preço</span>
                </label>
                <input
                  {...register('price', { required: true })}
                  type="number"
                  placeholder="Digite aqui"
                  className="input input-bordered w-full"
                />
                {errors.price && (
                  <span className="text-red-500 text-xs mt-1">
                    Este campo é obrigatório
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Quantidade</span>
                </label>
                <input
                  {...register('quantity', { required: true })}
                  type="number"
                  placeholder="Digite aqui"
                  className="input input-bordered w-full"
                />
                {errors.quantity && (
                  <span className="text-red-500 text-xs mt-1">
                    Este campo é obrigatório
                  </span>
                )}
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Descrição do Produto</span>
              </label>
              <textarea
                {...register('description', { required: true })}
                className="textarea textarea-bordered h-24"
                placeholder="Descrição"
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-xs mt-1">
                  Este campo é obrigatório
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Produto em Destaque</span>
                <input
                  {...register('feature')}
                  type="checkbox"
                  className="checkbox dark:border-black"
                />
              </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loader}
              >
                {loader ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}