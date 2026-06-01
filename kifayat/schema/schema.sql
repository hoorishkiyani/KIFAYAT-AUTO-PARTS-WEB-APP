-- =============================================
-- Kifayat Auto Parts — Database Schema
-- Run this file in MySQL to set up the database
-- =============================================

CREATE DATABASE IF NOT EXISTS kifayat_db;
USE kifayat_db;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) DEFAULT '🔩',
    description TEXT
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
    icon VARCHAR(10) DEFAULT '🔩',
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(30),
    status ENUM('Pending', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    placed_on DATE NOT NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    sent_at DATETIME NOT NULL
);

-- =============================================
-- SAMPLE DATA
-- =============================================

INSERT INTO categories (name, icon, description) VALUES
('Engine Parts', '🔩', 'Oil filters, spark plugs, belts & more'),
('Suspension',   '🚗', 'Shocks, springs, and chassis components'),
('Brakes',       '🔴', 'Brake pads, discs, fluids & accessories'),
('Lighting',     '💡', 'Headlights, tail lights, and LEDs'),
('Electrical',   '⚡', 'Batteries, alternators, starters & wiring'),
('Tires & Wheels','🛞','Tyres, rims, and wheel accessories'),
('Paint & Spray', '🎨', 'Body sprays and finishing products'),
('Cooling',      '❄️', 'Radiators, coolant, fans & hoses');

INSERT INTO products (name, description, price, stock_status, icon, category_id) VALUES
('Oil Filter Premium',      'High-performance oil filter for extended engine life.',        850.00, 'In Stock',   '🔩', 1),
('Spark Plug Set (4x)',     'NGK-compatible spark plugs for smooth ignition.',             2200.00, 'In Stock',   '🔩', 1),
('Timing Belt Kit',         'Complete timing belt replacement kit.',                        3200.00, 'In Stock',   '🔩', 1),
('Air Filter',              'High-flow air filter for better engine breathing.',            1200.00, 'In Stock',   '🔩', 1),
('Shock Absorber Front',    'OEM-grade front shock absorber, fits most sedans.',           4500.00, 'In Stock',   '🚗', 2),
('Coil Spring Set',         'Pair of replacement coil springs for smoother ride.',         3800.00, 'Low Stock',  '🚗', 2),
('Brake Pad Set',           'Premium semi-metallic brake pads for reliable stopping.',     3500.00, 'In Stock',   '🔴', 3),
('Brake Disc Rotor',        'Vented brake rotor for superior heat dissipation.',           2800.00, 'In Stock',   '🔴', 3),
('Brake Fluid DOT4 1L',     'High-boiling-point brake fluid, 1 litre bottle.',             900.00, 'In Stock',   '🔴', 3),
('LED Headlight Bulb Pair', 'Bright white LED replacement bulbs, H4 pair pack.',          1500.00, 'In Stock',   '💡', 4),
('Tail Light Assembly',     'Direct-fit tail light replacement with indicators.',          2200.00, 'Low Stock',  '💡', 4),
('DRL Strip Light',         'Flexible daytime running light strip, 12V.',                  800.00, 'In Stock',   '💡', 4),
('Car Battery 65Ah',        'Maintenance-free 65Ah battery with 18-month warranty.',       8500.00, 'In Stock',   '⚡', 5),
('Alternator',              'Remanufactured alternator, 90A output.',                      6200.00, 'Low Stock',  '⚡', 5),
('Alloy Wheel Cover 15"',   'Universal alloy-look wheel cover, set of 4.',                1200.00, 'In Stock',   '🛞', 6),
('Tyre Pressure Gauge',     'Digital tyre pressure gauge with LED display.',               650.00, 'In Stock',   '🛞', 6),
('Body Spray Paint Black',  'Fast-dry matte black body spray, 400ml.',                     650.00, 'Low Stock',  '🎨', 7),
('Body Spray Paint White',  'Gloss white body spray, 400ml.',                              650.00, 'In Stock',   '🎨', 7),
('Radiator',                'Aluminium-core radiator for standard sedans.',                5500.00, 'In Stock',   '❄️', 8),
('Coolant 1L',              'OAT-formula engine coolant, concentrated 1 litre.',           750.00, 'In Stock',   '❄️', 8);

INSERT INTO orders (order_code, customer_name, customer_phone, status, placed_on) VALUES
('KAP-2026-001', 'Ahmed Raza',    '+92 300 1234567', 'Delivered',  '2026-05-15'),
('KAP-2026-002', 'Sara Khan',     '+92 321 9876543', 'In Transit', '2026-05-10'),
('KAP-2026-003', 'Bilal Hussain', '+92 333 5551234', 'Delivered',  '2026-05-05');

INSERT INTO order_items (order_id, product_name, qty, unit_price) VALUES
(1, 'Oil Filter Premium', 2, 850.00),
(2, 'Brake Pad Set',      1, 3500.00),
(2, 'Spark Plug Set (4x)',1, 2200.00),
(3, 'Air Filter',         1, 1200.00);
