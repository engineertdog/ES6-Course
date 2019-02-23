/**
 * Assignment #14 - Promises
 *
 * File shows how to utilize promises to perform math on a single number passed
 * to the parent / container function. The entry function takes the number passed,
 * grabs the start time, and then passes it to a sqaureNum function to find the square
 * of that number. Once that is returned, the squareRootNum is executed to find the square
 * root of the number returned from squareNum. Finally, the closest (lower) prime number is
 * then found. Once that is returned, the function execution time is logged.
 */

/**
 * Find the square of the number passed to the function.
 *
 * @param {number} num Number to square.
 */
const squareNum = num => {
    // Return a promise from the function for the promise chain.
    return new Promise(resolve => {
        const squared = num * num;
        console.log(`The square of ${num} is ${squared}.`);

        setTimeout(() => {
            resolve(squared);
        }, num);
    });
}

/**
 * Find the square root of the number passed to the function.
 *
 * @param {number} num Number to find the square root of.
 */
const squareRootNum = num => {
    // Return a promise from the function for the promise chain.
    return new Promise(resolve => {
        const sqroot = Math.sqrt(num);
        console.log(`The square root of ${num} is ${sqroot}.`);
        resolve(sqroot);
    });
}

/**
 * Find the closest (lower) prime number to the number passed to the function.
 *
 * @param {number} num Number to find the closest prime number of.
 */
const primeNum = num => {
    // Return a promise from the function for the promise chain.
    return new Promise(resolve => {
        // Create an array to hold the prime numbers.
        let primes = [];

        // Loop through the numbers from 1 up to the number below the number passed to the
        // function to look for prime numbers.
        for (let i = 1; i < num; i++) {
            // Set a boolean to false to check if the current loop number is prime or not.
            let isPrime = true;

            // Loop through the numbers from 2 up until the current loop number to check
            // if the current loop number is a prime number or not.
            for (let j = 2; j < i; j++) {
                // Check if the outer loop number is not prime by using the inner loop number
                // and modulus to see if the remainder is 0.
                if (i % j === 0) {
                    // If the outer loop number is not prime, break the inner loop and set
                    // isPrime to false so that we don't add this number to the primes array.
                    isPrime = false;
                    break;
                }
            }

            // If the number is not prime, push it to the primes array.
            if (isPrime) {
                primes.push(i);
            }
        }

        // Log the closest prime number that is lower than the number passed to the function. The closest
        // prime number is going to be the last number in the primes array because we made sure to only
        // look for numbers lower than the number passed to the function.
        console.log(`Closest prime number, that is lower than ${num} is ${primes[primes.length - 1]}.`);
        // Callback the resulting prime array.
        resolve(primes);
    });
}

/**
 * Entry point for the promises to perform math on a number.
 *
 * @param {number} num Number to use in the first promise function to perform math with.
 */
const performMath = num => {
    // Get the start time of the function execution.
    const startTime = Date.now();

    // Start the promise chain.
    squareNum(num)
        .then(squared => squareRootNum(squared))
        .then(sqrt => primeNum(sqrt))
        .then(primes => {
            // Get the end time of the function execution.
            const endTime = Date.now();
            // Log the function execution time in milliseconds.
            console.log(`Function execution took: ${endTime - startTime} milliseconds.`);
        });
}

// Execute the promise centered functions.
performMath(199);