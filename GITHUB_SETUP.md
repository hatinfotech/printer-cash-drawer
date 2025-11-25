# Hướng dẫn đẩy project lên GitHub

## Bước 1: Tạo repository trên GitHub

1. Đăng nhập vào [GitHub](https://github.com)
2. Click vào dấu **+** ở góc trên bên phải, chọn **New repository**
3. Điền thông tin:
   - **Repository name**: `printer-cash-drawer` (hoặc tên bạn muốn)
   - **Description**: `Service adapter for POS web app to print receipts and open cash drawer`
   - **Visibility**: Chọn Public hoặc Private
   - **KHÔNG** check "Initialize this repository with a README" (vì đã có code sẵn)
4. Click **Create repository**

## Bước 2: Kết nối local repository với GitHub

Sau khi tạo repository trên GitHub, bạn sẽ nhận được URL. Sử dụng một trong các lệnh sau:

### Nếu dùng HTTPS:
```bash
git remote add origin https://github.com/YOUR_USERNAME/printer-cash-drawer.git
```

### Nếu dùng SSH:
```bash
git remote add origin git@github.com:YOUR_USERNAME/printer-cash-drawer.git
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn.**

## Bước 3: Push code lên GitHub

```bash
git branch -M main
git push -u origin main
```

Nếu bạn dùng HTTPS, GitHub sẽ yêu cầu nhập username và password (hoặc Personal Access Token).

## Lưu ý

- Nếu repository trên GitHub đã có file (như README), bạn có thể cần pull trước:
  ```bash
  git pull origin main --allow-unrelated-histories
  ```
  Sau đó giải quyết conflict (nếu có) và push lại.

- Để kiểm tra remote đã được thêm chưa:
  ```bash
  git remote -v
  ```

