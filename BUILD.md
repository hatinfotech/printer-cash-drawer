# 🔨 Hướng dẫn Build Executable

## 📦 Build thành file .exe (không cần Node.js)

### Cách 1: Sử dụng script (Dễ nhất)

**Double-click vào file:** `build.bat`

Script sẽ tự động:
- Kiểm tra Node.js
- Cài đặt dependencies nếu cần
- Build file executable
- Tạo file `dist/printer-service.exe`

### Cách 2: Sử dụng npm command

```bash
npm run build
```

File sẽ được tạo tại: `dist/printer-service.exe`

### Cách 3: Build cho nhiều platform

```bash
npm run build:all
```

Sẽ tạo executable cho:
- Windows (x64)
- Linux (x64)
- macOS (x64)

## 🚀 Sử dụng file .exe

### Chạy service

1. **Copy file `printer-service.exe`** đến thư mục bạn muốn
2. **Copy file `config.js`** (hoặc tạo mới từ `config.example.js`)
3. **Double-click `printer-service.exe`** để chạy

**Lưu ý:** File `config.js` phải cùng thư mục với `printer-service.exe`

### Cấu hình

Tạo file `config.js` trong cùng thư mục với `printer-service.exe`:

```javascript
module.exports = {
  printerType: 'epson',
  interface: 'tcp',
  printer: {
    ip: '192.168.55.211',
    port: 9100
  },
  port: 3000,
  cashDrawerPin: 2
};
```

## 📋 Yêu cầu để build

- Node.js >= 14.x (chỉ cần khi build, không cần khi chạy .exe)
- npm hoặc yarn

## ⚠️ Lưu ý

1. **File .exe sẽ lớn** (~50-100MB) vì đã bao gồm Node.js runtime
2. **Cần file config.js** cùng thư mục với .exe
3. **Không cần cài Node.js** trên máy chạy .exe
4. **Antivirus có thể cảnh báo** - đây là false positive, có thể bỏ qua

## 🔧 Troubleshooting

### Build bị lỗi

1. Đảm bảo đã cài đặt tất cả dependencies:
   ```bash
   npm install
   ```

2. Kiểm tra Node.js version:
   ```bash
   node --version
   ```

3. Thử build lại:
   ```bash
   npm run build
   ```

### File .exe không chạy được

1. Kiểm tra file `config.js` có tồn tại không
2. Chạy từ Command Prompt để xem lỗi:
   ```bash
   printer-service.exe
   ```
3. Kiểm tra port 3000 có bị chiếm không

## 📝 Ghi chú

- File .exe được build bằng [pkg](https://github.com/vercel/pkg)
- Chỉ build cho Windows x64 (có thể thay đổi trong package.json)
- Để build cho platform khác, sửa `--targets` trong package.json

