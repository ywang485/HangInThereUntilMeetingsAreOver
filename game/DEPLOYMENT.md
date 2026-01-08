# Deployment Guide

This Next.js game can be deployed to various static hosting services. Below are instructions for the most popular options.

## Vercel (Recommended)

Vercel is the easiest option as it's made by the creators of Next.js.

### Option 1: Deploy via Git (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect Next.js settings
6. Click "Deploy"
7. Your game will be live in minutes!

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

## Netlify

1. Push your code to a Git repository
2. Go to [netlify.com](https://netlify.com) and sign up/login
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Click "Deploy"

## GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be in the `out` directory

3. Push the `out` directory to the `gh-pages` branch:
   ```bash
   # Add these to package.json scripts:
   "deploy": "gh-pages -d out"

   # Install gh-pages
   npm install --save-dev gh-pages

   # Deploy
   npm run deploy
   ```

4. Enable GitHub Pages in your repository settings (Settings → Pages → Source: gh-pages branch)

## Static File Hosting (Any Provider)

The game exports to static HTML/CSS/JS files. After building:

```bash
npm run build
```

Upload the entire `out` directory to any static file host:
- AWS S3 + CloudFront
- Cloudflare Pages
- Firebase Hosting
- Render
- DigitalOcean App Platform

## Custom Domain

### Vercel
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Netlify
1. Go to "Domain settings"
2. Add custom domain
3. Update DNS records as instructed

## Environment Variables

This game doesn't require any environment variables. If you add features that need them:

1. Create a `.env.local` file (ignored by git)
2. Add variables with `NEXT_PUBLIC_` prefix to expose them to the browser
3. Configure them in your hosting platform's dashboard

## Performance Tips

1. **Enable Compression**: Most hosts enable this automatically
2. **CDN**: Vercel and Netlify use CDNs by default
3. **Caching**: Static assets are cached automatically with Next.js
4. **Image Optimization**: Currently using unoptimized images for static export. For better performance on Vercel, remove the `unoptimized: true` setting from `next.config.ts`

## Monitoring

- **Vercel**: Built-in analytics available in the dashboard
- **Netlify**: Analytics available with paid plans
- **Google Analytics**: Add tracking code to `app/layout.tsx`

## Troubleshooting

### Build Fails
- Ensure Node.js version is 18.x or higher
- Check that all dependencies are installed: `npm install`
- Review error logs in deployment platform

### 404 Errors
- Verify the output directory is set to `out`
- Check that static export is enabled in `next.config.ts`

### Styling Issues
- Clear browser cache
- Check that Tailwind CSS is properly configured
- Verify PostCSS config is present

## Rolling Back

### Vercel
- Go to Deployments
- Find previous successful deployment
- Click "..." → "Promote to Production"

### Netlify
- Go to Deploys
- Find previous deployment
- Click "Publish deploy"
