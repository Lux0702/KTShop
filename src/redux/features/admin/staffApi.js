// redux/features/staff/staffApi.js
import { apiSlice } from "@/redux/api/apiSlice";

export const staffApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllStaffs: builder.query({
      query: () => `https://ktshop.onrender.com/api/admin/all`,
      providesTags: ["Staff"],
    }),

    addStaff: builder.mutation({
      query: (data) => ({
        url: `https://ktshop.onrender.com/api/admin/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),

    updateStaff: builder.mutation({
      query: ({ id, data }) => ({
        url: `https://ktshop.onrender.com/api/admin/update-staff/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),

    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `https://ktshop.onrender.com/api/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const {
  useGetAllStaffsQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
