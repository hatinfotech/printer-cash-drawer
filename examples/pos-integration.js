/**
 * Printer Service Client - Tích hợp vào POS Web App
 * 
 * Copy file này vào project POS của bạn và import vào các component cần sử dụng
 */

class PrinterServiceClient {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Kiểm tra service có đang chạy không
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'ok';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Kiểm tra trạng thái printer
   */
  async getPrinterStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/printer/status`);
      const data = await response.json();
      return data.success ? data.status : null;
    } catch (error) {
      console.error('Get printer status failed:', error);
      throw error;
    }
  }

  /**
   * In hóa đơn
   * @param {string} text - Nội dung cần in
   * @param {object} options - Tùy chọn in (align, type, width, encoding)
   * @returns {Promise<object>}
   */
  async print(text, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/api/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          type: options.type || 'text',
          align: options.align || 'left',
          width: options.width || 48,
          encoding: options.encoding || 'utf8',
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || data.message || 'Print failed');
      }

      return data;
    } catch (error) {
      console.error('Print failed:', error);
      throw error;
    }
  }

  /**
   * Mở cash drawer
   * @returns {Promise<object>}
   */
  async openCashDrawer() {
    try {
      const response = await fetch(`${this.baseUrl}/api/cash-drawer/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || data.message || 'Failed to open cash drawer');
      }

      return data;
    } catch (error) {
      console.error('Open cash drawer failed:', error);
      throw error;
    }
  }

  /**
   * Tạo format hóa đơn từ object order
   * @param {object} order - Đối tượng đơn hàng
   * @returns {string} - Text đã format để in
   */
  formatReceipt(order) {
    const { store, items, total, payment, change, date, invoiceNumber } = order;
    
    const lines = [];
    
    // Header
    if (store.name) lines.push(store.name);
    if (store.address) lines.push(store.address);
    if (store.phone) lines.push(`Tel: ${store.phone}`);
    lines.push('');
    
    // Title
    lines.push('═══════════════════════════════');
    lines.push('          HÓA ĐƠN BÁN HÀNG');
    lines.push('═══════════════════════════════');
    
    // Info
    if (date) lines.push(`Ngày: ${new Date(date).toLocaleString('vi-VN')}`);
    if (invoiceNumber) lines.push(`Hóa đơn số: ${invoiceNumber}`);
    lines.push('');
    
    // Items header
    lines.push('───────────────────────────────');
    lines.push('STT  Tên sản phẩm      Số lượng  Thành tiền');
    lines.push('───────────────────────────────');
    
    // Items
    if (items && Array.isArray(items)) {
      items.forEach((item, index) => {
        const line = `${index + 1}    ${item.name || 'N/A'.padEnd(15)} ${String(item.quantity || 0).padStart(8)}  ${this.formatCurrency(item.price || 0)}`;
        lines.push(line);
      });
    }
    
    lines.push('───────────────────────────────');
    
    // Total
    if (total !== undefined) {
      lines.push(`TỔNG CỘNG:                       ${this.formatCurrency(total)}`);
    }
    
    // Payment
    if (payment !== undefined) {
      lines.push(`TIỀN NHẬN:                       ${this.formatCurrency(payment)}`);
    }
    
    if (change !== undefined) {
      lines.push(`TIỀN THỐI:                       ${this.formatCurrency(change)}`);
    }
    
    lines.push('');
    lines.push('═══════════════════════════════');
    lines.push('      Cảm ơn quý khách!');
    lines.push('═══════════════════════════════');
    
    return lines.join('\n');
  }

  /**
   * Format tiền tệ
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * In hóa đơn và mở cash drawer (combo)
   * @param {string|object} receipt - Text hoặc order object
   * @param {object} options - Options
   */
  async printReceiptAndOpenDrawer(receipt, options = {}) {
    try {
      // Format receipt nếu là object
      const receiptText = typeof receipt === 'object' 
        ? this.formatReceipt(receipt)
        : receipt;

      // Print
      await this.print(receiptText, {
        align: options.align || 'center',
        ...options
      });

      // Open drawer nếu được yêu cầu
      if (options.openDrawer !== false) {
        // Delay một chút để đảm bảo print command đã được gửi
        await new Promise(resolve => setTimeout(resolve, 500));
        await this.openCashDrawer();
      }

      return { success: true };
    } catch (error) {
      console.error('Print receipt and open drawer failed:', error);
      throw error;
    }
  }
}

// Export cho module system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrinterServiceClient;
}

// Export cho ES6 modules
if (typeof exports !== 'undefined') {
  exports.default = PrinterServiceClient;
  exports.PrinterServiceClient = PrinterServiceClient;
}

// Ví dụ sử dụng:

/*
// 1. Khởi tạo client
const printerClient = new PrinterServiceClient('http://localhost:3000');

// 2. Kiểm tra service
const isRunning = await printerClient.checkHealth();
console.log('Service is running:', isRunning);

// 3. In hóa đơn từ text
await printerClient.print(`
CỬA HÀNG ABC
HÓA ĐƠN BÁN HÀNG
...
`, { align: 'center' });

// 4. In hóa đơn từ order object
const order = {
  store: {
    name: 'CỬA HÀNG ABC',
    address: '123 Đường XYZ',
    phone: '0123456789'
  },
  invoiceNumber: 'HD001',
  date: new Date(),
  items: [
    { name: 'Sản phẩm A', quantity: 2, price: 100000 },
    { name: 'Sản phẩm B', quantity: 1, price: 100000 }
  ],
  total: 300000,
  payment: 300000,
  change: 0
};

await printerClient.printReceiptAndOpenDrawer(order);

// 5. Chỉ mở cash drawer
await printerClient.openCashDrawer();
*/

