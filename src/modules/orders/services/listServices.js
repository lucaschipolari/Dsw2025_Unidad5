import { instance } from "../../shared/api/axiosInstance";

export const listOrders = async () => {
  const response = await fetch("/api/orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (response.ok) {
    const data = await response.json();

    return { data, error: null };
  } else {
    const error = await response.json();

    return { data: null, error };
  }
};

export const getOrders = async (
  search = null,
  status = null,
  pageNumber = 1,
  pageSize = 20
) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });
  const response = await instance.get(`api/orders/?${queryString}`);

  return { data: response.data.data, error: null };
};
