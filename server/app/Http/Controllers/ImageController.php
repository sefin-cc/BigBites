<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

class ImageController extends Controller
{
    // 🔹 Upload Image
    public function upload(Request $request)
    {
        // ✅ Validate incoming request
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,svg',
            'type' => 'required|string|in:profile,menuitem,promo'
        ]);

        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'No image found in request'], 400);
        }

        try {
            // Set Cloudinary configuration (API Key, Secret, Cloud Name)
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ]
            ]);

            $uploadApi = $cloudinary->uploadApi();
            $uploadedFile = $uploadApi->upload($request->file('image')->getRealPath(), [
                'upload_preset' => $request->type, 
            ]);

            return response()->json([
                'message' => 'Image uploaded successfully',
                'url' => $uploadedFile['url'],
                'public_id' => $uploadedFile['public_id'],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Image upload failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    //  Delete Image
    public function delete(Request $request)
    {
        $request->validate(['url' => 'required|string']);

        try {
            // Extract public_id from the image URL
            $urlParts = explode('/', $request->url);
            $filenameWithExtension = end($urlParts);
            $publicId = pathinfo($filenameWithExtension, PATHINFO_FILENAME);

            // Set Cloudinary configuration (API Key, Secret, Cloud Name)
            $cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ]
            ]);

            $uploadApi = $cloudinary->uploadApi();
            $uploadApi->destroy($publicId);

            return response()->json(['message' => 'Image deleted successfully']);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Image deletion failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
