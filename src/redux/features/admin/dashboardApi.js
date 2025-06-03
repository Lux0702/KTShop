import { apiSlice } from "../../api/apiSlice";
const BASE_URL = "https://ktshop.onrender.com";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDashBoardAmount: builder.query({
      query: () => `${BASE_URL}/api/user-order/dashboard-amount`,
    }),
    getListOrder: builder.query({
      query: () => `${BASE_URL}/api/order/orders`,
    }),
    getSaleReport: builder.query({
      query: () => `${BASE_URL}/api/user-order/sales-report`,
    }),
    getMostSaleCategory: builder.query({
      query: () =>
        `${BASE_URL}/api/user-order/most-selling-category`,
    }),
    getOrderById : builder.query({
      query: (id) => `${BASE_URL}/api/order/${id}`,
    }),
  }),
});

export const { useGetDashBoardAmountQuery, useGetListOrderQuery, useGetSaleReportQuery, useGetMostSaleCategoryQuery , useGetOrderByIdQuery} = dashboardApi;
