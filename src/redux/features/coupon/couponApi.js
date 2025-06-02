// redux/api/couponApi.js
import { apiSlice } from "@/redux/api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: () => `https://ktshop.onrender.com/api/coupon`,
      providesTags: ["Coupon"],
    }),
    addCoupon: builder.mutation({
      query: (body) => ({
        url: `https://ktshop.onrender.com/api/coupon/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupon"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `https://ktshop.onrender.com/api/coupon/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `https://ktshop.onrender.com/api/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;