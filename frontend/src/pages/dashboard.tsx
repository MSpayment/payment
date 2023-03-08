import { ActionIcon, Text } from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { GetStaticProps, NextPage } from "next";
import React, { Suspense } from "react";
import { useGlobalState } from "src/store/input";
import { Products } from "src/features/products/components/Products";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Product } from "@prisma/client";
import axios from "src/libs/axios";
import { useSelectDateState } from "src/features/products/store";
import { usePrefetchProducts } from "src/features/products/api/usePrefetchProducts";

const Dashboard: NextPage = () => {
  const setModal = useGlobalState((state) => state.setModal);
  const increaseMonth = useSelectDateState((state) => state.increaseMonth);
  const decreaseMonth = useSelectDateState((state) => state.decreaseMonth);
  const selectDate = useSelectDateState((state) => state.date);
  const { prefetchProducts } = usePrefetchProducts();

  return (
    <div>
      <header className="h-16 w-full border-0 border-b border-solid border-slate-200 bg-white">
        <nav className="container mx-auto flex h-full w-full items-center justify-between px-4">
          <ActionIcon
            variant="transparent"
            size="xl"
            color="blue"
            onTouchStart={() =>
              prefetchProducts({
                year:
                  selectDate.month === 1
                    ? selectDate.year - 1
                    : selectDate.year,
                month: selectDate.month === 1 ? 12 : selectDate.month - 1,
              })
            }
            onMouseEnter={() =>
              prefetchProducts({
                year:
                  selectDate.month === 1
                    ? selectDate.year - 1
                    : selectDate.year,
                month: selectDate.month === 1 ? 12 : selectDate.month - 1,
              })
            }
            onClick={decreaseMonth}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </ActionIcon>
          <Text className="mx-auto text-2xl font-bold text-blue-500">{`${selectDate.year}年${selectDate.month}月`}</Text>
          <ActionIcon
            size="xl"
            variant="transparent"
            color="blue"
            onTouchStart={() =>
              prefetchProducts({
                year:
                  selectDate.month === 12
                    ? selectDate.year + 1
                    : selectDate.year,
                month: selectDate.month === 12 ? 1 : selectDate.month + 1,
              })
            }
            onMouseEnter={() =>
              prefetchProducts({
                year:
                  selectDate.month === 12
                    ? selectDate.year + 1
                    : selectDate.year,
                month: selectDate.month === 12 ? 1 : selectDate.month + 1,
              })
            }
            onClick={increaseMonth}
          >
            <ArrowRightIcon className="h-6 w-6" />
          </ActionIcon>
        </nav>
      </header>
      <main className="min-h-screen">
        <div className="container mx-auto h-full min-h-screen ">
          <Suspense fallback={<div>loading</div>}>
            <Products />
          </Suspense>
        </div>
      </main>
      <ActionIcon
        className="fixed bottom-10 right-10 z-[50] shadow-md"
        variant="filled"
        size="xl"
        radius="xl"
        color="blue"
        onClick={() => setModal(true)}
      >
        <PlusIcon className="h-6 w-6" />
      </ActionIcon>
    </div>
  );
};

export default Dashboard;

export const getStaticProps: GetStaticProps = async () => {
  const client = new QueryClient();
  const today = new Date();

  await client.prefetchQuery(
    ["products", today.getFullYear(), today.getMonth() + 1],
    async () => {
      const { data } = await axios.get<Product[]>("/products");

      return data;
    }
  );

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  };
};
