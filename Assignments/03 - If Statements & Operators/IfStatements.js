/**
 * Assignment #3 - If Statements & Operators
 *
 * The set of functions below check a couple of different syllogisms. The information for the syllogisms are contained
 * within the constant at the top of the file. One function takes the inputs and determines which function to send them
 * to, if to any function at all. Each function then determines the path of execuation of statements based on the given
 * values.
 *
 */

// Object to hold all of the syllogism data.
const syllogisms = {
    men: {
        syllogism: "Men Syllogism",
        identifiers: {
            men: "men",
            women: "women"
        },
        values: {
            socrates: "Socrates",
            tyler: "Tyler"
        },
        extra: {
            mortal: true
        }
    },
    cake: {
        syllogism: "Cake Syllogism",
        identifiers: {
            cake: "cake",
            pie: "pie"
        },
        values: {
            chocolate: "chocolate",
            vanilla: "vanilla"
        }
    },
    invalid: {
        syllogism: "Invalid Syllogism",
        identifiers: {
            invalid: null
        },
        values: {
            invalid: null
        }
    }
}

// Setup quick reference points for the syllogisms object to make access easier and cleaner.
const men = syllogisms.men;
const cake = syllogisms.cake;
const invalid = syllogisms.invalid;

/**
 *
 * @param {string} syllogism The syllogism to test
 * @param {string} identifier The main identifier for the syllogism
 * @param {string} value The value to test within the syllogism
 * @param {string} mortal Optional value for the men syllogism
 */
function syllogism(syllogism, identifier, value, mortal = null) {
    if (syllogism === men.syllogism) {
        menSyllogism(identifier, value, mortal);
    } else if (syllogism === cake.syllogism) {
        cakeSyllogism(identifier, value);
    } else {
        console.log("You've entered an invalid logical argument identifier!");
    }
}


/**
 *
 * @param {string} identifier The main identifier of the syllogism
 * @param {string} value The value to test within the syllogism
 * @param {string} mortal Optional value for the men syllogism
 */
function menSyllogism(identifier, value, mortal) {
    if (identifier === men.identifiers.men) {
        if (mortal === men.extra.mortal) {
            if (value === men.values.socrates) {
                console.log("Socrates is mortal because he is a man.");
            } else {
                console.log("You aren't Socrates. I don't care.");
            }
        } else {
            console.log("We are immortal, we are gods!");
        }
    } else {
        console.log("Sorry, we only deal with men inside this function.");
    }
}

/**
 *
 * @param {string} identifier The main identifier of the syllogism
 * @param {string} value The value to test within the syllogism
 */
function cakeSyllogism(identifier, value) {
    if (identifier === cake.identifiers.cake) {
        if ((value === cake.values.vanilla) || (value === cake.values.chocolate)) {
            if (value !== cake.values.chocolate) {
                console.log("You have vanilla cake! While this is awesome, it is because you are not chocolate cake.");
            } else {
                console.log("Boo, you have chocolate cake!");
            }
        } else {
            console.log("You don't have chocolate or vanilla cake!");
        }
    } else {
        console.log("You need cake to access this function!");
    }
}

let socrates = new syllogism(men.syllogism, men.identifiers.men, men.values.socrates, men.extra.mortal);
let immortalExample = new syllogism(men.syllogism, men.identifiers.men, men.values.socrates, !men.extra.mortal);
let vanillaCake = new syllogism(cake.syllogism, cake.identifiers.cake, cake.values.vanilla);
let invalidSyllogism = new syllogism(invalid.syllogism, invalid.identifiers.invalid, invalid.values.invalid);