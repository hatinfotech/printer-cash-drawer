# 🚀 Quick Start Guide - XPrinter XP 80C

Hướng dẫn nhanh để bắt đầu với XPrinter XP 80C tại IP 192.168.55.211

## Bước 1: Cài đặt

```bash
npm install
```

## Bước 2: Cấu hình

File cấu hình đã được set sẵn cho XPrinter XP 80C tại IP `192.168.55.211`.

Nếu cần thay đổi, tạo file `.env`:
```env
PRINTER_TYPE=epson
PRINTER_INTERFACE=tcp
PRINTER_IP=192.168.55.211
PRINTER_PORT=9100
PORT=3000
CASH_DRAWER_PIN=2
```

## Bước 3: Chạy service

```bash
npm start
```

Service sẽ chạy tại: `http://localhost:3000`

## Bước 4: Test

### Option 1: Dùng file HTML test

Mở file `examples/client-example.html` trong browser và test các chức năng.

### Option 2: Dùng curl

**Health check:**
```bash
curl http://localhost:3000/health
```

**Test in:**
```bash
curl -X POST http://localhost:3000/api/print \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test XPrinter XP 80C\n\nHello World!",
    "align": "center"
  }'
```

**Test cash drawer:**
```bash
curl -X POST http://localhost:3000/api/cash-drawer/open
```

## Bước 5: Tích hợp vào POS

Sử dụng code từ file `examples/pos-integration.js` để tích hợp vào POS web app của bạn.

Ví dụ:
```javascript
const printerClient = new PrinterServiceClient('http://localhost:3000');

// In hóa đơn
await printerClient.print(receiptText, { align: 'center' });

// Mở cash drawer
await printerClient.openCashDrawer();
```

## ❌ Troubleshooting nhanh

**Không kết nối được printer:**
- Kiểm tra printer đã bật chưa
- Ping IP: `ping 192.168.55.211`
- Kiểm tra máy tính và printer cùng mạng LAN

**In không ra:**
- Kiểm tra có giấy trong printer
- Kiểm tra đèn báo lỗi trên printer
- Xem log trong console để biết lỗi chi tiết

Chi tiết hơn xem file `SETUP_XPRINTER.md`

