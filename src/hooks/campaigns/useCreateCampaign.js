import axiosClient from "api/axiosClient";
import { useMutation, useQueryClient } from "react-query";

const createCampaign = async (formData, token) => {
  const response = await axiosClient.post("/api/v1/campaigns/create-Campaign", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation((formData) => createCampaign(formData, getAuthToken()), {
    onSuccess: () => {
      queryClient.invalidateQueries("SEARCH_LIST");
    },
  });

  const getAuthToken = () => {
    return window.localStorage.getItem("accessToken");
  };

  return {
    createCampaign: mutation.mutateAsync,
  };
};

export default useCreateCampaign;
