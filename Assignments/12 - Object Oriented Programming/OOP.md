# Object Oriented Programming
## What is Object Oriented Programming?
Object Oriented Programming (OOP) is a way of programming that uses objects to represent real world things. Objects have properties and functions (called methods within an object). OOP provides a way to model something within your application. The properties and methods defined within an object are only available to instances of the object itself as the information is encapsulated within the object.

## How is OOP useful?
Using objects, it is possible to model different data structures and things within your application. It reduces code needed to perform same or similar functions, and it makes it easier to modify the data object you're trying to model. Code reuse is a major benefit of coding in an OOP style.

# Use Cases
## Where could OOP be used?
Think of storing data for a shopping cart for users browsing your site / application. Under traditional programming, you might use an array to store the cart data for the user and objects to store data about the different products available to purchase. While this would work, it's not the most efficient way to do this. The better way to make this happen is through OOP.

## Application
Shopping carts are found on nearly all websites today in a variety of languages. The best way to keep track of this information would be through session tracking of some sort and with Object Oriented Programming. In this example, we want to be able to track a user's shopping cart in an efficient manner with OOP. The user would be able to find products to buy and add them to their shopping cart. When they go to checkout, they're able to pull all of their cart items from the cart object to determine how much they have to pay and what their order will be.

## Shopping cart data flow
When a user wants to add product to their cart, they will invoke a method on the cart object that will update the current cart list to reflect the newly added item. If a user wants to delete an item from the cart, then they will, again, invoke a method on the cart to remove the selected item. The cart object controls all of the cart updates for the user.

## Example Code
See [OOP Cart](Cart.js) for a simplified code base that shows how this can be done.