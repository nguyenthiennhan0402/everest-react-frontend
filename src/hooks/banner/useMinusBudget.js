import axiosClient from "api/axiosClient";
import { useMutation, useQueryClient } from "react-query";

const minusBudget = async ({ id }) => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.put(
    `/api/v1/campaigns/minus-budget?id=${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const useMinusBudget = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id }) => {
      return minusBudget({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("SEARCH_LIST");
      },
    }
  );
};
