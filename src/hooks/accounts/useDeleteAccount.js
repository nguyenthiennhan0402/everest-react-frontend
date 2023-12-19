import axiosClient from "api/axiosClient";
import { useMutation, useQueryClient } from "react-query";

const deleteAccount = async ({ id }) => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.patch(
    `/api/v1/accounts/delete-account?id=${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id }) => {
      return deleteAccount({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("SEARCH_LIST");
      },
    }
  );
};
