# Cloudinary Setup Instructions

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## How to Get Cloudinary Credentials

1. **Sign up for Cloudinary**: Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. **Get your credentials**: After signing up, go to your dashboard
3. **Copy the values**:
   - **Cloud Name**: Found in the dashboard
   - **API Key**: Found in the dashboard
   - **API Secret**: Found in the dashboard (keep this secret!)

## Cloudinary Configuration

The system is configured to:
- Upload images to the `optical-center/products` folder
- Automatically resize images to 800x800 pixels
- Optimize image quality automatically
- Generate unique filenames for each upload
- Delete old images when updating products

## Benefits of Using Cloudinary

- ✅ **Better Performance**: Images served from CDN
- ✅ **Automatic Optimization**: Images optimized for web
- ✅ **Scalability**: No server storage limitations
- ✅ **Reliability**: 99.9% uptime guarantee
- ✅ **Security**: Secure image delivery
- ✅ **Transformations**: Automatic resizing and optimization

## Migration from Local Storage

If you have existing products with local images, you'll need to:
1. Upload those images to Cloudinary manually
2. Update the product records with the new Cloudinary URLs
3. Remove the local image files

The system will automatically use Cloudinary for all new uploads.
