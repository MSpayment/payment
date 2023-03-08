import { useQuery } from "@tanstack/react-query";
import { GetProduct } from "src/features/products/types";
import axios from "src/libs/axios";

type Args = {
  month: number;
  year: number;
};

export const getProducts = async ({ month, year }: Args) => {
  const url = `/products/${year}/${month}`;
  const { data } = await axios.get<GetProduct[]>(url);

  return data;
};

export const useQueryProducts = (year: number, month: number) =>
  useQuery<GetProduct[], Error>({
    queryKey: ["products", year, month],
    queryFn: () => getProducts({ month, year }),
    staleTime: 1000 * 60 * 60,
  });
