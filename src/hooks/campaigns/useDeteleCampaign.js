import axiosClient from "api/axiosClient";
import { useMutation, useQueryClient } from "react-query";
const deleteCampagign = async ({ id }) => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.patch(
    `/api/v1/campaigns/delete-campaign?id=${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id }) => {
      return deleteCampagign({ id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("SEARCH_LIST");
      },
    }
  );
};
