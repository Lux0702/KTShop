import { apiSlice } from "../../api/apiSlice";
const BASE_URL = "https://ktshop.onrender.com";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getListProduct: builder.query({
      query: () => `${BASE_URL}/api/product/all`,
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/api/product/add`,
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/api/product/edit-product/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/product/delete-product/${id}`,
        method: "DELETE",
      }),
    }),
    
  }),
});

export const {
  useGetListProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
