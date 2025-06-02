// src/redux/features/admin/brandApi.js
import { apiSlice } from "../../api/apiSlice";

const BASE_URL = "https://ktshop.onrender.com";

export const brandApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: () => `${BASE_URL}/api/brand/all`,
    }),

    addBrand: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/api/brand/add`,
        method: "POST",
        body: data,
      }),
    }),

    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/api/brand/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/brand/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
