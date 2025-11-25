# Printer & Cash Drawer Service Adapter

Service adapter cho phép POS web application kết nối qua localhost API để in hóa đơn và mở ngăn kéo tiền.

## 🚀 Tính năng

- ✅ In hóa đơn từ web application
- ✅ Mở cash drawer (ngăn kéo tiền) từ web application  
- ✅ RESTful API đơn giản và dễ sử dụng
- ✅ Hỗ trợ nhiều loại thermal printer (Epson, Star, generic)
- ✅ Hỗ trợ kết nối TCP/IP, USB, Serial
- ✅ Chạy trên localhost, an toàn và nhanh chóng

## 📋 Yêu cầu

- Node.js >= 14.x
- npm hoặc yarn
- Thermal printer kết nối qua network (TCP/IP) hoặc USB
- Cash drawer được kết nối với printer

## 🔧 Cài đặt

1. **Clone hoặc tải project về**

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Cấu hình printer:**

Tạo file `.env` từ `.env.example` và chỉnh sửa theo cấu hình printer của bạn:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
PRINTER_TYPE=epson          # Loại printer: epson, star, thermal
PRINTER_INTERFACE=tcp       # Cách kết nối: tcp, usb, serial
PRINTER_IP=192.168.55.211   # IP của printer (nếu dùng TCP/IP)
                            # Ví dụ: XPrinter XP 80C tại 192.168.55.211
PRINTER_PORT=9100           # Port của printer (thường là 9100)
PORT=3000                   # Port của service này
CASH_DRAWER_PIN=2           # Pin cho cash drawer (mặc định là 2)
```

**Lưu ý cho XPrinter XP 80C:**
- XPrinter sử dụng ESC/POS commands giống Epson, nên dùng `PRINTER_TYPE=epson`
- IP mặc định trong code đã được cấu hình cho XPrinter XP 80C tại 192.168.55.211

## ▶️ Chạy service

### Windows (Dễ nhất - Chỉ cần double-click)

1. **Cài đặt dependencies lần đầu:** Double-click vào `install.bat`
2. **Chạy service:** Double-click vào `start.bat`
3. **Dừng service:** Double-click vào `stop.bat`

Xem chi tiết: [README_WINDOWS.md](README_WINDOWS.md)

### Command Line

```bash
npm start
```

Hoặc chạy ở chế độ development (tự động restart khi code thay đổi):

```bash
npm run dev
```

Service sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### 1. Health Check
```
GET /health
```

Kiểm tra service có đang chạy không.

**Response:**
```json
{
  "status": "ok",
  "service": "printer-cash-drawer-service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. In hóa đơn
```
POST /api/print
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "CỬA HÀNG ABC\n123 Đường XYZ\n\nHÓA ĐƠN BÁN HÀNG\n\nSản phẩm 1     100.000đ\nSản phẩm 2     200.000đ\n\nTổng cộng:     300.000đ\n\nCảm ơn quý khách!",
  "type": "text",
  "align": "left",
  "width": 48
}
```

**Parameters:**
- `text` (required): Nội dung cần in
- `type` (optional): Loại nội dung - `text`, `html`, `raw` (default: `text`)
- `align` (optional): Căn lề - `left`, `center`, `right` (default: `left`)
- `width` (optional): Độ rộng (default: 48)
- `encoding` (optional): Encoding cho raw type (default: `utf8`)

**Response:**
```json
{
  "success": true,
  "message": "Print job sent successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Mở cash drawer
```
POST /api/cash-drawer/open
```

**Response:**
```json
{
  "success": true,
  "message": "Cash drawer opened successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. Kiểm tra trạng thái printer
```
GET /api/printer/status
```

**Response:**
```json
{
  "success": true,
  "status": {
    "printerType": "epson",
    "interface": "tcp",
    "connectionParams": {
      "ip": "192.168.1.100",
      "port": 9100
    },
    "initialized": true
  }
}
```

## 💻 Ví dụ sử dụng từ POS Web App

### JavaScript/TypeScript

```javascript
// In hóa đơn
async function printReceipt(receiptText) {
  try {
    const response = await fetch('http://localhost:3000/api/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: receiptText,
        align: 'center'
      })
    });
    
    const result = await response.json();
    console.log('Print result:', result);
    return result;
  } catch (error) {
    console.error('Print error:', error);
  }
}

// Mở cash drawer
async function openCashDrawer() {
  try {
    const response = await fetch('http://localhost:3000/api/cash-drawer/open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const result = await response.json();
    console.log('Cash drawer result:', result);
    return result;
  } catch (error) {
    console.error('Cash drawer error:', error);
  }
}

// Sử dụng
const receiptText = `
CỬA HÀNG ABC
123 Đường XYZ, Quận 1, TP.HCM

HÓA ĐƠN BÁN HÀNG
Ngày: ${new Date().toLocaleDateString('vi-VN')}

--------------------------------
Sản phẩm 1          100.000đ
Sản phẩm 2          200.000đ
--------------------------------
TỔNG CỘNG:          300.000đ
TIỀN NHẬN:          300.000đ
TIỀN THỐI:          0đ

Cảm ơn quý khách!
`;

printReceipt(receiptText);
```

### jQuery

```javascript
// In hóa đơn
$.ajax({
  url: 'http://localhost:3000/api/print',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({
    text: receiptText,
    align: 'center'
  }),
  success: function(result) {
    console.log('Print success:', result);
  },
  error: function(error) {
    console.error('Print error:', error);
  }
});

// Mở cash drawer
$.ajax({
  url: 'http://localhost:3000/api/cash-drawer/open',
  method: 'POST',
  contentType: 'application/json',
  success: function(result) {
    console.log('Cash drawer opened:', result);
  },
  error: function(error) {
    console.error('Cash drawer error:', error);
  }
});
```

### Axios

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

// In hóa đơn
const printReceipt = async (text) => {
  try {
    const response = await axios.post(`${API_BASE}/api/print`, {
      text,
      align: 'center'
    });
    return response.data;
  } catch (error) {
    console.error('Print error:', error);
    throw error;
  }
};

// Mở cash drawer
const openCashDrawer = async () => {
  try {
    const response = await axios.post(`${API_BASE}/api/cash-drawer/open`);
    return response.data;
  } catch (error) {
    console.error('Cash drawer error:', error);
    throw error;
  }
};
```

## 🔒 Bảo mật

- Service chỉ chạy trên `localhost` để tránh truy cập từ bên ngoài
- Có thể thêm authentication nếu cần (token, API key)
- CORS được enable để POS web app có thể gọi API

## 🐛 Troubleshooting

### Printer không in được

1. Kiểm tra IP và Port của printer trong `.env`
2. Đảm bảo printer và máy tính cùng mạng (nếu dùng TCP/IP)
3. Kiểm tra printer có đang bật và sẵn sàng không
4. Xem logs trong console để biết lỗi chi tiết

### Cash drawer không mở được

1. Đảm bảo cash drawer được kết nối với printer
2. Kiểm tra cáp kết nối
3. Thử thay đổi pin number trong code (thường là pin 2)

### Kết nối USB không hoạt động

1. Đảm bảo driver printer đã được cài đặt
2. Thử thay đổi `PRINTER_INTERFACE` sang `usb` và cấu hình lại

## 📝 Ghi chú

- Service này chạy độc lập và có thể chạy như một Windows Service hoặc Linux daemon
- Để chạy tự động khi khởi động máy tính, có thể dùng:
  - **Windows**: NSSM (Non-Sucking Service Manager) hoặc node-windows
  - **Linux/Mac**: PM2 hoặc systemd
  - **Mac**: launchd

## 📄 License

MIT

