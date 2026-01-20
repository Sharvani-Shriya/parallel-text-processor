# Parallel Text Processor - Deployment Files

This directory contains all the necessary configuration files for deploying your application.

## 📁 Deployment Files

### Configuration Files
- **`render.yaml`** - Render Blueprint for automated deployment
- **`vercel.json`** - Vercel configuration for frontend deployment
- **`requirements.txt`** - Python dependencies for backend (in `parallel-text-backend/`)

### Documentation
- **`DEPLOYMENT.md`** - Comprehensive deployment guide
- **`DEPLOYMENT_CHECKLIST.md`** - Quick reference checklist

### Environment Templates
- **`parallel-text-backend/.env.production`** - Backend environment variables template
- **`text-processor-frontend/.env.production`** - Frontend environment variables template

## 🚀 Quick Start

### For Render (Recommended)
1. Push your code to GitHub
2. Follow instructions in `DEPLOYMENT_CHECKLIST.md`
3. Deploy backend first, then frontend

### For Vercel (Frontend) + Render (Backend)
1. Deploy backend to Render (see `DEPLOYMENT.md`)
2. Deploy frontend to Vercel using `vercel.json` config
3. Set environment variables as documented

## 📝 Important Notes

- **Never commit `.env` files** - They're already in `.gitignore`
- **Update environment variables** in the deployment platform, not in code
- **Test locally first** before deploying to production
- **Free tier limitations** - See `DEPLOYMENT.md` for details

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🆘 Need Help?

Refer to the troubleshooting sections in:
- `DEPLOYMENT.md` - Detailed troubleshooting
- `DEPLOYMENT_CHECKLIST.md` - Common issues and solutions

---

**Ready to deploy? Start with `DEPLOYMENT_CHECKLIST.md`! 🚀**
