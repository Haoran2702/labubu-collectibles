#!/bin/bash

# Production Setup Script for Labubu Collectibles
# This script sets up the production environment

set -e

echo "🚀 Setting up Labubu Collectibles Production Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p /opt/homebrew/var/log/nginx
mkdir -p /opt/homebrew/etc/nginx/servers

# Set up Nginx configuration
print_status "Setting up Nginx configuration..."
if [ -f "nginx-production.conf" ]; then
    sudo cp nginx-production.conf /opt/homebrew/etc/nginx/servers/
    print_status "Nginx configuration copied"
else
    print_warning "nginx-production.conf not found. Please create it first."
fi

# Install production dependencies
print_status "Installing production dependencies..."

# Backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm ci --only=production
npm run build

# Frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
npm ci --only=production
npm run build

cd ..

# Set up PM2
print_status "Setting up PM2..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Create production environment file template
print_status "Creating production environment template..."
cat > .env.production.template << 'EOF'
# Production Environment Variables
# Copy this to .env and fill in your actual values

# Backend (.env)
NODE_ENV=production
PORT=3001
JWT_SECRET=your-strong-production-secret-here
STRIPE_SECRET_KEY=sk_live_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
EMAIL_USER=your_production_email@domain.com
EMAIL_PASS=your_production_email_password_here

# Frontend (.env.local)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key_here
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here
EOF

print_status "Production environment template created as .env.production.template"

# Set up log rotation
print_status "Setting up log rotation..."
sudo mkdir -p /var/log/nginx
sudo touch /var/log/nginx/labubu_access.log
sudo touch /var/log/nginx/labubu_error.log
sudo chown -R $(whoami):admin /var/log/nginx/

# Create systemd service files (for Linux systems)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_status "Creating systemd service files..."
    sudo tee /etc/systemd/system/labubu-backend.service > /dev/null <<EOF
[Unit]
Description=Labubu Backend
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node backend/dist/bin/www.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    sudo tee /etc/systemd/system/labubu-frontend.service > /dev/null <<EOF
[Unit]
Description=Labubu Frontend
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
fi

# Create health check script
print_status "Creating health check script..."
cat > scripts/health-check.sh << 'EOF'
#!/bin/bash

# Health check script for Labubu Collectibles

FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001/api"

echo "🔍 Checking Labubu Collectibles health..."

# Check frontend
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding"
    exit 1
fi

# Check backend
if curl -f -s "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding"
    exit 1
fi

# Check database
if [ -f "backend/database.sqlite" ]; then
    echo "✅ Database file exists"
else
    echo "❌ Database file not found"
    exit 1
fi

echo "🎉 All systems are healthy!"
EOF

chmod +x scripts/health-check.sh

# Create backup script
print_status "Creating backup script..."
cat > scripts/backup.sh << 'EOF'
#!/bin/bash

# Backup script for Labubu Collectibles

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="labubu_backup_$DATE"

echo "📦 Creating backup: $BACKUP_NAME"

mkdir -p "$BACKUP_DIR"

# Backup database
if [ -f "backend/database.sqlite" ]; then
    cp backend/database.sqlite "$BACKUP_DIR/${BACKUP_NAME}_database.sqlite"
    echo "✅ Database backed up"
fi

# Backup environment files
if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/${BACKUP_NAME}_env"
    echo "✅ Environment file backed up"
fi

# Backup logs
if [ -d "logs" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_logs.tar.gz" logs/
    echo "✅ Logs backed up"
fi

# Create archive
tar -czf "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" \
    backend/database.sqlite \
    .env \
    logs/ \
    2>/dev/null || true

echo "✅ Backup completed: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"

# Clean old backups (keep last 7 days)
find "$BACKUP_DIR" -name "labubu_backup_*.tar.gz" -mtime +7 -delete
echo "🧹 Cleaned old backups"
EOF

chmod +x scripts/backup.sh

print_status "✅ Production setup completed!"

echo ""
echo "📋 Next steps:"
echo "1. Copy .env.production.template to .env and fill in your values"
echo "2. Update nginx-production.conf with your domain and SSL certificate paths"
echo "3. Run: pm2 start ecosystem.config.js --env production"
echo "4. Run: brew services start nginx"
echo "5. Test your deployment with: ./scripts/health-check.sh"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: pm2 logs"
echo "- Monitor: pm2 monit"
echo "- Restart: pm2 restart all"
echo "- Backup: ./scripts/backup.sh"
echo "- Health check: ./scripts/health-check.sh" 