import { apiSlice } from "@/redux/api/apiSlice";
import { update } from "lodash";
export const categoryApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        addCategory: builder.mutation({
        query: (data) => ({
            url: "https://ktshop.onrender.com/api/category/add",
            method: "POST",
            body: data,
        }),
        }),
        getShowCategory: builder.query({
        query: () => `https://ktshop.onrender.com/api/category/show`,
        }),
        getProductTypeCategory: builder.query({
        query: (type) => `https://ktshop.onrender.com/api/category/show/${type}`,
        }),
        getAllCategories: builder.query({
            query: () => `https://ktshop.onrender.com/api/category/all`,
        }),
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `https://ktshop.onrender.com/api/category/edit/${id}`,
                method: "PATCH",
                body: data,
            }),
        }),
    }),
})
export const {
    useAddCategoryMutation,
    useGetProductTypeCategoryQuery,
    useGetShowCategoryQuery,
    useGetAllCategoriesQuery,
    useUpdateCategoryMutation,
} = categoryApi;