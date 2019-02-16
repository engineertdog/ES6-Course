/**
 * Assignment #11 - Exceptions
 *
 * File demonstrates the ability to handle exceptions, including how to create new exceptions to custom handle responses.
 * Also shows the use of the try/catch functionality to utilize exceptions to allow an application to work as intended without
 * breaking during use. The functionality of this application in particular is to parse supplied JSON-stringified Arrays,
 * reverse the order of the data, and return the stringified Array. Anything aside from a JSON-stringified Array that is
 * passed to the function will log an error and return a boolean value of false from the function.
 *
 */

/**
 * Custom type exception error.
 *
 * @param {string} value Value of exception.
 */
function TypeException(value) {
    this.toString = () => {
        return `Type Exception: reverseJsonArray expects a JSON-stringified array. ${value} was passed, which is a ${typeof value}.`;
    }
}

/**
 * Custom syntax exception error.
 *
 * @param {string} value Value of exception.
 */
function SyntaxException(value) {
    this.toString = () => {
        return `Syntax Exception: reverseJsonArray expects a JSON-stringified array. ${value} was passed, which is a not a valid JSON-stringified array.`;
    }
}

/**
 * Checks if the passed argument is a valid JSON-stringified Array. If it is, then reverse the order of the
 * array and stringify the result. Return the result.
 *
 * @param {string} arg JSON-stringified Array to reverse order.
 */
const revsereJsonArray = (arg) => {
    // First check if the argument is a string or not.
    if (typeof arg === "string") {
        // Try to parse the argument.
        try {
            // Set the value of the parsed argument, if it is a JSON string.
            const parsed = JSON.parse(arg);
            return JSON.stringify(parsed.reverse());
        } catch (e) {
            // Throw a syntax error if the argument is not valid JSON.
            throw new SyntaxException(arg);
        }
    } else {
        // Throw a custom type exception to indicate that the argument is not a string.
        throw new TypeException(arg);
    }
}

/**
 * Return a reversed JSON-stringified array, or the boolean false if the passed value is not a JSON-stringified Array.
 *
 * @param {string} value JSON-stringified Array.
 */
const tryReverse = (value) => {
    // Create a variable for the return value.
    let toReturn;

    try {
        // Set the return variable to the result of revsereJsonArray, if it does not throw an exception.
        toReturn = revsereJsonArray(value);
    } catch (e) {
        // Set the return variable to false because we threw an exception.
        toReturn = false;

        // Log the exception for development.
        console.log(`${e}`);
    }

    // Return the proper value.
    return toReturn;
}

// Create some test data to try against the reverse function.
const tests = [
    undefined,
    true,
    [1, 2, 3, 4, 5],
    `['1', '2', '3', '4', '5', '6', '7']`,
    `["zulu"]`,
    `[]`,
    `["alfa", "bravo", "charlie", "delta"]`,
    `["papa", "oscar", "foxtrot", "echo", "tango"]`,
]

// Loop through our tests and log the results. If a test is a non-valid JSON-stringified Array, then
// the exception will be logged, followed by the wanted result of the function, which is false.
for (const i in tests) {
    console.log(tryReverse(tests[i]));
}