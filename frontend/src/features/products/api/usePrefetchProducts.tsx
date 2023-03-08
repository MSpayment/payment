import { useQueryClient } from "@tanstack/react-query";
import { getProducts } from "src/features/products/api/useQueryProducts";

type Args = {
  year: number;
  month: number;
};

export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();
  const prefetchProducts = async ({ year, month }: Args) => {
    await queryClient.prefetchQuery({
      queryKey: ["products", year, month],
      queryFn: () =>
        getProducts({
          year,
          month,
        }),
      staleTime: 1000 * 60 * 60,
    });
  };

  return { prefetchProducts };
};
