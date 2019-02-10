/**
 * Assignment #6 - Loops
 *
 * The set of functions below check a set of numbers from a defined start and end point to see if they are
 * either a prime number, or divisible by the array of modulus information provided. If the numbers are
 * prime, then "Prime is logged". If the numbers can be divided by the set of numbers provided, then their
 * respective print data is logged. Otherwise, the number itself is logged.
 *
 */

// Setup the modulus data we want to test
const moduloData = [
    {
        m: 15,
        print: "FizzBuzz"
    }, {
        m: 3,
        print: "Fizz"
    }, {
        m: 5,
        print: "Buzz"
    }
]

/**
 * numLogger takes 3 arguments and iterates over the numbers to check if they are either a prime number
 * or if they are divisible by the modulus values provided in the array.
 *
 * @param {number} start Number we want to start at
 * @param {number} end Number we want to end at
 * @param {array} modulus
 */
const numLogger = (start, end, modulus) => {
    for (let i = start; i <= end; i++) {
        // Set a variable to false that can be used to print the number if none of the other
        // checks have been satisfied
        let divisible = false;

        // First check to see if the number is a prime number. Log prime if it is and prevent logging the
        // number to the console.
        if (isPrime(i)) {
            console.log("Prime");
            divisible = true;
        } else {
            // Loop through the modulus array. for...of will loop in order of the indexes, so we placed
            // modulus of 15 at the top so that any multiples of 3 or 5 are captured with FizzBuzz instead
            // of their counterparts 3 or 5's print data
            for (let mInfo of modulus) {
                if (i % mInfo.m === 0) {
                    console.log(mInfo.print);
                    divisible = true;
                    break;
                }
            }
        }

        // If the number is not prime or divisible by 3, 5, or 15, then log the number.
        if (!divisible) {
            console.log(i)
        }
    }
}

/**
 *
 * @param {number} num Number to prime check
 */
const isPrime = (num) => {
    // If the number is less than 1, return false
    // 1 is not a prime number, per the definition. We also want positive numbers for this setup.
    // However, we could check negative numbers, if we wished to.
    if (num <= 1) {
        return false;
    }

    // Loop through all of the numbers from 2 up to the number we are prime checking. We don't want to
    // include the value 1 or the number itself as the function would falsely return false. In this case,
    // returning false means the number is not prime.
    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }

    // Return true if the number cannot be wholly divided by any number (except for 1 and itself).
    return true;
}

// Setup our test. We save the results to a constant, although in this case, the function logs to
// the console. However, we could get the function to return a value instead of logging to the console.
// In which case, this would be useful to save the data.
const doTest1 = numLogger(1, 100, moduloData);