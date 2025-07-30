# DNS Configuration Guide for labubu-collectibles.com

## Current Setup (Development)
Your domain is registered and using Cloudflare DNS. For development testing:

### Local Development DNS
```
A Record: labubu-collectibles.com → 127.0.0.1
CNAME Record: www.labubu-collectibles.com → labubu-collectibles.com
```

### Testing URLs
- Frontend: http://labubu-collectibles.com:3000
- Backend: http://labubu-collectibles.com:3001
- Admin: http://labubu-collectibles.com:3000/admin

## Production Setup (When Ready)
When you deploy to production hosting:

### Production DNS
```
A Record: labubu-collectibles.com → [Your Server IP]
CNAME Record: www.labubu-collectibles.com → labubu-collectibles.com
```

### SSL Configuration
- Cloudflare SSL: Automatic (Free)
- Force HTTPS: Enabled
- SSL/TLS Mode: Full (strict)

## Next Steps
1. Configure local hosts file for development
2. Set up production hosting
3. Update DNS records for production
4. Test SSL certificate
5. Configure email (optional)

## Cloudflare Settings to Enable
- ✅ SSL/TLS: Full (strict)
- ✅ Always Use HTTPS: On
- ✅ Auto Minify: HTML, CSS, JS
- ✅ Brotli: On
- ✅ Early Hints: On
- ✅ Rocket Loader: On 