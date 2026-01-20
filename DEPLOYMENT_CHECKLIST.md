# Quick Deployment Checklist

## Pre-Deployment Steps

### 1. Ensure all changes are committed
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Set up MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create a free cluster
- [ ] Create database user
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Copy connection string

### 3. Set up Gmail App Password (for email feature)
- [ ] Go to Google Account → Security
- [ ] Enable 2-Step Verification
- [ ] Generate App Password
- [ ] Copy the 16-character password

---

## Render Deployment (Recommended)

### Backend Deployment
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `parallel-text-backend`
   - Root Directory: `parallel-text-backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your_email@gmail.com>
   SMTP_PASS=<your_gmail_app_password>
   PYTHON_VERSION=3.11.0
   ```
6. Click "Create Web Service"
7. **COPY THE BACKEND URL** (e.g., https://parallel-text-backend.onrender.com)

### Frontend Deployment
1. Click "New +" → "Static Site"
2. Connect same repository
3. Configure:
   - Name: `parallel-text-frontend`
   - Root Directory: `text-processor-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=<your_backend_url_from_above>
   ```
5. Click "Create Static Site"

---

## Vercel Deployment (Frontend) + Render (Backend)

### Backend on Render
Follow the "Backend Deployment" steps above.

### Frontend on Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: `text-processor-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=<your_render_backend_url>
   ```
6. Click "Deploy"

---

## Post-Deployment Testing

### Test Backend
```bash
curl https://your-backend-url.onrender.com/
# Should return: {"message":"Backend running"}
```

### Test Frontend
1. Visit your frontend URL
2. Test signup/login
3. Upload a test file
4. Verify all features work

---

## Common Issues

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### Frontend can't connect to backend
- Verify VITE_API_URL is set correctly
- Check backend CORS settings
- Ensure backend is running (check Render logs)

### Email not sending
- Verify Gmail App Password (not regular password)
- Check SMTP settings in environment variables
- Ensure 2-Step Verification is enabled on Gmail

---

## Free Tier Notes

⚠️ **Render Free Tier**: Services spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Consider upgrading to paid tier for production use

⚠️ **MongoDB Atlas Free Tier**: 512MB storage limit
- Monitor usage in Atlas dashboard
- Upgrade if you exceed limits

---

## Next Steps

- [ ] Test all functionality on production
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Set up backup strategy for MongoDB
- [ ] Document API endpoints for team

---

**Deployment Complete! 🎉**
