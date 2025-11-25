const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const printerService = require('./services/printer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'printer-cash-drawer-service',
    timestamp: new Date().toISOString()
  });
});

// Print receipt endpoint
app.post('/api/print', async (req, res) => {
  try {
    const { 
      text, 
      type = 'text', 
      align = 'left',
      width = 48,
      encoding = 'utf8'
    } = req.body;

    if (!text && type === 'text') {
      return res.status(400).json({ 
        error: 'Text content is required for text printing' 
      });
    }

    await printerService.print(text, { type, align, width, encoding });
    
    res.json({ 
      success: true, 
      message: 'Print job sent successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Print error:', error);
    res.status(500).json({ 
      error: 'Failed to print', 
      message: error.message 
    });
  }
});

// Open cash drawer endpoint
app.post('/api/cash-drawer/open', async (req, res) => {
  try {
    await printerService.openCashDrawer();
    
    res.json({ 
      success: true, 
      message: 'Cash drawer opened successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cash drawer error:', error);
    res.status(500).json({ 
      error: 'Failed to open cash drawer', 
      message: error.message 
    });
  }
});

// Get printer status
app.get('/api/printer/status', async (req, res) => {
  try {
    const status = await printerService.getStatus();
    res.json({ 
      success: true, 
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ 
      error: 'Failed to get printer status', 
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, 'localhost', () => {
  console.log(`\n🚀 Printer & Cash Drawer Service running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🖨️  Print endpoint: POST http://localhost:${PORT}/api/print`);
  console.log(`💰 Cash drawer endpoint: POST http://localhost:${PORT}/api/cash-drawer/open\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

