// Basic TypeScript Types and Interfaces
// Basic primitive types
var userName = "John Doe";
var userAge = 30;
var isActive = true;
var userTags = ["developer", "typescript", "backend"];
var scores = [95, 87, 92];
// Object type annotation
var user = {
    name: "Jane Smith",
    age: 25,
    email: "jane@example.com"
};
// Function with typed parameters and return type
function calculateTotal(products) {
    return products.reduce(function (total, product) { return total + product.price; }, 0);
}
function getUserFullName(profile) {
    return "".concat(profile.firstName, " ").concat(profile.lastName);
}
function processApiResponse(response) {
    if (response.success) {
        return response.data;
    }
    console.error(response.message);
    return null;
}
// Class with typed properties and methods
var ShoppingCart = /** @class */ (function () {
    function ShoppingCart(userId) {
        this.items = [];
        this.userId = userId;
    }
    ShoppingCart.prototype.addProduct = function (product) {
        if (product.inStock) {
            this.items.push(product);
        }
    };
    ShoppingCart.prototype.removeProduct = function (productId) {
        var initialLength = this.items.length;
        this.items = this.items.filter(function (item) { return item.id !== productId; });
        return this.items.length < initialLength;
    };
    ShoppingCart.prototype.getTotal = function () {
        return calculateTotal(this.items);
    };
    ShoppingCart.prototype.getItems = function () {
        return this.items;
    };
    return ShoppingCart;
}());
// Enum usage
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
})(OrderStatus || (OrderStatus = {}));
var Order = /** @class */ (function () {
    function Order(id, userId, products) {
        this.id = id;
        this.userId = userId;
        this.products = products;
        this.status = OrderStatus.PENDING;
        this.createdAt = new Date();
        this.totalAmount = calculateTotal(products);
    }
    Order.prototype.updateStatus = function (newStatus) {
        this.status = newStatus;
    };
    Order.prototype.isDelivered = function () {
        return this.status === OrderStatus.DELIVERED;
    };
    return Order;
}());
// Example usage
var sampleProducts = [
    {
        id: 1,
        name: "Laptop",
        price: 999.99,
        category: "Electronics",
        inStock: true,
        description: "High-performance laptop"
    },
    {
        id: 2,
        name: "Mouse",
        price: 29.99,
        category: "Electronics",
        inStock: true
    }
];
var cart = new ShoppingCart(123);
sampleProducts.forEach(function (product) { return cart.addProduct(product); });
var order = new Order(1, 123, cart.getItems());
console.log("Order total: $".concat(order.totalAmount));
