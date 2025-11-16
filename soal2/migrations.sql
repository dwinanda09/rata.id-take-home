-- Database Migration Scripts for E-commerce Schema

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_type ON user_addresses(type);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_is_active ON categories(is_active);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);

CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(is_primary);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_is_active ON product_variants(is_active);

CREATE INDEX idx_shopping_carts_user_id ON shopping_carts(user_id);
CREATE INDEX idx_shopping_carts_session_id ON shopping_carts(session_id);
CREATE INDEX idx_shopping_carts_created_at ON shopping_carts(created_at);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_expires_at ON coupons(expires_at);

CREATE INDEX idx_order_coupons_order_id ON order_coupons(order_id);
CREATE INDEX idx_order_coupons_coupon_id ON order_coupons(coupon_id);

CREATE INDEX idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(type);
CREATE INDEX idx_inventory_movements_created_at ON inventory_movements(created_at);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_product_reviews_is_approved ON product_reviews(is_approved);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_carts_updated_at BEFORE UPDATE ON shopping_carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets', 1),
('Clothing', 'clothing', 'Apparel and fashion items', 2),
('Home & Garden', 'home-garden', 'Home improvement and garden supplies', 3),
('Books', 'books', 'Books and educational materials', 4),
('Sports', 'sports', 'Sports equipment and accessories', 5);

-- Create subcategories
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Smartphones', 'smartphones', 'Mobile phones and accessories', 1, 1),
('Laptops', 'laptops', 'Laptop computers and accessories', 1, 2),
('Men Clothing', 'men-clothing', 'Clothing for men', 2, 1),
('Women Clothing', 'women-clothing', 'Clothing for women', 2, 2),
('Furniture', 'furniture', 'Home furniture items', 3, 1);

INSERT INTO payment_methods (name, type, processing_fee_percentage, processing_fee_fixed) VALUES
('Credit Card', 'credit_card', 0.0299, 0.30),
('PayPal', 'paypal', 0.0349, 0.49),
('Bank Transfer', 'bank_transfer', 0, 2.00),
('Cash on Delivery', 'cash_on_delivery', 0, 5.00);

-- Create a sample admin user
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES
('admin', 'admin@example.com', '$2b$10$example_hash_here', 'Admin', 'User', 'admin');

-- Create sample products
INSERT INTO products (name, slug, description, sku, price, inventory_quantity, is_featured) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced camera system', 'IP15-PRO-001', 999.99, 50, true),
('MacBook Pro 16"', 'macbook-pro-16', 'Professional laptop for developers and creators', 'MBP-16-001', 2399.99, 25, true),
('Wireless Headphones', 'wireless-headphones', 'Premium noise-canceling headphones', 'WH-001', 299.99, 100, false);

-- Link products to categories
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 6), -- iPhone to Smartphones
(2, 7), -- MacBook to Laptops
(3, 1); -- Headphones to Electronics

-- Add sample coupons
INSERT INTO coupons (code, name, type, value, minimum_amount, usage_limit, is_active, expires_at) VALUES
('WELCOME10', 'Welcome 10% Off', 'percentage', 10.00, 100.00, 1000, true, '2024-12-31 23:59:59'),
('FREESHIP', 'Free Shipping', 'free_shipping', 0, 50.00, NULL, true, '2024-12-31 23:59:59'),
('SAVE50', 'Save $50', 'fixed_amount', 50.00, 200.00, 500, true, '2024-12-31 23:59:59');