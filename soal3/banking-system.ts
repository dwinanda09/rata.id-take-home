// Banking System Implementation using OOP Principles

// Abstract base class demonstrating inheritance and polymorphism
abstract class Account {
    protected accountNumber: string;
    protected accountHolder: string;
    protected balance: number;
    protected transactions: Transaction[] = [];

    constructor(accountNumber: string, accountHolder: string, initialBalance: number = 0) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = initialBalance;
    }

    // Abstract method to be implemented by derived classes
    abstract getAccountType(): string;

    // Abstract method with different behavior in derived classes
    abstract withdraw(amount: number): boolean;

    // Common method for all account types
    deposit(amount: number): boolean {
        if (amount <= 0) {
            throw new Error("Deposit amount must be positive");
        }

        this.balance += amount;
        this.recordTransaction("deposit", amount, this.balance);
        return true;
    }

    // Protected method for internal use
    protected recordTransaction(type: string, amount: number, balanceAfter: number): void {
        const transaction = new Transaction(
            this.generateTransactionId(),
            type,
            amount,
            balanceAfter,
            new Date()
        );
        this.transactions.push(transaction);
    }

    protected generateTransactionId(): string {
        return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Public getters demonstrating encapsulation
    getBalance(): number {
        return this.balance;
    }

    getAccountNumber(): string {
        return this.accountNumber;
    }

    getAccountHolder(): string {
        return this.accountHolder;
    }

    getTransactionHistory(): Transaction[] {
        return [...this.transactions]; // Return copy to prevent external modification
    }

    // Transfer method that works with any account type
    transfer(targetAccount: Account, amount: number): boolean {
        if (amount <= 0) {
            throw new Error("Transfer amount must be positive");
        }

        if (this.withdraw(amount)) {
            targetAccount.deposit(amount);
            this.recordTransaction("transfer_out", amount, this.balance);
            targetAccount.recordTransaction("transfer_in", amount, targetAccount.getBalance());
            return true;
        }
        return false;
    }
}

// Checking Account implementation
class CheckingAccount extends Account {
    private overdraftLimit: number;

    constructor(accountNumber: string, accountHolder: string, initialBalance: number = 0, overdraftLimit: number = 500) {
        super(accountNumber, accountHolder, initialBalance);
        this.overdraftLimit = overdraftLimit;
    }

    getAccountType(): string {
        return "Checking";
    }

    // Override withdraw method with overdraft capability
    withdraw(amount: number): boolean {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }

        const availableBalance = this.balance + this.overdraftLimit;
        if (amount > availableBalance) {
            console.log(`Insufficient funds. Available balance: $${availableBalance}`);
            return false;
        }

        this.balance -= amount;
        this.recordTransaction("withdrawal", amount, this.balance);
        return true;
    }

    getOverdraftLimit(): number {
        return this.overdraftLimit;
    }

    setOverdraftLimit(newLimit: number): void {
        if (newLimit < 0) {
            throw new Error("Overdraft limit cannot be negative");
        }
        this.overdraftLimit = newLimit;
    }

    getAvailableBalance(): number {
        return this.balance + this.overdraftLimit;
    }
}

// Savings Account implementation
class SavingsAccount extends Account {
    private interestRate: number;
    private minimumBalance: number;

    constructor(accountNumber: string, accountHolder: string, initialBalance: number = 0, interestRate: number = 0.02, minimumBalance: number = 100) {
        super(accountNumber, accountHolder, initialBalance);
        this.interestRate = interestRate;
        this.minimumBalance = minimumBalance;
    }

    getAccountType(): string {
        return "Savings";
    }

    // Override withdraw method with minimum balance restriction
    withdraw(amount: number): boolean {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be positive");
        }

        if (this.balance - amount < this.minimumBalance) {
            console.log(`Cannot withdraw. Minimum balance of $${this.minimumBalance} must be maintained`);
            return false;
        }

        this.balance -= amount;
        this.recordTransaction("withdrawal", amount, this.balance);
        return true;
    }

    // Apply monthly interest
    applyInterest(): void {
        const interest = this.balance * (this.interestRate / 12);
        this.balance += interest;
        this.recordTransaction("interest", interest, this.balance);
    }

    getInterestRate(): number {
        return this.interestRate;
    }

    getMinimumBalance(): number {
        return this.minimumBalance;
    }
}

// Transaction class for recording all account activities
class Transaction {
    public readonly id: string;
    public readonly type: string;
    public readonly amount: number;
    public readonly balanceAfter: number;
    public readonly timestamp: Date;

    constructor(id: string, type: string, amount: number, balanceAfter: number, timestamp: Date) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.timestamp = timestamp;
    }

    toString(): string {
        return `${this.timestamp.toISOString()} - ${this.type.toUpperCase()}: $${this.amount.toFixed(2)} (Balance: $${this.balanceAfter.toFixed(2)})`;
    }
}

// Bank class managing multiple accounts
class Bank {
    private accounts: Map<string, Account> = new Map();
    private bankName: string;

    constructor(bankName: string) {
        this.bankName = bankName;
    }

