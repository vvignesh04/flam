# Vercel Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: `vvignesh04/flam`
5. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `performance-dashboard`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
6. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to project directory**:
   ```bash
   cd performance-dashboard
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deploy)
   - Project name: `performance-dashboard` (or your choice)
   - Directory: `./` (current directory)
   - Override settings? **No**

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Environment Variables

If you need any environment variables later, add them in:
- Vercel Dashboard → Project → Settings → Environment Variables

## Build Configuration

The project is configured for:
- **Framework**: Next.js 14
- **Node.js Version**: 18+ (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)

## Post-Deployment

After deployment:
1. Your dashboard will be available at: `https://your-project.vercel.app/dashboard`
2. The API route will be at: `https://your-project.vercel.app/api/data`

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation passes locally:
   ```bash
   npm run build
   ```

### API Route Issues

The API route uses Edge Runtime, which is supported by Vercel. If you see errors:
- Check that `export const runtime = 'edge'` is in `app/api/data/route.ts`
- Verify the route exports a GET handler

### Performance Issues

- Vercel automatically optimizes Next.js apps
- Edge runtime provides low latency
- Consider enabling Vercel Analytics for monitoring

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch will trigger automatic deployment
- Pull requests get preview deployments automatically

