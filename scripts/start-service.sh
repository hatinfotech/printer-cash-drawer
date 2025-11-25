#!/bin/bash

# Script để start service với error handling tốt
# Sử dụng PM2 nếu có, nếu không thì chạy trực tiếp

SERVICE_NAME="printer-cash-drawer-service"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR" || exit 1

# Tạo thư mục logs nếu chưa có
mkdir -p logs

echo "🚀 Starting $SERVICE_NAME..."

# Kiểm tra xem PM2 đã được cài chưa
if command -v pm2 &> /dev/null; then
    echo "📦 Using PM2 to manage service..."
    pm2 start ecosystem.config.js
    echo "✅ Service started with PM2"
    echo "📋 Use 'pm2 logs printer-service' to view logs"
    echo "📋 Use 'pm2 status' to check status"
    echo "📋 Use 'pm2 stop printer-service' to stop"
else
    echo "⚠️  PM2 not found. Running directly with node..."
    echo "💡 Install PM2 for better process management: npm install -g pm2"
    echo ""
    node index.js
fi

