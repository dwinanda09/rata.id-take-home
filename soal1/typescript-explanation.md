# TypeScript Fundamentals

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript by adding static type definitions. It's developed and maintained by Microsoft and compiles to clean, readable JavaScript code.

## Key Advantages Over JavaScript

### 1. **Static Type Checking**
- Catches errors at compile time rather than runtime
- Prevents common bugs like accessing undefined properties
- Provides better code reliability

### 2. **Enhanced Developer Experience**
- Better IDE support with autocomplete and IntelliSense
- Easier refactoring with confidence
- Better code navigation and documentation

### 3. **Code Maintainability**
- Self-documenting code through type annotations
- Easier to understand large codebases
- Better collaboration in team environments

### 4. **Modern JavaScript Features**
- Supports latest ECMAScript features
- Backwards compatibility with older JavaScript environments
- Advanced features like generics, decorators, and modules

## Core Type System Features

### Basic Types
```typescript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let items: string[] = ["item1", "item2"];
```

### Interfaces
Interfaces define the structure of objects and provide contracts for classes and functions.

### Type Aliases and Union Types
- Create custom types for better code organization
- Union types allow variables to hold multiple types
- Literal types for exact value specifications

### Generics
Enable writing reusable code components that work with multiple types while maintaining type safety.

### Classes with Access Modifiers
- `public`: accessible everywhere (default)
- `private`: only accessible within the class
- `protected`: accessible within class and subclasses
- `readonly`: can only be set during initialization

## Compilation Process

TypeScript code is compiled to JavaScript, making it compatible with any environment that runs JavaScript. The TypeScript compiler (tsc) performs type checking and generates optimized JavaScript output.

## Best Practices

1. **Use strict mode** - Enable strict type checking
2. **Explicit typing** - Be explicit about types when TypeScript cannot infer them
3. **Interface segregation** - Keep interfaces focused and specific
4. **Generic constraints** - Use constraints to limit generic types appropriately
5. **Readonly properties** - Use readonly for immutable data

TypeScript enhances JavaScript development by providing type safety, better tooling, and improved code quality without sacrificing the flexibility that makes JavaScript powerful.