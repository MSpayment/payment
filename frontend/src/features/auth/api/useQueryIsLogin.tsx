import { useQuery } from "@tanstack/react-query";
import axios from "src/libs/axios";

export const useQueryIsLogin = () =>
  useQuery({
    queryKey: ["isLogin"],
    queryFn: async () => {
      const data = axios.get("/auth").then((res) => res.data);

      return data;
    },
    onError: (error) => {
      console.log(error);
    },
  });
