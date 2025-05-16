import { apiSlice } from "../../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashBoardAmount: builder.query({
      query: () =>
        `https://ktshop.onrender.com/api/user-order/dashboard-amount`,
    }),
    getListOrder: builder.query({
      query: () => `https://ktshop.onrender.com/api/order/orders`,
    }),
  }),
});

export const { useGetDashBoardAmountQuery, useGetListOrderQuery } = dashboardApi;
