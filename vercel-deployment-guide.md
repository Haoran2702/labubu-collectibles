# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
- GitHub repository with your code
- Vercel account (free)
- Railway account (for backend)

## 🚀 Step 1: Deploy Backend to Railway

### 1.1 Sign up for Railway
- Go to [railway.app](https://railway.app)
- Sign up with GitHub
- Create new project

### 1.2 Deploy Backend
- Connect your GitHub repository
- Select the `backend` folder
- Railway will auto-detect Node.js
- Deploy automatically

### 1.3 Get Railway URL
- After deployment, copy the Railway URL
- Example: `https://labubu-backend.railway.app`

## 🚀 Step 2: Deploy Frontend to Vercel

### 2.1 Sign up for Vercel
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Import your repository

### 2.2 Configure Deployment
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 2.3 Environment Variables
Add these in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://labubu-backend.railway.app
```

### 2.4 Deploy
- Click "Deploy"
- Wait for build to complete
- Get your Vercel URL

## 🔗 Step 3: Connect Custom Domain

### 3.1 Add Domain in Vercel
- Go to your project settings
- Add custom domain: `labubu-collectibles.com`
- Vercel will provide DNS records

### 3.2 Update Cloudflare DNS
- Go to Cloudflare dashboard
- Add CNAME record:
  - Name: `@`
  - Target: `cname.vercel-dns.com`

### 3.3 SSL Certificate
- Vercel automatically provides SSL
- Your site will be available at `https://labubu-collectibles.com`

## ✅ Step 4: Test Everything

### 4.1 Test URLs
- Frontend: `https://labubu-collectibles.com`
- Backend: `https://labubu-backend.railway.app`
- Admin: `https://labubu-collectibles.com/admin`

### 4.2 Test Features
- ✅ Product browsing
- ✅ User registration/login
- ✅ Shopping cart
- ✅ Admin panel
- ✅ Payment integration

## 🎯 Expected Results

### Professional URLs:
- **Main Site**: `https://labubu-collectibles.com`
- **Products**: `https://labubu-collectibles.com/products`
- **Admin**: `https://labubu-collectibles.com/admin`

### Features Working:
- ✅ SSL certificate (padlock icon)
- ✅ Fast loading (CDN)
- ✅ Mobile responsive
- ✅ Professional appearance

## 💰 Cost Breakdown

| Service | Cost | Duration |
|---------|------|----------|
| **Domain** | $8.57/year | Already purchased |
| **Vercel** | $0/month | Free tier |
| **Railway** | $0/month | Free credit |
| **Total** | **$0.71/month** | For demo |

## 🚀 Next Steps

1. **Deploy backend** to Railway
2. **Deploy frontend** to Vercel
3. **Connect domain** in Vercel
4. **Update DNS** in Cloudflare
5. **Test everything**
6. **Share with investors**

## 📞 Support

If you encounter issues:
- Check Vercel build logs
- Check Railway deployment logs
- Verify DNS propagation (can take 24-48 hours)
- Test with different browsers/devices 