/**
 * Assignment #2 Variables and Constants
 *
 * VAR
 * var is an ES5 construct all purpose variable. It does have scope, but it also have flexibility in the use
 * of the scope. This flexibility can lead to errors at times when you modify or call a variable you had
 * not intended to.
 *
 * LET
 * let is an ES6 improvement upon var that allows you to confine the scope of the variable to only be used
 * within the block it was defined in. This is more restrictive than var, which is generally useful today.
 *
 *
 * CONST
 * const is a variable that you are unable to change, though it does not take the state of immutable. You are
 * able to modify the original data that const references, but this is limited to objects and arrays as
 * strings, booleans, and numbers would change the original data instead of adding to it.
 *
 */

/**
 * Example usage of var
 */
const exVar = () => {
    var firstNum = 10;

    if (firstNum < 50) {
        console.log("First number * 5 is: " + firstNum * 5);

        // Here we set secondNum to 25 which is scoped to the current IF function it is located in.
        // However, due to var's attributes, it is available to the whole function exVar.
        var secondNum = 25;
    }

    // This IF statement will return true even though secondNum technically was defined in the first IF
    // function. This is one of the drawbacks mentioned above.
    if (secondNum > 20) {
        console.log("Second number is > 20.");
    } else {
        console.log("Second number is < 20.");
    }
}

/**
 * Example usage of let
 */
const exLet = () => {
    let name = "Tyler";

    if (name === "Tyler") {
        let newName = "Brock";
        console.log("Enjoy the pie, " + name + ".");
    } else {
        console.log("No pie for you!");
    }

    // If we uncomment the line below, we would throw an error by trying to run the function.
    // newName is not defined in the scope where console.log is being executed. It was defined in the
    // if statement above.
    // console.log(newName);
}

/**
 * Example usage of const
 */
const exConst = () => {
    // Set the following values to const variables because we do not want them to change.
    const loser = "Brandon";
    const winningNumbers = [100, 69, 50];
    const myNumber = 49;
    // Set wonLottery to a let variable because we need to modify it
    let wonLottery = false;

    // Loop each of the array items in winningNumbers array to see if our number, myNumber, is in the set
    winningNumbers.forEach(num => {
        // If myNumber equals any one of the lottery numbers, set wonLottery to true.
        if (myNumber === num) {
            wonLottery = true;
        }
    });

    // Display the results of the lottery based on our variable.
    if (wonLottery) {
        console.log("I won the lottery!");
    } else {
        console.log(loser + " did not win the lottery.");
    }

    // Try to cheat the lottery
    // If we change our number, myNumber to another value, we would get an error
    // myNumber = 50
    // However, if we mutate the winningNumbers array, we can cheat the lottery
    winningNumbers.push(49);

    // Loop through the winning numbes again
    winningNumbers.forEach(num => {
        // If myNumber equals any one of the lottery numbers, set wonLottery to true.
        if (myNumber === num) {
            wonLottery = true;
        }
    });

    // Check to see if we won the lottery.
    if (wonLottery) {
        console.log("I won the lottery!");
    } else {
        console.log(loser + " did not win the lottery.");
    }
}

// Execute our example functions for the different variable types
exVar();
exLet();
exConst();