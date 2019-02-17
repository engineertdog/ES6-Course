/**
 * Assignment #12 - Object Oriented Programming
 *
 * The code in this file showcases how Object Oriented Programming is useful in real world applications. A number
 * of features are of course not included, and certain things are assumed. However, this file indicates how OOP
 * makes it easier to code and maintain code for an application.
 *
 */

/**
 * Product object models the products available for purchase. This could be the parent object
 * with child objects for different categories of products.
 *
 * @param {string} name Name of the product.
 * @param {number} price Price of the product.
 */
function Product(name, price) {
    // Capture the name and price of the product.
    this.name = name;
    this.price = price;

    // Return the name of the product.
    this.getName = () => {
        return this.name;
    }

    // Return the price of the product.
    this.getPrice = () => {
        return this.price;
    }
}

/**
 * Cart object holds the information for the products that the user has marked for purchase.
 */
function Cart() {
    // Create an empty array that added products will go into.
    this.products = [];

    // Add a product to the cart's product array.
    this.addProduct = (amount, product) => {
        this.products.push(...Array(amount).fill(product));
    }

    // Calculate the total of the items in the cart.
    this.calcTotal = () => {
        return this.products
            .map(product => product.getPrice())
            .reduce((t, c) => t + c, 0);
    }
}

// Create some products that the user is able to buy.
const iPhone = new Product("iPhone", 999.99);
const tv = new Product("TV", 499.99);
const bed = new Product("Bed", 104.54);

// Create a new Cart object.
const cart = new Cart();
// Simulate the user adding products to their cart.
cart.addProduct(2, iPhone);
cart.addProduct(3, bed);

// Grab the cart total and log it.
const total = cart.calcTotal();
console.log(total);