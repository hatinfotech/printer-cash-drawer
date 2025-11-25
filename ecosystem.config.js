// PM2 ecosystem file for printer-cash-drawer service
// Cài đặt PM2: npm install -g pm2
// Chạy service: pm2 start ecosystem.config.js
// Xem logs: pm2 logs printer-service
// Dừng service: pm2 stop printer-service
// Restart service: pm2 restart printer-service

module.exports = {
  apps: [{
    name: 'printer-service',
    script: 'index.js',
    instances: 1,
    autorestart: true, // Tự động restart khi crash
    watch: false, // Không watch files (để tránh restart liên tục khi develop)
    max_memory_restart: '200M', // Restart nếu sử dụng quá 200MB RAM
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true, // Thêm timestamp vào logs
    merge_logs: true,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Restart nếu process bị kill hoặc crash
    min_uptime: '10s', // Phải chạy ít nhất 10 giây mới được tính là stable
    max_restarts: 10, // Restart tối đa 10 lần trong thời gian window
    restart_delay: 4000, // Delay 4 giây trước khi restart
    // Không exit khi có uncaught exception (đã handle trong code)
    kill_timeout: 5000,
    listen_timeout: 3000,
    shutdown_with_message: true
  }]
};

