/**
 * Assignment #4 - Functions
 *
 * The set of functions below check a couple of different syllogisms. The information for the syllogisms are contained
 * within the constant at the top of the file. One function takes the inputs and determines which function to send them
 * to, if to any function at all. Each function then determines the path of execuation of statements based on the given
 * values.
 *
 */

// Object to hold all of the syllogism data.
const syllogisms = {
    human: {
        syllogism: "Human Syllogism",
        identifiers: {
            men: "men",
            women: "women"
        },
        values: {
            socrates: "Socrates",
            tyler: "Tyler"
        }
    },
    desert: {
        syllogism: "Desert Syllogism",
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
const human = syllogisms.human;
const desert = syllogisms.desert;
const invalid = syllogisms.invalid;

/**
 * Takes in syllogism arguments to determine which function to invoke
 *
 * @param {string} syllogism The syllogism to test
 * @param {string} identifier The main identifier for the syllogism
 * @param {string} value The value to test within the syllogism
 */
const syllogism = (syllogism, identifier, value, chocolate = null) => {
    if (syllogism === human.syllogism) {
        return humanSyllogism(identifier, value);
    } else if (syllogism === desert.syllogism) {
        return desertSyllogism(identifier, value, chocolate);
    } else {
        return "You've entered an invalid logical argument identifier!";
    }
}


/**
 * Human syllogism checks to see if the identifier is "men".
 * The function then checks if the person is also Socrates.
 *
 * @param {string} identifier The main identifier of the syllogism
 * @param {string} value The value to test within the syllogism
 */
const humanSyllogism = (identifier, value) => {
    if (identifier === human.identifiers.men) {
        if (value === human.values.socrates) {
            return true;
        }
    }

    return false;
}

/**
 * Determines whether or not the desert is desert. If it is, it checks the flavor and logs info based on the flavor
 * of the desert.
 *
 * @param {string} identifier The main identifier of the syllogism
 * @param {string} value The value to test within the syllogism
 */
const desertSyllogism = (identifier, value, chocolate) => {
    if (identifier === desert.identifiers.cake) {
        if (chocolate) {
            return "You have chocolate cake!";
        } else {
            return "You don't have chocolate cake. You have: " + value + " cake.";
        }
    } else {
        return "You need cake to access this function!";
    }
}

let socrates = syllogism(human.syllogism, human.identifiers.men, human.values.socrates);
let vanillaCake = syllogism(desert.syllogism, desert.identifiers.cake, desert.values.vanilla, false);
let chocolateCake = syllogism(desert.syllogism, desert.identifiers.cake, desert.values.chocolate, true);
let invalidSyllogism = syllogism(invalid.syllogism, invalid.identifiers.invalid, invalid.values.invalid);

console.log(socrates);
console.log(vanillaCake);
console.log(chocolateCake);
console.log(invalidSyllogism);