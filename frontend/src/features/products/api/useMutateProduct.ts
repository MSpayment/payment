import { Product } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DeleteProduct,
  InputProduct,
  UpdateChecked,
} from "src/features/products/types";
import axios from "src/libs/axios";

export const useMutateProduct = () => {
  const query = useQueryClient();
  const inputProductMutation = useMutation({
    mutationFn: async (input: InputProduct) => {
      const { data } = await axios.post<Product>("/products", input);

      return data;
    },
    onSuccess: (data) => {
      const { boughtDay } = data;
      const month = new Date(boughtDay).getMonth() + 1;
      query.invalidateQueries({ queryKey: ["products", month] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product }: UpdateChecked) => {
      const { data } = await axios.patch<Product>(`/products/${id}`, product);

      return data;
    },
    onMutate: async (newData) => {
      const { id, product } = newData;
      const month = new Date(product.boughtDay).getMonth() + 1;
      await query.cancelQueries({ queryKey: ["products", month] });
      const prevData = query.getQueryData<Product[]>(["products", month]);
      if (prevData) {
        const updatedData = prevData.map((prevProduct) => {
          if (prevProduct.id === id) {
            return {
              ...prevProduct,
              isPaid: product.isPaid,
            };
          }

          return prevProduct;
        });

        query.setQueryData(["products", month], updatedData);
      }
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async ({ id }: DeleteProduct) => {
      const { data } = await axios.delete<Product>(`/products/${id}`);

      return data;
    },
    onMutate: async (newData) => {
      const { id, boughtDay } = newData;
      const month = new Date(boughtDay).getMonth() + 1;
      await query.cancelQueries({ queryKey: ["products", month] });
      const prevData = query.getQueryData<Product[]>(["products", month]);
      if (prevData) {
        const updatedData = prevData.map((prevProduct) => {
          if (prevProduct.id === id) {
            return {
              ...prevProduct,
              deleted: true,
            };
          }

          return prevProduct;
        });

        query.setQueryData(["products", month], updatedData);
      }
    },
  });

  return {
    inputProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};
