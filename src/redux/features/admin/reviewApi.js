import { apiSlice } from "../../api/apiSlice";

const BASE_URL = "https://ktshop.onrender.com";

export const reviewApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => `${BASE_URL}/api/review/all`,
    }),

   

    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/api/review/edit/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/api/review/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
    useGetAllReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
