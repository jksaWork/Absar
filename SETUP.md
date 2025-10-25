# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/optical_center

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
GOOGLE_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Setup Instructions

### 1. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` with your MongoDB connection string
- The database name is set to "optical_center"

### 2. Google OAuth Setup
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
- Copy Client ID and Client Secret to environment variables

### 3. Cloudinary Setup
- Sign up at [cloudinary.com](https://cloudinary.com)
- Get your Cloud Name, API Key, and API Secret from dashboard
- Add them to environment variables

### 4. NextAuth Secret
- Generate a random secret key for NextAuth
- You can use: `openssl rand -base64 32`

## Running the Project

1. Install dependencies: `npm install`
2. Create `.env.local` file with above variables
3. Start development server: `npm run dev`
4. Build for production: `npm run build`
5. Start production server: `npm start`
