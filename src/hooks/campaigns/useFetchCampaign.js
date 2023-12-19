import axiosClient from "api/axiosClient";
import { useQuery } from "react-query";

const fetchCampaigns = async (pageSize, pageNo) => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.get("/api/v1/campaigns/get-campaign", {
    params: {
      pageSize,
      pageNo,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const useFetchCampaign = (pageSize, pageNo) => {
  return useQuery(["FETCH_LIST", pageSize, pageNo], () => fetchCampaigns(pageSize, pageNo), {
    refetchOnWindowFocus: true,
    retry: 3,
  });
};
