# Complete Deployment Guide for Naushad ImageToText App

This guide provides step-by-step instructions for deploying your ImageToText app to GitHub Pages, Netlify, and Vercel.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [GitHub Pages Deployment](#github-pages-deployment)
3. [Netlify Deployment](#netlify-deployment)
4. [Vercel Deployment](#vercel-deployment)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Git installed and configured
- ✅ GitHub account
- ✅ Netlify account (optional)
- ✅ Vercel account (optional)
- ✅ Your app builds successfully (`npm run build`)

## GitHub Pages Deployment

### Method 1: GitHub Actions (Recommended)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Create GitHub Actions Workflow**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout
         uses: actions/checkout@v3
         
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
           
       - name: Install dependencies
         run: npm ci
         
       - name: Build
         run: npm run build
         
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./out
   ```

3. **Configure Next.js for Static Export**
   Update `next.config.js`:
   ```javascript
   /** @type {import('next').Config} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   
   module.exports = nextConfig
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"
   - Save settings

5. **Deploy**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

### Method 2: Manual Deployment

1. **Build for Static Export**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to gh-pages branch**
   ```bash
   npm install -g gh-pages
   gh-pages -d out
   ```

## Netlify Deployment

### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Choose your repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: out
   ```

3. **Environment Variables** (if needed)
   - Go to Site settings > Environment variables
   - Add any required variables

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

### Method 2: Drag & Drop

1. **Build Locally**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy**
   - Go to Netlify dashboard
   - Drag the `out` folder to the deploy area
   - Your site will be live instantly

### Method 3: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and Deploy**
   ```bash
   netlify login
   netlify deploy --prod --dir=out
   ```

## Vercel Deployment

### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Choose your repository

2. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: out
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## Custom Domain Setup

### GitHub Pages
1. Go to repository settings > Pages
2. Add your custom domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

### Netlify
1. Go to Site settings > Domain management
2. Add custom domain
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### Vercel
1. Go to Project settings > Domains
2. Add your domain
3. Update DNS records as shown in Vercel dashboard

## Environment Variables

### GitHub Pages
- No environment variables needed for static sites
- Use build-time variables in `next.config.js`

### Netlify
```bash
# In Netlify dashboard or netlify.toml
[build.environment]
NODE_VERSION = "18"
```

### Vercel
```bash
# In Vercel dashboard or vercel.json
{
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Build Configuration

### Update package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export",
    "deploy": "npm run build && npm run export"
  }
}
```

### Update next.config.js
```javascript
/** @type {import('next').Config} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add basePath if deploying to subdirectory
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/',
}

module.exports = nextConfig
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Images Not Loading**
   - Ensure `images.unoptimized: true` in next.config.js
   - Use relative paths for images

3. **Routing Issues**
   - Add `trailingSlash: true` in next.config.js
   - Use Next.js Link component for navigation

4. **404 Errors**
   - Ensure all pages are properly exported
   - Check file paths and case sensitivity

### Performance Optimization

1. **Enable Compression**
   ```javascript
   // next.config.js
   const nextConfig = {
     compress: true,
     // ... other config
   }
   ```

2. **Optimize Images**
   - Use WebP format when possible
   - Implement lazy loading
   - Optimize image sizes

3. **Code Splitting**
   - Use dynamic imports for large components
   - Implement proper loading states

## Deployment Checklist

### Before Deployment
- [ ] Test build locally (`npm run build`)
- [ ] Check all pages load correctly
- [ ] Verify all images and assets work
- [ ] Test responsive design
- [ ] Check SEO meta tags
- [ ] Validate HTML/CSS

### After Deployment
- [ ] Test all functionality
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test form submissions
- [ ] Check loading performance
- [ ] Validate SEO

## Monitoring and Analytics

### GitHub Pages
- Use GitHub Insights for traffic data
- Integrate Google Analytics

### Netlify
- Built-in analytics dashboard
- Real-time visitor insights
- Form submissions tracking

### Vercel
- Built-in analytics
- Performance monitoring
- Real-time logs

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data
   - Use platform-specific secret management

2. **HTTPS**
   - All platforms provide free SSL certificates
   - Ensure HTTPS is enabled

3. **Content Security Policy**
   ```javascript
   // next.config.js
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'Content-Security-Policy',
               value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
             }
           ]
         }
       ]
     }
   }
   ```

## Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| GitHub Pages | ✅ Unlimited | N/A | Open source projects |
| Netlify | ✅ 100GB bandwidth | $19/month | Static sites, forms |
| Vercel | ✅ 100GB bandwidth | $20/month | Next.js apps, serverless |

## Conclusion

Choose your deployment platform based on your needs:
- **GitHub Pages**: Best for open source projects
- **Netlify**: Best for static sites with forms
- **Vercel**: Best for Next.js applications

All platforms offer excellent performance and reliability. Start with the free tiers and upgrade as needed.

## Support

For issues with deployment:
1. Check platform documentation
2. Review build logs
3. Test locally first
4. Contact platform support

---

**Happy Deploying! 🚀**

Your Naushad ImageToText app is now ready for production deployment!
