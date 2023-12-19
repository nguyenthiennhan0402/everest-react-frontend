import axiosClient from "api/axiosClient";
import { useMutation, useQueryClient } from "react-query";

const createAccount = async (data, token) => {
  const response = await axiosClient.post("/api/v1/accounts/register-account", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const useCreateAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation((data) => createAccount(data, getAuthToken()), {
    onSuccess: () => {
      queryClient.invalidateQueries("SEARCH_LIST");
    },
  });

  const getAuthToken = () => {
    return window.localStorage.getItem("accessToken");
  };

  return {
    createAccount: mutation.mutateAsync,
  };
};

export default useCreateAccount;
