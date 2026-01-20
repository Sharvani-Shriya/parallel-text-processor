# Deployment Guide - Parallel Text Processor

This guide covers deploying your full-stack application to **Render** (recommended) or **Vercel**.

---

## 🚀 Option 1: Deploy to Render (Recommended)

Render is ideal for this project as it supports both the Python backend and React frontend.

### Prerequisites
- GitHub account with your project pushed to a repository
- MongoDB Atlas account (for production database)
- Gmail account with App Password (for email functionality)

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Get your connection string (e.g., `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>`)

### Step 2: Deploy Backend to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `parallel-text-backend`
   - **Region**: Choose closest to you
   - **Root Directory**: `parallel-text-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_gmail_app_password
   PYTHON_VERSION=3.11.0
   ```

6. **Click "Create Web Service"**
7. **Copy the service URL** (e.g., `https://parallel-text-backend.onrender.com`)

### Step 3: Deploy Frontend to Render

1. **Click "New +" → "Static Site"**
2. **Connect the same GitHub repository**
3. **Configure the site:**
   - **Name**: `parallel-text-frontend`
   - **Root Directory**: `text-processor-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://parallel-text-backend.onrender.com
   ```
   (Replace with your actual backend URL from Step 2)

5. **Click "Create Static Site"**

### Step 4: Test Your Deployment

1. Visit your frontend URL (e.g., `https://parallel-text-frontend.onrender.com`)
2. Test the login/signup functionality
3. Upload a test document
4. Verify all features work

---

## 🌐 Option 2: Deploy to Vercel (Frontend Only)

Vercel is great for the frontend, but you'll need to deploy the backend elsewhere (like Render or Railway).

### Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Configure:**
     - **Framework Preset**: Vite
     - **Root Directory**: `text-processor-frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
3. **Add Environment Variable:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

4. **Deploy Backend:**
   - Follow Render backend steps above
   - Or use Railway, Fly.io, or any Python hosting service

---

## 📋 Environment Variables Reference

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🔧 Troubleshooting

### Backend Issues
- **Build fails**: Check `requirements.txt` has all dependencies
- **Database connection fails**: Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- **Email not sending**: Ensure you're using Gmail App Password, not regular password

### Frontend Issues
- **API calls fail**: Verify `VITE_API_URL` is set correctly
- **CORS errors**: Check backend CORS settings allow your frontend domain
- **Build fails**: Ensure all dependencies are in `package.json`

### Free Tier Limitations
- **Render Free Tier**: Services spin down after 15 minutes of inactivity (first request may be slow)
- **MongoDB Atlas Free Tier**: 512MB storage limit
- **Vercel Free Tier**: 100GB bandwidth/month

---

## 🎯 Post-Deployment Checklist

- [ ] Backend is accessible and returns `{"message": "Backend running"}` at root
- [ ] Frontend loads without errors
- [ ] Login/Signup works
- [ ] File upload and processing works
- [ ] Search functionality works
- [ ] CSV export works
- [ ] Email summary works (if configured)

---

## 📱 Custom Domain (Optional)

### Render
1. Go to your service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:
- Push to your `main` branch → Automatic deployment
- Configure branch-specific deployments in settings
- Set up preview deployments for pull requests

---

## 💡 Tips

1. **Monitor Logs**: Check deployment logs if something fails
2. **Use Environment Variables**: Never commit secrets to Git
3. **Test Locally First**: Ensure everything works locally before deploying
4. **Start with Free Tier**: Upgrade only when needed
5. **Enable HTTPS**: Both platforms provide free SSL certificates

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

**Happy Deploying! 🚀**
