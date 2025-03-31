import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithCsrf } from "../auth/authApi";

// Define response type for image upload
interface UploadResponse {
  message: string;
  url: string;
  public_id: string;
}

// Define request type for image upload
interface UploadRequest {
  image: File;
  type: "profile" | "menuitem" | "promo"; 
}


export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: baseQueryWithCsrf,
  tagTypes: ["Image"],

  endpoints: (builder) => ({
    // Upload Image
    uploadImage: builder.mutation<UploadResponse, UploadRequest>({
      query: ({ image, type }: UploadRequest) => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("type", type);

        return {
          url: "/image_upload",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Image"],
    }),

    // Delete Image
    deleteImage: builder.mutation<{ message: string }, {url: string}>({
      query: ({ url }: {url: string}) => ({
        url: "/image_delete",
        method: "POST",
        body: { url },
      }),
      invalidatesTags: ["Image"],
    }),

  }),
});

// Export hooks for React components
export const {
  useUploadImageMutation,
  useDeleteImageMutation,
} = imageApi;
