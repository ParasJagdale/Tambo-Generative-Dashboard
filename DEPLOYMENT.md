# Deployment Guide - AI Life Dashboard

## 🚀 Vercel Deployment (Recommended)

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

4. **Add Environment Variables**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `OPENAI_API_KEY` (optional)
     - `NEXT_PUBLIC_OPENWEATHER_API_KEY` (optional)
     - `NEXT_PUBLIC_APP_URL`

5. **Redeploy**

```bash
vercel --prod
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Create Dockerfile
docker build -t ai-life-dashboard .

# Run container
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key ai-life-dashboard
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_OPENWEATHER_API_KEY=${NEXT_PUBLIC_OPENWEATHER_API_KEY}
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

---

## ☁️ Cloud Platform Deployment

### AWS Amplify

1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables
4. Deploy

### Netlify

1. Connect repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Enable Next.js runtime

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

## 🔧 Environment Variables

Create `.env.local` for local development:

```env
# Required
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional - Enhanced Features
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_OPENWEATHER_API_KEY=...
```

For production, set these in your deployment platform.

---

## 📦 Build Optimization

### Production Build

```bash
npm run build
npm run start
```

### Bundle Analysis

Add to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

Install analyzer:

```bash
npm install @next/bundle-analyzer
```

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
```

---

## 🔒 Security Checklist

- [ ] API keys in environment variables (never in code)
- [ ] HTTPS enabled in production
- [ ] CSP headers configured
- [ ] Rate limiting on API routes
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CORS properly configured

---

## 🎯 Performance Optimization

### Image Optimization

- Use Next.js Image component
- Lazy load images
- WebP format with fallbacks

### Code Splitting

- Dynamic imports for heavy components
- Route-based splitting (automatic with Next.js)

### Caching Strategy

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

---

## 📊 Monitoring

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🐛 Troubleshooting

### Build Errors

**Issue: "Cannot find module"**

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Issue: "Type errors"**

```bash
# Run type check
npm run type-check
```

### Runtime Errors

**Issue: "Hydration mismatch"**

- Check for client-only code in server components
- Use `'use client'` directive appropriately

**Issue: "API rate limits"**

- Implement caching
- Add retry logic with exponential backoff

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📱 Mobile Deployment

### Install as PWA

Add `manifest.json`:

```json
{
  "name": "AI Life Dashboard",
  "short_name": "AI Dashboard",
  "description": "Generative UI Productivity OS",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#0f172a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## ✅ Pre-deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] Performance metrics checked
- [ ] Security headers configured
- [ ] Analytics integrated
- [ ] Error tracking set up
- [ ] README updated
- [ ] License file included

---

## 🆘 Support

For deployment issues:

1. Check build logs
2. Verify environment variables
3. Test locally with production build
4. Check platform-specific documentation
5. Open an issue on GitHub

---

**Happy Deploying! 🚀**
