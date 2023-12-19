import axiosClient from "api/axiosClient";
import { useQuery } from "react-query";

const fetchBanners = async () => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.get("/api/v1/campaigns/show-banner", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const useFetchBanners = () => {
  return useQuery(["FETCH_BANNER"], () => fetchBanners(), {
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: true,
  });
};
