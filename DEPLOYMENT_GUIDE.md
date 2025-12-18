# 🚀 BookFast Deployment Guide (Render & Vercel)

This guide walks you through deploying your **Node.js Backend** to **Render** and linking it with your **Vercel Frontend**.

---

## Part 1: Prepare Your Code
We have already verified your files. Ensure you have:
1.  **Pushed** all recent changes to GitHub (including the `engines` update in `package.json`).
2.  **Verified** your `.gitignore` excludes `.env` and `node_modules`.

---

## Part 2: Deploy Backend to Render

1.  **Create New Service**:
    *   Go to your [Render Dashboard](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure Settings** (CRITICAL):
    *   **Name**: `bookfast-api` (or similar)
    *   **Region**: Choose the one closest to you (e.g., Singapore, Frankfurt).
    *   **Root Directory**: `server`  <-- **EXTREMELY IMPORTANT**
        *   *Why? Because your `package.json` is inside the `server` folder, not the root.*
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Plan**: Free

3.  **Environment Variables** (Scroll down to "Environment Variables"):
    *   Add the following keys and values:
    
    | Key | Value | Note |
    | :--- | :--- | :--- |
    | `MONGODB_URI` | `mongodb+srv://...` | Your full Atlas connection string |
    | `JWT_SECRET` | `something_secret_random` | Any random string |
    | `NODE_ENV` | `production` | Optimizes performance |
    | `CLIENT_URL` | `https://book-fast.vercel.app` | **No trailing slash**. Allows your frontend to connect. |
    | `NODE_VERSION`| `20.10.0` | Optional, ensures correct Node version |

4.  **Deploy**: Click **Create Web Service**.
    *   Watch the logs. You should see "Server build successful" and then "Server running on port 5001".

---

## Part 3: Deploy Frontend to Vercel

1.  **Import Project**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** -> **Project**.
    *   Import your `BookFast` repo.

2.  **Configure Project**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: Click "Edit" and select `client`.
    
3.  **Environment Variables**:
    *   Add the following:
    
    | Key | Value |
    | :--- | :--- |
    | `VITE_API_URL` | `https://bookfast-api.onrender.com` | **No trailing slash**. Your new Render URL. |

4.  **Deploy**: Click **Deploy**.

---

## Part 4: Final Verification

1.  **MongoDB Network Access**:
    *   Ensure `0.0.0.0/0` is whitelisted in MongoDB Atlas Network Access (as per the troubleshooting guide).

2.  **Test**:
    *   Open your Vercel URL.
    *   Open Developer Console (F12).
    *   Check for "✅ Socket.IO connected".
    *   Try logging in or registering.

## Troubleshooting
If it fails, check the **Logs** tab in Render.
*   **"build failed"**: Did you set Root Directory to `server`?
*   **"CORS error"**: Did you set `CLIENT_URL` correctly in Render and `VITE_API_URL` in Vercel?
