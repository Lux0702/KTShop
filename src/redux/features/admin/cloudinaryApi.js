import { apiSlice } from "@/redux/api/apiSlice";
export const cloudinaryApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        uploadImage: builder.mutation({
        query: (data) => ({
            url: "https://ktshop.onrender.com/api/cloudinary/add-img",
            method: "POST",
            body: data,
        }),
        }),
        deleteImage: builder.mutation({
        query: (publicId) => ({
            url: `https://ktshop.onrender.com/api/cloudinary/img-delete`,
            method: "DELETE",
            body: { public_id: publicId },
        }),
        }),
    }),
})

export const {
    useUploadImageMutation,
    useDeleteImageMutation,
} = cloudinaryApi;