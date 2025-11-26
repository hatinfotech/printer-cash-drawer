# 🪟 Hướng dẫn sử dụng trên Windows

## 🚀 Cài đặt và chạy nhanh

### Bước 1: Cài đặt Node.js (nếu chưa có)

Tải và cài đặt Node.js từ: https://nodejs.org/

### Bước 2: Cài đặt dependencies

**Double-click vào file:** `install.bat`

Hoặc mở Command Prompt và chạy:
```bash
install.bat
```

### Bước 3: Cấu hình printer (nếu cần)

Mở file `config.js` và chỉnh sửa theo cấu hình printer của bạn:
- IP address: `192.168.55.211` (mặc định cho XPrinter XP 80C)
- Port: `9100` (mặc định)
- Printer type: `epson` (đúng cho XPrinter)

### Bước 4: Chạy service

**Double-click vào file:** `start.bat`

Service sẽ chạy tại: `http://localhost:3000`

## 📋 Các file script

- **`install.bat`** - Cài đặt dependencies (chạy lần đầu)
- **`start.bat`** - Khởi động service
- **`stop.bat`** - Dừng service

## 🛑 Dừng service

**Double-click vào file:** `stop.bat`

Hoặc nhấn `Ctrl+C` trong cửa sổ đang chạy service.

## 🔧 Cài đặt như Windows Service (Tự động khởi động cùng Windows)

Để service tự động khởi động cùng Windows:

1. **Right-click vào `install-service.bat`**
2. **Chọn "Run as administrator"**
3. Service sẽ được cài đặt và tự động khởi động

Xem chi tiết: [SERVICE_SETUP.md](SERVICE_SETUP.md)

**Gỡ cài đặt service:**
- Right-click `uninstall-service.bat` → Run as administrator

## ✅ Kiểm tra service

Mở browser và truy cập: `http://localhost:3000/health`

Hoặc test in:
```bash
curl -X POST http://localhost:3000/api/print -H "Content-Type: application/json" -d "{\"text\":\"Test print\n\",\"align\":\"center\"}"
```

## 🔧 Troubleshooting

### Service không chạy được

1. Kiểm tra Node.js đã cài đặt:
   ```bash
   node --version
   ```

2. Kiểm tra dependencies đã cài đặt:
   ```bash
   install.bat
   ```

3. Kiểm tra printer có kết nối:
   ```bash
   ping 192.168.55.211
   ```

### Port 3000 đã được sử dụng

Chạy `stop.bat` để dừng service cũ, sau đó chạy lại `start.bat`.

## 📝 Ghi chú

- Service sẽ chạy trong cửa sổ Command Prompt
- Để chạy service ở background, có thể sử dụng `nssm` hoặc `pm2`
- Xem thêm `README.md` để biết chi tiết về API endpoints

