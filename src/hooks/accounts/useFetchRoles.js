import axiosClient from "api/axiosClient";
import { useQuery } from "react-query";

const fetchRoles = async () => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.get("/api/v1/accounts/get-roles", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const useFetchRoles = () => {
  return useQuery(["FETCH_LIST"], () => fetchRoles(), {
    refetchOnWindowFocus: true,
    retry: 3,
  });
};
