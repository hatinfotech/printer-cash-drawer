// File cấu hình ví dụ
// Sao chép file này thành config.js và chỉnh sửa theo cấu hình của bạn

module.exports = {
  // Loại printer: 'epson', 'star', 'thermal'
  // XPrinter XP 80C sử dụng ESC/POS giống Epson, nên dùng 'epson'
  printerType: 'epson',
  
  // Cách kết nối: 'tcp' (network), 'usb', 'serial'
  interface: 'tcp',
  
  // Cấu hình cho TCP/IP printer
  printer: {
    ip: '192.168.55.211',
    port: 9100
  },
  
  // Port của service
  port: 3000,
  
  // Cấu hình cash drawer pin (thường là 2)
  cashDrawerPin: 2
};

