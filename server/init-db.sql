-- Create tables for GlowHub cosmetics store

-- Users table with enhanced auth fields
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    device_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table with seller reference
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    seller_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    mpesa_checkout_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, email_verified) VALUES
('Admin User', 'admin@glowhub.com', '$2b$12$LQv3c1yqBwEHFl5L0GGkQOBYWxdnxIjpHOvYvuUxMNKOGYy.Kg9yG', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Get admin ID for products
DO $$
DECLARE
    admin_id INTEGER;
BEGIN
    SELECT id INTO admin_id FROM users WHERE email = 'admin@glowhub.com';
    
    -- Insert sample products
    INSERT INTO products (name, description, price, image_url, category, stock_quantity, seller_id) VALUES
    ('Glow Serum', 'Brightening vitamin C serum for radiant skin', 2500.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'Skincare', 25, admin_id),
    ('Hydrating Moisturizer', 'Deep hydration cream with hyaluronic acid', 1800.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', 'Skincare', 30, admin_id),
    ('Matte Lipstick', 'Long-lasting matte finish in rose pink', 1200.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400', 'Makeup', 40, admin_id),
    ('Eye Shadow Palette', '12-shade neutral eyeshadow palette', 3200.00, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', 'Makeup', 15, admin_id),
    ('Body Butter', 'Nourishing shea butter body cream', 1500.00, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'Body Care', 20, admin_id),
    ('Face Mask Set', 'Variety pack of 5 different face masks', 2800.00, 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400', 'Skincare', 12, admin_id),
    ('Perfume', 'Floral fragrance with notes of jasmine', 4500.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'Wellness', 8, admin_id),
    ('Nail Polish Set', 'Set of 6 trending nail colors', 1800.00, 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', 'Makeup', 25, admin_id)
    ON CONFLICT DO NOTHING;
END $$;