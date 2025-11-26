# 🔧 Hướng dẫn cài đặt Windows Service

## 📋 Tổng quan

Service sẽ được đăng ký như Windows Service và tự động khởi động cùng Windows.

## 🚀 Cài đặt Service

### Cách 1: Sử dụng script (Khuyến nghị)

1. **Right-click vào `install-service.bat`**
2. **Chọn "Run as administrator"**
3. Script sẽ tự động:
   - Tải NSSM nếu chưa có
   - Cài đặt service
   - Khởi động service

### Cách 2: Cài đặt thủ công

1. **Tải NSSM:**
   - Truy cập: https://nssm.cc/download
   - Tải bản Windows 64-bit
   - Giải nén và copy `nssm.exe` vào thư mục project

2. **Cài đặt service:**
   ```bash
   nssm.exe install PrinterCashDrawerService "D:\path\to\printer-service.exe"
   ```

3. **Cấu hình service:**
   ```bash
   nssm.exe set PrinterCashDrawerService AppDirectory "D:\path\to\dist"
   nssm.exe set PrinterCashDrawerService Start SERVICE_AUTO_START
   ```

4. **Khởi động service:**
   ```bash
   net start PrinterCashDrawerService
   ```

## 🛑 Gỡ cài đặt Service

1. **Right-click vào `uninstall-service.bat`**
2. **Chọn "Run as administrator"**
3. Service sẽ được dừng và gỡ bỏ

Hoặc thủ công:
```bash
net stop PrinterCashDrawerService
nssm.exe remove PrinterCashDrawerService confirm
```

## 📊 Quản lý Service

### Sử dụng Command Prompt (Admin)

**Khởi động:**
```bash
net start PrinterCashDrawerService
```

**Dừng:**
```bash
net stop PrinterCashDrawerService
```

**Kiểm tra trạng thái:**
```bash
sc query PrinterCashDrawerService
```

### Sử dụng Services.msc

1. Nhấn `Win + R`
2. Gõ `services.msc` và Enter
3. Tìm service **"PrinterCashDrawerService"**
4. Right-click để Start/Stop/Restart

## ⚙️ Cấu hình Service

### Thay đổi cấu hình

Sử dụng NSSM GUI:
```bash
nssm.exe edit PrinterCashDrawerService
```

Hoặc command line:
```bash
# Thay đổi working directory
nssm.exe set PrinterCashDrawerService AppDirectory "D:\new\path"

# Thay đổi startup type
nssm.exe set PrinterCashDrawerService Start SERVICE_AUTO_START
```

### Xem logs

Service logs được lưu tại:
- `dist\service.log` - Standard output
- `dist\service-error.log` - Error output

## 🔍 Troubleshooting

### Service không khởi động được

1. **Kiểm tra logs:**
   - Xem `dist\service.log`
   - Xem `dist\service-error.log`

2. **Kiểm tra config.js:**
   - Đảm bảo file `config.js` tồn tại trong thư mục service
   - Kiểm tra cấu hình IP và port

3. **Kiểm tra port:**
   - Port 3000 có thể đã bị chiếm
   - Thay đổi port trong `config.js`

4. **Kiểm tra quyền:**
   - Service cần quyền truy cập mạng
   - Kiểm tra Windows Firewall

### Service tự động restart

1. **Kiểm tra logs** để xem lỗi
2. **Kiểm tra kết nối printer:**
   ```bash
   ping 192.168.55.211
   ```

3. **Kiểm tra config.js** có đúng không

### Xem trạng thái chi tiết

```bash
sc query PrinterCashDrawerService
sc qc PrinterCashDrawerService
```

## 📝 Lưu ý

1. **Cần quyền Administrator** để cài đặt/gỡ service
2. **File config.js** phải cùng thư mục với executable
3. **Service tự động restart** nếu bị crash
4. **Logs** được lưu tự động trong thư mục service

## 🔗 Tài liệu tham khảo

- NSSM Documentation: https://nssm.cc/usage
- Windows Services: https://docs.microsoft.com/en-us/windows/win32/services/services

