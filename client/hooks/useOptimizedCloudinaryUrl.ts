import { useMemo } from "react";

export function useOptimizedCloudinaryUrl(originalUrl: string | null | undefined) {
  return useMemo(() => {
    if(!originalUrl){
        return;
    }
    // Check if it's a Cloudinary URL and has `/upload/`
    const isCloudinary = originalUrl.includes("res.cloudinary.com") && originalUrl.includes("/upload/");

    if (!isCloudinary) {
      return originalUrl;
    }

    // Insert transformation options after /upload/
    return originalUrl.replace(
      "/upload/",
      "/upload/q_auto:eco,f_auto/"
    );
  }, [originalUrl]);
}
