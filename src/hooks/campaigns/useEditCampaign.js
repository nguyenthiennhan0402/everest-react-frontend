import axiosClient from "api/axiosClient";
import { useMutation, useQueryClient } from "react-query";

const useEditCampaign = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({ id, formData, token }) => {
      const response = await axiosClient.put(`/api/v1/campaigns/update-campaign?id=${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("SEARCH_LIST");
      },
    }
  );

  return {
    editCampaign: mutation.mutateAsync,
  };
};

export default useEditCampaign;
