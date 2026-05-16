# Cybersecurity Portfolio Setup Guide

Welcome to your new cybersecurity-themed portfolio! This guide will walk you through running the application locally, connecting it to your own Firebase project, and deploying it to the web.

## Project Structure
The application is built using **React, Vite, and Tailwind CSS**.
- `/src/pages/Home.tsx` - Public portfolio view
- `/src/pages/admin/` - Admin login and dashboard for managing content
- `/src/lib/db.ts` - Firebase Firestore integration
- `/src/context/AuthContext.tsx` - Firebase Authentication context

---

## 🚀 1. Running Locally

1. Open your terminal in the `portfolio` directory:
   ```bash
   cd d:/portfolio
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

You can now view the site at `http://localhost:5173/`. 
_Note: Because Firebase is not configured out of the box, the app uses mock data so you can see the layout immediately._

---

## 🔥 2. Firebase Integration Steps

To make the Admin Dashboard functional and store your data persistently, simply connect your own Firebase project.

### Step 2.1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts.
3. Once created, click the **Web `</>`** icon to add a web app to your project.
4. Copy your `firebaseConfig` object keys.

### Step 2.2: Setup `.env.local`
1. Rename `.env.example` in your project root to `.env.local` (or create a new `.env.local` file).
2. Paste the config keys to look like this:
   ```env
   VITE_FIREBASE_API_KEY="your_api_key_here"
   VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
   VITE_FIREBASE_APP_ID="your_app_id"
   ```

### Step 2.3: Enable Authentication
1. In your Firebase Console, navigate to **Build > Authentication**.
2. Click **Get Started** and select **Email/Password**.
3. Enable it and save.
4. Go to the **Users** tab and **Add User** (e.g., `admin@system.local` with a solid password). This will be your admin login.

### Step 2.4: Enable Firestore Database
1. Go to **Build > Firestore Database**.
2. Click **Create Database**. Start in **Production mode**.
3. Go to the **Rules** tab and set the rules so that only authenticated admins can write data:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /portfolio/data {
         allow read: if true;
         // Require authentication to write
         allow write: if request.auth != null; 
       }
     }
   }
   ```
4. **Important Initialization**: Your database will be empty initially! 
   - Start your local site `npm run dev`.
   - Log into `/admin/login`.
   - The dashboard will load the local "mock" data first. Click **Commit Changes** to save that structure into your Firestore! It will then create the document automatically.

---

## 🌐 3. Deployment Guide (Vercel)

The easiest way to deploy this Vite application is through Vercel.

1. Init a Git repository and commit your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Push your code to a GitHub repository.
3. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
4. Import your GitHub repository.
5. In the **Environment Variables** section on Vercel, copy all the keys from your `.env.local` file (e.g., `VITE_FIREBASE_API_KEY` and its value).
6. Click **Deploy**.

Vercel will automatically detect Vite and configure the build settings (`npm run build`). Once finished, your site is live!