    createCheckingAccount(accountHolder: string, initialBalance: number = 0, overdraftLimit: number = 500): CheckingAccount {
        const accountNumber = this.generateAccountNumber();
        const account = new CheckingAccount(accountNumber, accountHolder, initialBalance, overdraftLimit);
        this.accounts.set(accountNumber, account);
        return account;
    }

    createSavingsAccount(accountHolder: string, initialBalance: number = 0, interestRate: number = 0.02): SavingsAccount {
        const accountNumber = this.generateAccountNumber();
        const account = new SavingsAccount(accountNumber, accountHolder, initialBalance, interestRate);
        this.accounts.set(accountNumber, account);
        return account;
    }

    getAccount(accountNumber: string): Account | undefined {
        return this.accounts.get(accountNumber);
    }

    private generateAccountNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        return `${timestamp.slice(-6)}${random}`;
    }

    // Demonstrate polymorphism - works with any account type
    processMonthlyMaintenance(): void {
        this.accounts.forEach(account => {
            if (account instanceof SavingsAccount) {
                account.applyInterest();
            }
        });
    }

    getBankName(): string {
        return this.bankName;
    }

    getTotalAccounts(): number {
        return this.accounts.size;
    }

    getAllAccounts(): Account[] {
        return Array.from(this.accounts.values());
    }
}

// Customer interface for additional banking services
interface CustomerProfile {
    customerId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address;
    accounts: Account[];
}

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// Customer management class
class Customer implements CustomerProfile {
    public customerId: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public address: Address;
    public accounts: Account[] = [];

    constructor(firstName: string, lastName: string, email: string, phone: string, address: Address) {
        this.customerId = this.generateCustomerId();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    private generateCustomerId(): string {
        return `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    addAccount(account: Account): void {
        this.accounts.push(account);
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    getTotalBalance(): number {
        return this.accounts.reduce((total, account) => total + account.getBalance(), 0);
    }
}

// Example usage demonstrating OOP principles
function demonstrateBankingSystem(): void {
    console.log("=== Banking System Demonstration ===\n");

    // Create bank instance
    const bank = new Bank("First National Bank");

    // Create customer
    const customerAddress: Address = {
        street: "123 Main St",
        city: "Anytown",
        state: "ST",
        zipCode: "12345",
        country: "USA"
    };

    const customer = new Customer("John", "Doe", "john.doe@email.com", "555-1234", customerAddress);

    // Create accounts (polymorphism - different account types)
    const checkingAccount = bank.createCheckingAccount(customer.getFullName(), 1000, 500);
    const savingsAccount = bank.createSavingsAccount(customer.getFullName(), 5000, 0.025);

    customer.addAccount(checkingAccount);
    customer.addAccount(savingsAccount);

    console.log(`Customer: ${customer.getFullName()}`);
    console.log(`Customer ID: ${customer.customerId}`);
    console.log(`Total accounts: ${customer.accounts.length}`);
    console.log(`Total balance: $${customer.getTotalBalance().toFixed(2)}\n`);

    // Demonstrate account operations
    console.log("=== Account Operations ===");

    // Deposit
    console.log("\n1. Depositing $500 to checking account:");
    checkingAccount.deposit(500);
    console.log(`Checking balance: $${checkingAccount.getBalance().toFixed(2)}`);

    // Withdrawal
    console.log("\n2. Withdrawing $200 from savings account:");
    if (savingsAccount.withdraw(200)) {
        console.log(`Savings balance: $${savingsAccount.getBalance().toFixed(2)}`);
    }

    // Transfer (demonstrates polymorphism)
    console.log("\n3. Transferring $300 from checking to savings:");
    if (checkingAccount.transfer(savingsAccount, 300)) {
        console.log(`Checking balance: $${checkingAccount.getBalance().toFixed(2)}`);
        console.log(`Savings balance: $${savingsAccount.getBalance().toFixed(2)}`);
    }

    // Overdraft attempt
    console.log("\n4. Attempting overdraft on checking account ($2000):");
    checkingAccount.withdraw(2000);
    console.log(`Checking balance: $${checkingAccount.getBalance().toFixed(2)}`);
    console.log(`Available balance: $${checkingAccount.getAvailableBalance().toFixed(2)}`);

    // Interest application
    console.log("\n5. Applying monthly interest to savings account:");
    savingsAccount.applyInterest();
    console.log(`Savings balance after interest: $${savingsAccount.getBalance().toFixed(2)}`);

    // Display transaction history
    console.log("\n=== Transaction History ===");
    console.log("\nChecking Account Transactions:");
    checkingAccount.getTransactionHistory().forEach(transaction => {
        console.log(transaction.toString());
    });

    console.log("\nSavings Account Transactions:");
    savingsAccount.getTransactionHistory().forEach(transaction => {
        console.log(transaction.toString());
    });

    // Bank-level operations
    console.log(`\n=== Bank Summary ===`);
    console.log(`Bank: ${bank.getBankName()}`);
    console.log(`Total accounts: ${bank.getTotalAccounts()}`);

    // Monthly maintenance (polymorphism)
    bank.processMonthlyMaintenance();
    console.log("Monthly maintenance processed for all accounts.");
}

// Run the demonstration
if (require.main === module) {
    demonstrateBankingSystem();
}

export { Account, CheckingAccount, SavingsAccount, Transaction, Bank, Customer, CustomerProfile, Address };