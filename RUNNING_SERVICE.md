# Hướng dẫn chạy service liên tục

Service đã được cải thiện để **chạy liên tục kể cả khi gặp lỗi kết nối printer**.

## 🛡️ Error Handling đã cải thiện

- ✅ **Socket cleanup**: Tất cả TCP socket đều được cleanup đúng cách, không bị memory leak
- ✅ **Uncaught exception handlers**: Service không bị crash khi có lỗi không mong đợi
- ✅ **Error responses**: Tất cả endpoints luôn trả về response, không bao giờ hang
- ✅ **Graceful error handling**: Lỗi được log và service tiếp tục phục vụ requests khác

## 🚀 Cách chạy service

### Option 1: Chạy trực tiếp (Development)

```bash
npm start
```

### Option 2: Dùng PM2 (Production - Khuyến nghị)

**Cài đặt PM2:**
```bash
npm install -g pm2
```

**Chạy service với PM2:**
```bash
npm run pm2:start
# hoặc
pm2 start ecosystem.config.js
```

**Các lệnh PM2 hữu ích:**
```bash
# Xem logs
npm run pm2:logs
# hoặc
pm2 logs printer-service

# Kiểm tra trạng thái
npm run pm2:status
# hoặc
pm2 status

# Restart service
npm run pm2:restart
# hoặc
pm2 restart printer-service

# Dừng service
npm run pm2:stop
# hoặc
pm2 stop printer-service

# Xem tất cả processes
pm2 list

# Xóa service khỏi PM2
pm2 delete printer-service
```

### Option 3: Dùng script

```bash
./scripts/start-service.sh
```

## 📋 Tính năng PM2

PM2 sẽ tự động:
- ✅ **Auto-restart** nếu service bị crash
- ✅ **Restart** nếu sử dụng quá nhiều RAM (>200MB)
- ✅ **Log rotation** tự động
- ✅ **Zero-downtime** restart
- ✅ Chạy service như **daemon** (background)

## 🔍 Kiểm tra service

Sau khi chạy, kiểm tra service:

```bash
# Health check
curl http://localhost:3000/health

# Kiểm tra printer status
curl http://localhost:3000/api/printer/status
```

## 🐛 Troubleshooting

### Service không chạy được

1. **Kiểm tra port đã bị sử dụng:**
   ```bash
   lsof -i :3000
   ```

2. **Kiểm tra logs:**
   ```bash
   # Nếu dùng PM2
   pm2 logs printer-service
   
   # Nếu chạy trực tiếp
   # Xem output trong terminal
   ```

3. **Kiểm tra printer có kết nối được không:**
   ```bash
   ping 192.168.55.211
   nc -zv 192.168.55.211 9100
   ```

### Service bị restart liên tục

- Kiểm tra logs để xem lỗi: `pm2 logs printer-service`
- Kiểm tra IP printer trong `.env` có đúng không
- Kiểm tra printer có bật và kết nối mạng không

### Lỗi kết nối printer không làm service crash

✅ **Đây là hành vi đúng!** Service sẽ:
- Log lỗi ra console
- Trả về error response cho client
- Tiếp tục chạy và phục vụ các requests khác

## 📝 Logs

Logs được lưu tại:
- **PM2 logs**: `./logs/pm2-*.log`
- **Console**: Nếu chạy trực tiếp với `npm start`

## ⚙️ Cấu hình PM2

File `ecosystem.config.js` chứa cấu hình:
- Auto-restart: ✅ Bật
- Max memory: 200MB
- Restart delay: 4 giây
- Min uptime: 10 giây

Có thể chỉnh sửa file này để thay đổi cấu hình.

