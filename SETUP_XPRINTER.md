# Hướng dẫn cấu hình cho XPrinter XP 80C

## 📋 Thông tin máy in

- **Model**: XPrinter XP 80C
- **IP Address**: 192.168.55.211
- **Port**: 9100 (port mặc định cho raw printing)
- **Protocol**: ESC/POS (tương thích với Epson)
- **Kết nối**: TCP/IP (Network)

## 🔧 Cấu hình nhanh

### 1. Tạo file `.env`

Tạo file `.env` trong thư mục root của project với nội dung sau:

```env
# XPrinter XP 80C Configuration
PRINTER_TYPE=epson
# XPrinter sử dụng ESC/POS commands giống Epson

PRINTER_INTERFACE=tcp
# Kết nối qua TCP/IP network

PRINTER_IP=192.168.55.211
PRINTER_PORT=9100

# Server Configuration
PORT=3000

# Cash Drawer Pin (tùy chọn, mặc định là 2)
CASH_DRAWER_PIN=2
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Kiểm tra kết nối đến printer

Trước khi chạy service, kiểm tra xem có thể kết nối đến printer không:

**Windows:**
```bash
ping 192.168.55.211
telnet 192.168.55.211 9100
```

**Mac/Linux:**
```bash
ping 192.168.55.211
nc -zv 192.168.55.211 9100
```

Nếu kết nối thành công, bạn sẽ thấy port 9100 đang mở.

### 4. Chạy service

```bash
npm start
```

Service sẽ chạy tại `http://localhost:3000`

## ✅ Kiểm tra hoạt động

### 1. Health Check

Mở browser và truy cập: `http://localhost:3000/health`

Hoặc dùng curl:
```bash
curl http://localhost:3000/health
```

### 2. Kiểm tra Printer Status

```bash
curl http://localhost:3000/api/printer/status
```

### 3. Test in

Sử dụng file `examples/client-example.html` để test in hoặc gọi API trực tiếp:

```bash
curl -X POST http://localhost:3000/api/print \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test print\nXPrinter XP 80C\n\n",
    "align": "center"
  }'
```

### 4. Test mở cash drawer

```bash
curl -X POST http://localhost:3000/api/cash-drawer/open
```

## 🖨️ Đặc điểm XPrinter XP 80C

- **Độ rộng giấy**: 80mm (48 ký tự)
- **Hỗ trợ tiếng Việt**: Có (UTF-8 encoding)
- **Tốc độ in**: Nhanh
- **Cash drawer**: Hỗ trợ qua pin 2 (mặc định)

## 🔍 Troubleshooting

### Lỗi: "Cannot connect to printer"

**Nguyên nhân:**
- Printer chưa bật hoặc không kết nối mạng
- IP address không đúng
- Firewall chặn port 9100
- Máy tính và printer không cùng mạng

**Giải pháp:**
1. Kiểm tra printer đã bật và có đèn sáng không
2. Kiểm tra IP của printer trên màn hình LCD (nếu có) hoặc in test page
3. Ping đến IP để đảm bảo kết nối mạng
4. Kiểm tra firewall trên máy tính
5. Đảm bảo máy tính và printer cùng mạng LAN

### Lỗi: "Print failed" nhưng không có lỗi kết nối

**Nguyên nhân:**
- Nội dung in quá dài
- Ký tự đặc biệt không được hỗ trợ
- Printer đang bận

**Giải pháp:**
1. Thử in nội dung ngắn trước
2. Kiểm tra xem có giấy trong printer không
3. Kiểm tra đèn báo lỗi trên printer
4. Thử reset printer (tắt/bật lại)

### Cash drawer không mở

**Nguyên nhân:**
- Cash drawer không được kết nối với printer
- Pin number không đúng
- Lệnh ESC/POS không được hỗ trợ

**Giải pháp:**
1. Kiểm tra cáp kết nối giữa printer và cash drawer
2. Thử thay đổi `CASH_DRAWER_PIN` trong `.env` (thử pin 1 hoặc 2)
3. Kiểm tra manual của cash drawer để biết pin chính xác
4. Đảm bảo cash drawer có nguồn điện (nếu cần)

### Tiếng Việt bị lỗi font

**Nguyên nhân:**
- Encoding không đúng
- Printer chưa được cấu hình đúng

**Giải pháp:**
1. Đảm bảo nội dung được gửi dưới dạng UTF-8
2. Kiểm tra cấu hình `characterSet` trong printer service
3. Thử in với nội dung tiếng Việt đơn giản trước

## 📝 Ghi chú

- XPrinter XP 80C tương thích tốt với ESC/POS commands của Epson
- Port 9100 là port raw printing chuẩn cho TCP/IP printers
- Nếu printer có cấu hình khác, kiểm tra manual để biết port chính xác
- Một số model XPrinter có thể dùng port 515 (LPR) - cần cấu hình lại nếu cần

## 🔗 Tài liệu tham khảo

- [XPrinter Manual](http://www.xprinter.cn/) (nếu có)
- ESC/POS Command Reference
- node-thermal-printer documentation

