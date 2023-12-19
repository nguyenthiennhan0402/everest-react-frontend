import axiosClient from "api/axiosClient";
import { useQuery } from "react-query";

export const fetchSearchAccounts = async ({ emailOrName, pageSize, pageNo }) => {
  const accessToken = window.localStorage.getItem("accessToken");

  const response = await axiosClient.get("/api/v1/accounts/get-all-account", {
    params: {
      emailOrName,
      pageSize,
      pageNo,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

export const useSearchAccounts = (emailOrName, pageSize, pageNo) => {
  return useQuery(["SEARCH_LIST", emailOrName, pageSize, pageNo], () =>
    fetchSearchAccounts({ emailOrName, pageSize, pageNo })
  );
};
