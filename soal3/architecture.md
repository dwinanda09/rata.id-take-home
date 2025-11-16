# Banking System Architecture

```mermaid
classDiagram
    class Account {
        <<abstract>>
        #string accountNumber
        #string accountHolder
        #number balance
        #Transaction[] transactions
        +constructor(accountNumber, accountHolder, initialBalance)
        +deposit(amount) boolean
        +getBalance() number
        +getAccountNumber() string
        +getAccountHolder() string
        +getTransactionHistory() Transaction[]
        +transfer(targetAccount, amount) boolean
        +getAccountType()* string
        +withdraw(amount)* boolean
        #recordTransaction(type, amount, balanceAfter)
        #generateTransactionId() string
    }

    class CheckingAccount {
        -number overdraftLimit
        +constructor(accountNumber, accountHolder, initialBalance, overdraftLimit)
        +getAccountType() string
        +withdraw(amount) boolean
        +getOverdraftLimit() number
        +setOverdraftLimit(newLimit)
        +getAvailableBalance() number
    }

    class SavingsAccount {
        -number interestRate
        -number minimumBalance
        +constructor(accountNumber, accountHolder, initialBalance, interestRate, minimumBalance)
        +getAccountType() string
        +withdraw(amount) boolean
        +applyInterest()
        +getInterestRate() number
        +getMinimumBalance() number
    }

    class Transaction {
        +readonly string id
        +readonly string type
        +readonly number amount
        +readonly number balanceAfter
        +readonly Date timestamp
        +constructor(id, type, amount, balanceAfter, timestamp)
        +toString() string
    }

    class Bank {
        -Map~string,Account~ accounts
        -string bankName
        +constructor(bankName)
        +createCheckingAccount(accountHolder, initialBalance, overdraftLimit) CheckingAccount
        +createSavingsAccount(accountHolder, initialBalance, interestRate) SavingsAccount
        +getAccount(accountNumber) Account
        +processMonthlyMaintenance()
        +getBankName() string
        +getTotalAccounts() number
        +getAllAccounts() Account[]
        -generateAccountNumber() string
    }

    class Customer {
        +string customerId
        +string firstName
        +string lastName
        +string email
        +string phone
        +Address address
        +Account[] accounts
        +constructor(firstName, lastName, email, phone, address)
        +addAccount(account)
        +getFullName() string
        +getTotalBalance() number
        -generateCustomerId() string
    }

    class Address {
        +string street
        +string city
        +string state
        +string zipCode
        +string country
    }

    class CustomerProfile {
        <<interface>>
        +string customerId
        +string firstName
        +string lastName
        +string email
        +string phone
        +Address address
        +Account[] accounts
    }

    Account <|-- CheckingAccount : inherits
    Account <|-- SavingsAccount : inherits
    Account "1" *-- "*" Transaction : contains
    Bank "1" *-- "*" Account : manages
    Customer "1" *-- "*" Account : owns
    Customer "1" *-- "1" Address : has
    Customer ..|> CustomerProfile : implements

    note for Account "Abstract base class\nDefines common behavior\nEnforces implementation contracts"
    note for CheckingAccount "Allows overdraft\nNo minimum balance\nFlexible withdrawals"
    note for SavingsAccount "Minimum balance required\nEarns interest\nRestricted withdrawals"
    note for Bank "Factory for accounts\nManages all accounts\nProcesses maintenance"
```

## Architecture Overview

This banking system architecture demonstrates key Object-Oriented Programming principles:

### Inheritance Hierarchy
- **Account (Abstract)**: Base class defining common interface
- **CheckingAccount**: Concrete implementation with overdraft capability
- **SavingsAccount**: Concrete implementation with interest and minimum balance

### Composition Relationships
- **Bank** contains multiple **Account** instances
- **Customer** has **Account** references and an **Address**
- **Account** contains **Transaction** history

### Interface Implementation
- **Customer** implements **CustomerProfile** interface
- Provides contract for customer data structure

### Key Design Patterns

#### Factory Pattern
- Bank class creates account instances
- Ensures proper initialization and registration

#### Template Method Pattern
- Account class defines transaction recording template
- Subclasses implement specific withdrawal logic

#### Encapsulation
- Private fields protected from external access
- Public methods provide controlled interface
- Protected methods allow subclass access

This architecture supports extensibility, maintainability, and demonstrates professional OOP design practices.