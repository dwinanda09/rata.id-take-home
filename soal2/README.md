# Soal 2: Database Schema Design

## Overview
Complete database schema design for an e-commerce application supporting user management, product catalog, shopping cart, orders, and payment processing.

## Files
- `schema.sql` - Complete database schema with all tables and constraints
- `migrations.sql` - Migration scripts with indexes, triggers, and sample data
- `design-rationale.md` - Detailed explanation of design decisions
- `architecture.md` - Entity relationship diagram using Mermaid

## Database Features

### Core Entities
- **Users**: Customer and admin account management
- **Products**: Complete product catalog with variants and images
- **Categories**: Hierarchical product categorization
- **Shopping Cart**: Session and user-based cart functionality
- **Orders**: Complete order management with status tracking
- **Payments**: Multi-method payment processing
- **Reviews**: Product review and rating system

### Advanced Features
- Inventory tracking and movement history
- Coupon and discount system
- Multiple address management per user
- Product variant support (size, color, etc.)
- Historical data preservation for orders
- Comprehensive audit trails

## Setup Instructions

### PostgreSQL Setup
1. Create database:
   ```sql
   CREATE DATABASE ecommerce;
   ```

2. Run schema creation:
   ```bash
   psql -d ecommerce -f schema.sql
   ```

3. Run migrations and seed data:
   ```bash
   psql -d ecommerce -f migrations.sql
   ```

### Alternative Database Systems
The schema is designed primarily for PostgreSQL but can be adapted for:
- MySQL/MariaDB (modify SERIAL to AUTO_INCREMENT)
- SQLite (simplify constraints and indexes)
- SQL Server (adjust data types and syntax)

## Schema Highlights

### Performance Optimizations
- Strategic indexing on frequently queried columns
- Denormalized data in orders for faster reporting
- Efficient category hierarchy structure
- Separate tables for high-frequency operations

### Data Integrity
- Comprehensive foreign key constraints
- Check constraints for data validation
- Unique constraints preventing duplicates
- Trigger-based automatic timestamp updates

### Scalability Considerations
- Clear separation for potential database sharding
- Read replica friendly design
- Archive-ready structure for historical data
- Caching-optimized table relationships

## Business Logic Support
- Multi-tenant ready architecture
- Role-based access control
- Inventory reservation for cart items
- Flexible discount and coupon system
- Complete order lifecycle management
- Customer review and rating system