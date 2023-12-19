import axiosClient from "api/axiosClient";
import { useQuery } from "react-query";

export const fetchSearchCampaigns = async ({ name, startDate, endDate, pageSize, pageNo }) => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.get("/api/v1/campaigns/get-campaign", {
    params: {
      name,
      startDate,
      endDate,
      pageSize,
      pageNo,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const useSearchCampaign = (name, startDate, endDate, pageSize, pageNo) => {
  return useQuery(
    ["SEARCH_LIST", name, startDate, endDate, pageSize, pageNo],
    () => fetchSearchCampaigns({ name, startDate, endDate, pageSize, pageNo }),
    {
      enabled: !!name || !!startDate || !!endDate || !!pageSize || !!pageNo,
    }
  );
};
