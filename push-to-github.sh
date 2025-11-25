#!/bin/bash

# Script để push project lên GitHub
# Cách sử dụng: ./push-to-github.sh <github-repo-url>

if [ -z "$1" ]; then
    echo "❌ Vui lòng cung cấp URL repository GitHub"
    echo ""
    echo "Cách sử dụng:"
    echo "  ./push-to-github.sh https://github.com/USERNAME/repo-name.git"
    echo ""
    echo "Hoặc với SSH:"
    echo "  ./push-to-github.sh git@github.com:USERNAME/repo-name.git"
    exit 1
fi

REPO_URL=$1

echo "🚀 Đang đẩy project lên GitHub..."
echo "📦 Repository URL: $REPO_URL"
echo ""

# Kiểm tra remote đã tồn tại chưa
if git remote | grep -q "^origin$"; then
    echo "⚠️  Remote 'origin' đã tồn tại."
    read -p "Bạn có muốn thay thế bằng URL mới? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "$REPO_URL"
        echo "✅ Đã cập nhật remote URL"
    else
        echo "❌ Hủy bỏ"
        exit 1
    fi
else
    git remote add origin "$REPO_URL"
    echo "✅ Đã thêm remote origin"
fi

# Đảm bảo branch là main
git branch -M main

# Push code
echo ""
echo "📤 Đang push code lên GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ Hoàn thành! Code đã được đẩy lên GitHub"
    echo "🔗 Xem repository tại: $REPO_URL"
else
    echo ""
    echo "❌ Lỗi khi push. Có thể do:"
    echo "   - Repository chưa tồn tại trên GitHub"
    echo "   - Chưa xác thực với GitHub (username/password hoặc SSH key)"
    echo "   - Repository đã có code khác cần merge trước"
    exit 1
fi

