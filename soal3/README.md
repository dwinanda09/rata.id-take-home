# Soal 3: Object-Oriented Programming (Banking System)

## Overview
Complete banking system implementation demonstrating all four fundamental Object-Oriented Programming principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.

## Files
- `banking-system.ts` - Main implementation with all classes and interfaces
- `oop-principles.md` - Detailed explanation of OOP principles with examples
- `architecture.md` - Class diagram and architecture overview
- `package.json` - Project dependencies and scripts

## Features

### Account Management
- **Abstract Account Base Class** - Defines common interface and behavior
- **CheckingAccount** - Supports overdraft with configurable limits
- **SavingsAccount** - Enforces minimum balance and applies interest
- **Transaction History** - Complete audit trail for all operations

### Banking Operations
- Deposit and withdrawal with validation
- Inter-account transfers
- Overdraft protection for checking accounts
- Interest calculation for savings accounts
- Monthly maintenance processing

### Customer Management
- Customer profiles with personal information
- Multiple account ownership
- Address management
- Total balance calculation across accounts

## OOP Principles Demonstrated

### 1. Encapsulation
- Private and protected member variables
- Controlled access through public methods
- Data validation within class methods
- Transaction history protection

### 2. Inheritance
- Account base class with common functionality
- CheckingAccount and SavingsAccount derived classes
- Method inheritance and overriding
- Protected members accessible to subclasses

### 3. Polymorphism
- Abstract methods implemented differently in each account type
- Runtime method resolution based on object type
- Transfer operations work with any account type
- Bank processes all accounts uniformly

### 4. Abstraction
- Abstract Account class defining interface contracts
- Complex transaction logging hidden from users
- Simple public interfaces for complex operations
- Interface definitions for type contracts

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the demonstration:
   ```bash
   npm run demo
   ```

3. Build TypeScript:
   ```bash
   npm run build
   ```

4. Run compiled JavaScript:
   ```bash
   npm start
   ```

## Example Usage

```typescript
// Create bank and customer
const bank = new Bank("First National Bank");
const customer = new Customer("John", "Doe", "john@email.com", "555-1234", address);

// Create accounts
const checking = bank.createCheckingAccount(customer.getFullName(), 1000, 500);
const savings = bank.createSavingsAccount(customer.getFullName(), 5000, 0.025);

// Banking operations
checking.deposit(500);
savings.withdraw(200);
checking.transfer(savings, 300);
savings.applyInterest();
```

## Key Classes

### Account (Abstract)
Base class defining common account behavior and enforcing implementation contracts.

### CheckingAccount
- Overdraft capability with configurable limits
- No minimum balance requirements
- Flexible withdrawal rules

### SavingsAccount
- Interest earning capability
- Minimum balance enforcement
- Restricted withdrawal rules

### Bank
- Account factory and management
- Monthly maintenance processing
- Account lookup and reporting

### Customer
- Personal information management
- Multiple account ownership
- Balance aggregation across accounts

## Advanced Features
- Unique ID generation for accounts and transactions
- Comprehensive transaction logging
- Type-safe interfaces and error handling
- Extensible design for new account types