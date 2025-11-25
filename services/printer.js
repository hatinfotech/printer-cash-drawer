const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;
const net = require('net');

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

      console.log(`📝 Print request: ${text.substring(0, 50)}...`);

      // Build ESC/POS commands directly
      let printData = Buffer.alloc(0);

      // Initialize printer (ESC @)
      printData = Buffer.concat([printData, Buffer.from([0x1B, 0x40])]);

      // Set alignment
      switch (align.toLowerCase()) {
        case 'center':
          printData = Buffer.concat([printData, Buffer.from([0x1B, 0x61, 0x01])]); // ESC a 1
          break;
        case 'right':
          printData = Buffer.concat([printData, Buffer.from([0x1B, 0x61, 0x02])]); // ESC a 2
          break;
        default:
          printData = Buffer.concat([printData, Buffer.from([0x1B, 0x61, 0x00])]); // ESC a 0
      }

      // Print content
      if (type === 'text' || type === 'html') {
        const lines = text.split('\n');
        lines.forEach(line => {
          // Use ASCII encoding for better compatibility with XPrinter
          const lineBuffer = Buffer.from(line + '\n', 'ascii');
          printData = Buffer.concat([printData, lineBuffer]);
        });
      } else if (type === 'raw') {
        printData = Buffer.concat([printData, Buffer.from(text, encoding)]);
      }

      // Add line feed and cut paper (GS V 0)
      printData = Buffer.concat([printData, Buffer.from([0x0A])]); // Line feed
      printData = Buffer.concat([printData, Buffer.from([0x1D, 0x56, 0x00])]); // Cut paper

      console.log(`📤 Sending ${printData.length} bytes to printer...`);

      // Send directly via TCP socket
      return new Promise((resolve, reject) => {
        const client = new net.Socket();
        
        client.setTimeout(5000);
        
        client.on('connect', () => {
          console.log(`✅ Connected to printer for printing`);
          client.write(printData, (err) => {
            if (err) {
              console.error('❌ Write error:', err);
              reject(new Error(`Failed to write data: ${err.message}`));
            } else {
              console.log(`✅ Data written, waiting before close...`);
              // Wait a bit to ensure data is sent before closing
              setTimeout(() => {
                client.end();
              }, 200);
            }
          });
        });
        
        client.on('close', () => {
          console.log(`✅ Print data sent successfully`);
          resolve({ success: true });
        });
        
        client.on('error', (error) => {
          console.error('❌ Print connection error:', error);
          reject(new Error(`Failed to print: ${error.message}`));
        });
        
        client.on('timeout', () => {
          console.error('❌ Print connection timeout');
          client.destroy();
          reject(new Error('Connection timeout'));
        });
        
        // Connect to printer
        client.connect(
          this.connectionParams.port,
          this.connectionParams.ip,
          () => {
            // Connection established
          }
        );
      });
    } catch (error) {
      console.error('❌ Print execution error:', error);
      throw new Error(`Print failed: ${error.message}`);
    }
  }

  async openCashDrawer() {
    try {
      const drawerPin = parseInt(process.env.CASH_DRAWER_PIN || 2);
      const m = drawerPin === 2 ? 0 : 1; // 0 for pin 2, 1 for pin 5
      
      console.log(`💰 Opening cash drawer (pin ${drawerPin})...`);
      
      // Raw ESC/POS command: ESC p m t1 t2
      // ESC p = 0x1B 0x70
      // m = pin selection (0 = pin 2, 1 = pin 5)
      // t1 = 25ms = 0x19
      // t2 = 250ms = 0xFA
      const cashDrawerCommand = Buffer.from([
        0x1B, 0x70, // ESC p
        m,          // pin selection (0 = pin 2, 1 = pin 5)
        0x19,       // t1 = 25ms
        0xFA        // t2 = 250ms
      ]);
      
      console.log(`📤 Sending cash drawer command: ${cashDrawerCommand.toString('hex')}`);
      
      // Send command directly via TCP socket
      return new Promise((resolve, reject) => {
        const client = new net.Socket();
        
        client.setTimeout(5000);
        
        client.on('connect', () => {
          console.log(`✅ Connected to printer for cash drawer`);
          client.write(cashDrawerCommand, (err) => {
            if (err) {
              console.error('❌ Write error:', err);
              reject(new Error(`Failed to write cash drawer command: ${err.message}`));
            } else {
              console.log(`✅ Cash drawer command written, waiting before close...`);
              // Wait a bit before closing to ensure command is sent
              setTimeout(() => {
                client.end();
              }, 200);
            }
          });
        });
        
        client.on('close', () => {
          console.log(`✅ Cash drawer command sent (pin ${drawerPin})`);
          resolve({ success: true });
        });
        
        client.on('error', (error) => {
          console.error('❌ Cash drawer connection error:', error);
          reject(new Error(`Failed to open cash drawer: ${error.message}`));
        });
        
        client.on('timeout', () => {
          console.error('❌ Cash drawer connection timeout');
          client.destroy();
          reject(new Error('Connection timeout'));
        });
        
        // Connect to printer
        client.connect(
          this.connectionParams.port,
          this.connectionParams.ip,
          () => {
            // Connection established
          }
        );
      });
    } catch (error) {
      console.error('❌ Cash drawer error:', error);
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

