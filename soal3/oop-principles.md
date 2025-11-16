# Object-Oriented Programming Principles in Banking System

## Overview
This banking system implementation demonstrates the four fundamental principles of Object-Oriented Programming: Encapsulation, Inheritance, Polymorphism, and Abstraction.

## 1. Encapsulation

### Definition
Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), and restricting access to some of the object's components.

### Implementation Examples

#### Private and Protected Members
```typescript
abstract class Account {
    protected accountNumber: string;  // Protected - accessible by subclasses
    protected accountHolder: string;
    protected balance: number;
    private transactions: Transaction[] = [];  // Private - internal use only
}
```

#### Controlled Access through Methods
- **Getters**: Provide read-only access to private data
- **Setters**: Provide controlled modification of private data
- **Business Logic**: Methods encapsulate complex operations

#### Benefits in Banking System
- Account balance cannot be directly modified from outside
- Transaction history is protected from external tampering
- Account numbers are generated internally and cannot be changed
- Validation logic is centralized within methods

## 2. Inheritance

### Definition
Inheritance allows classes to inherit properties and methods from parent classes, promoting code reuse and establishing hierarchical relationships.

### Implementation Examples

#### Base Class (Parent)
```typescript
abstract class Account {
    // Common properties and methods for all account types
    protected balance: number;
    deposit(amount: number): boolean { ... }
    abstract withdraw(amount: number): boolean;  // Must be implemented by children
}
```

#### Derived Classes (Children)
```typescript
class CheckingAccount extends Account {
    private overdraftLimit: number;
    // Inherits: balance, deposit(), getBalance(), etc.
    // Must implement: withdraw()
}

class SavingsAccount extends Account {
    private interestRate: number;
    // Inherits: balance, deposit(), getBalance(), etc.
    // Must implement: withdraw()
    // Additional method: applyInterest()
}
```

#### Benefits in Banking System
- Common account functionality is defined once
- Account-specific behavior is implemented in derived classes
- New account types can be easily added
- Maintenance and updates are centralized

## 3. Polymorphism

### Definition
Polymorphism allows objects of different types to be treated as instances of the same type through a common interface, enabling the same interface to be used for different underlying forms.

### Implementation Examples

#### Method Overriding
```typescript
// Different withdrawal rules for different account types
class CheckingAccount extends Account {
    withdraw(amount: number): boolean {
        // Allows overdraft up to limit
        const availableBalance = this.balance + this.overdraftLimit;
        // ... implementation
    }
}

class SavingsAccount extends Account {
    withdraw(amount: number): boolean {
        // Requires minimum balance maintenance
        if (this.balance - amount < this.minimumBalance) {
            // ... prevent withdrawal
        }
    }
}
```

#### Runtime Polymorphism
```typescript
// Same method call works for different account types
function processWithdrawal(account: Account, amount: number) {
    return account.withdraw(amount);  // Calls appropriate implementation
}

// Works with any account type
processWithdrawal(checkingAccount, 100);  // Uses CheckingAccount.withdraw()
processWithdrawal(savingsAccount, 100);   // Uses SavingsAccount.withdraw()
```

#### Benefits in Banking System
- Transfer method works between any account types
- Bank maintenance processes all accounts uniformly
- New account types integrate seamlessly
- Client code doesn't need to know specific account types

## 4. Abstraction

### Definition
Abstraction hides complex implementation details while exposing only the necessary functionality through simplified interfaces.

### Implementation Examples

#### Abstract Classes
```typescript
abstract class Account {
    // Abstract methods must be implemented by concrete classes
    abstract getAccountType(): string;
    abstract withdraw(amount: number): boolean;

    // Concrete methods provide common functionality
    deposit(amount: number): boolean { ... }
}
```

#### Interface Contracts
```typescript
interface CustomerProfile {
    customerId: string;
    firstName: string;
    lastName: string;
    // Defines contract without implementation
}
```

#### Benefits in Banking System
- Users interact with simple, clean interfaces
- Complex transaction logging is hidden
- Account number generation is abstracted
- Implementation details can change without affecting clients

## Advanced OOP Concepts Demonstrated

### 1. Composition
- Bank class contains multiple Account instances
- Customer class contains Account references and Address object
- Transaction objects are composed within Account classes

### 2. Interface Segregation
- CustomerProfile interface defines customer contract
- Address interface defines address structure
- Focused, specific interfaces rather than monolithic ones

### 3. Dependency Inversion
- High-level Bank class depends on Account abstraction
- Transfer operations work with Account interface
- Implementation details are isolated in concrete classes

## Real-World Benefits

### Maintainability
- Changes to one account type don't affect others
- Bug fixes in base class benefit all account types
- New features can be added incrementally

### Extensibility
- New account types (BusinessAccount, StudentAccount) can be added easily
- Additional banking services can be integrated
- System can grow without breaking existing code

### Testability
- Each class can be tested independently
- Mock objects can replace dependencies
- Unit tests focus on specific behaviors

### Team Development
- Different developers can work on different account types
- Clear interfaces define contracts between components
- Code review focuses on specific responsibilities

This banking system serves as a practical example of how OOP principles create maintainable, extensible, and robust software systems.