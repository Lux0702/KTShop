import { apiSlice } from "../../api/apiSlice";
const BASE_URL = "https://ktshop.onrender.com";


export const productApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoint: (builder) => ({
        getListProduct: builder.query({
            query: ()=> `${BASE_URL}/api/product/all`,
        }),
    }),

});
export const {useGetListProductQuery}= productApi;