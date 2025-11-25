const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

class PrinterService {
  constructor() {
    // Cấu hình printer - có thể thay đổi theo loại máy in của bạn
    this.printerType = process.env.PRINTER_TYPE || 'epson'; // 'epson', 'star', 'thermal'
    // XPrinter thường sử dụng ESC/POS giống Epson, nên dùng 'epson'
    this.interface = process.env.PRINTER_INTERFACE || 'tcp'; // 'tcp', 'usb', 'serial'
    this.connectionParams = {
      ip: process.env.PRINTER_IP || '192.168.55.211',
      port: process.env.PRINTER_PORT || 9100,
      type: this.getPrinterType(),
    };
    
    this.printer = null;
    this.init();
  }

  getPrinterType() {
    const types = {
      'epson': PrinterTypes.EPSON,
      'star': PrinterTypes.STAR,
      'thermal': PrinterTypes.THERMAL,
    };
    return types[this.printerType.toLowerCase()] || PrinterTypes.EPSON;
  }

  init() {
    try {
      // Cấu hình cho XPrinter XP 80C hoặc các ESC/POS printer khác
      this.printer = new ThermalPrinter({
        type: this.getPrinterType(),
        interface: this.interface,
        options: {
          ip: this.connectionParams.ip,
          port: this.connectionParams.port,
          timeout: 3000, // Timeout 3 giây cho kết nối TCP/IP
        }
      });
      
      console.log(`✅ Printer initialized: ${this.printerType} via ${this.interface}`);
      console.log(`   IP: ${this.connectionParams.ip}:${this.connectionParams.port}`);
      console.log(`   XPrinter XP 80C ready!`);
    } catch (error) {
      console.error('❌ Failed to initialize printer:', error);
      console.error(`   Check IP: ${this.connectionParams.ip}:${this.connectionParams.port}`);
      throw error;
    }
  }

  async print(text, options = {}) {
    try {
      const {
        type = 'text',
        align = 'left',
        width = 48,
        encoding = 'utf8'
      } = options;

      if (!this.printer) {
        this.init();
      }

      // Clear printer buffer
      this.printer.clear();

      // Set alignment
      switch (align.toLowerCase()) {
        case 'center':
          this.printer.alignCenter();
          break;
        case 'right':
          this.printer.alignRight();
          break;
        default:
          this.printer.alignLeft();
      }

      // Print content based on type
      if (type === 'text' || type === 'html') {
        // Split text by lines and print
        const lines = text.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            this.printer.println(line);
          } else {
            this.printer.newLine();
          }
        });
      } else if (type === 'raw') {
        // For raw ESC/POS commands
        this.printer.raw(Buffer.from(text, encoding));
      }

      // Execute print
      await this.printer.execute();
      
      return { success: true };
    } catch (error) {
      console.error('Print execution error:', error);
      throw new Error(`Print failed: ${error.message}`);
    }
  }

  async openCashDrawer() {
    try {
      if (!this.printer) {
        this.init();
      }

      this.printer.clear();
      
      // Open cash drawer command (ESC/POS command)
      // Pin 2 = typically the cash drawer pin for XPrinter and most ESC/POS printers
      // XPrinter XP 80C sử dụng pin 2
      const drawerPin = process.env.CASH_DRAWER_PIN || 2;
      this.printer.cashdraw(parseInt(drawerPin));
      
      await this.printer.execute();
      
      return { success: true };
    } catch (error) {
      console.error('Cash drawer error:', error);
      throw new Error(`Failed to open cash drawer: ${error.message}`);
    }
  }

  async getStatus() {
    try {
      return {
        printerType: this.printerType,
        interface: this.interface,
        connectionParams: this.connectionParams,
        initialized: this.printer !== null,
      };
    } catch (error) {
      throw new Error(`Failed to get status: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new PrinterService();

