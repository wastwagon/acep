# Deployment Guide - ACEP Platform on Render

This guide walks you through deploying the ACEP Platform to Render.com.

## 📋 Prerequisites

- [x] GitHub account
- [x] Render account (sign up at [render.com](https://render.com))
- [x] GitHub Desktop installed (or Git CLI)
- [x] Code pushed to GitHub repository

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

#### Using GitHub Desktop:

1. Open GitHub Desktop
2. Select "Add" → "Add Existing Repository"
3. Choose the ACEP folder: `/Users/OceanCyber/Downloads/ACEP`
4. Click "Publish repository"
5. Name: `ACEP`
6. Keep it public or private
7. Click "Publish Repository"
8. Make a commit: "Initial commit: ACEP Platform"
9. Click "Push origin"

#### Using Terminal:

```bash
cd /Users/OceanCyber/Downloads/ACEP

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: ACEP Platform"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/wastwagon/ACEP.git

# Push to GitHub
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 3: Create Web Service on Render

1. **Dashboard**
   - Click "New +" button
   - Select "Web Service"

2. **Connect Repository**
   - Select "wastwagon/ACEP" repository
   - Click "Connect"

3. **Configure Service**
   - **Name**: `acep-platform`
   - **Region**: Oregon (US West) or closest to Ghana
   - **Branch**: `main`
   - **Root Directory**: (leave blank)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Select Plan**
   - **Starter Plan**: $7/month (512 MB RAM) - Good for testing
   - **Standard Plan**: $25/month (4 GB RAM) - Recommended for production

5. **Environment Variables**
   Click "Advanced" and add:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://acep-platform.onrender.com
   ```

6. **Create Web Service**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Wait 5-10 minutes for initial build

### Step 4: Verify Deployment

1. Once deployed, you'll see: "Your service is live 🎉"
2. Click the URL: `https://acep-platform.onrender.com`
3. Verify the site loads correctly

### Step 5: Add Custom Domain (acep.africa)

1. **In Render Dashboard**
   - Go to your `acep-platform` service
   - Click "Settings" tab
   - Scroll to "Custom Domains"
   - Click "Add Custom Domain"

2. **Add Domains**
   - Add: `acep.africa`
   - Add: `www.acep.africa`

3. **Update DNS Records**
   Render will provide DNS records. Add these to your domain registrar:

   **For acep.africa:**
   ```
   Type: A
   Name: @
   Value: [Render IP address]
   ```

   **For www.acep.africa:**
   ```
   Type: CNAME
   Name: www
   Value: acep-platform.onrender.com
   ```

4. **SSL Certificate**
   - Render automatically provisions free SSL
   - Wait 15-30 minutes for DNS propagation
   - Your site will be available at `https://acep.africa`

### Step 6: Set Up PostgreSQL (Phase 2)

1. **Create Database**
   - Click "New +" → "PostgreSQL"
   - **Name**: `acep-db`
   - **Database**: `acep_production`
   - **User**: `acep_user`
   - **Region**: Same as web service
   - **Plan**: Starter ($7/month) or Standard ($20/month)

2. **Get Connection String**
   - Go to database dashboard
   - Copy "Internal Connection String"

3. **Add to Web Service**
   - Go to `acep-platform` service
   - Settings → Environment
   - Add: `DATABASE_URL=[paste connection string]`
   - Save changes (triggers auto-deploy)

### Step 7: Set Up Redis (Optional, Phase 3)

1. **Create Redis Instance**
   - Click "New +" → "Redis"
   - **Name**: `acep-cache`
   - **Plan**: Starter ($10/month)

2. **Add to Environment**
   - Copy Redis connection string
   - Add to web service: `REDIS_URL=[connection string]`

## 💰 Cost Summary

### Starter Setup (Development/Testing)
```
Web Service (Starter):     $7/month
PostgreSQL (Starter):      $7/month
Total:                    $14/month
```

### Production Setup (Recommended)
```
Web Service (Standard):   $25/month
PostgreSQL (Standard):    $20/month
Redis (Optional):         $10/month
Total:                    $45-55/month
```

### Free Tier (Limited)
```
Web Service (Free):       $0/month (750 hours, sleeps after 15 min)
Not recommended for production
```

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

1. Make changes to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. Render automatically detects and deploys (2-5 minutes)

## 📊 Monitoring & Logs

1. **View Logs**
   - Go to service dashboard
   - Click "Logs" tab
   - Real-time logs of your application

2. **Metrics**
   - Click "Metrics" tab
   - View CPU, memory, and bandwidth usage

3. **Health Checks**
   - Settings → Health Check Path: `/`
   - Render automatically monitors uptime

## 🔧 Troubleshooting

### Build Fails

**Error**: "npm install failed"
```bash
# Solution: Check package.json is valid
# Verify Node version in Render settings (20.x)
```

**Error**: "Build command failed"
```bash
# Solution: Update build command
Build Command: npm install --legacy-peer-deps && npm run build
```

### Site Not Loading

1. **Check Logs**
   - Look for errors in Render dashboard logs

2. **Verify Build**
   - Ensure build completed successfully
   - Check "Events" tab for deployment status

3. **Environment Variables**
   - Verify all required env vars are set
   - Restart service after adding env vars

### DNS Issues

1. **DNS Not Propagating**
   - Wait 24-48 hours for full propagation
   - Use [whatsmydns.net](https://www.whatsmydns.net) to check

2. **SSL Certificate Not Provisioning**
   - Verify DNS records are correct
   - Wait 15-30 minutes after DNS propagation

## 📱 Testing Before Going Live

1. **Use Render URL First**
   - Test thoroughly on `acep-platform.onrender.com`
   - Verify all features work

2. **Staging Environment** (Optional)
   - Create separate service for staging
   - Use branch: `staging`
   - Test changes before production

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use Render dashboard for secrets

2. **HTTPS Only**
   - Render provides free SSL
   - Force HTTPS in production

3. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

## 📞 Support

**Render Support**
- Docs: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)
- Email: support@render.com

**ACEP Team**
- Email: info@acep.africa
- Phone: (+233) 302 900 730

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created and deployed
- [ ] Site accessible at Render URL
- [ ] Custom domain added (acep.africa)
- [ ] DNS records updated
- [ ] SSL certificate provisioned
- [ ] Environment variables configured
- [ ] Monitoring set up
- [ ] Team notified

---

**Next Steps After Deployment:**
1. Monitor initial traffic and performance
2. Set up PostgreSQL database (Phase 2)
3. Migrate content from old sites
4. Test all features thoroughly
5. Announce new platform launch!
