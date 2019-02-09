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
    human: {
        syllogism: "Human Syllogism",
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
 * @param {string} mortal Optional value for the human syllogism
 */
const syllogism = (syllogism, identifier, value, mortal = null) => {
    if (syllogism === human.syllogism) {
        humanSyllogism(identifier, value, mortal);
    } else if (syllogism === desert.syllogism) {
        desertSyllogism(identifier, value);
    } else {
        console.log("You've entered an invalid logical argument identifier!");
    }
}


/**
 * Human syllogism checks to see if the identifier is "men", and then whether or not the person is mortal. Finally,
 * The function checks if the person is also Socrates.
 *
 * @param {string} identifier The main identifier of the syllogism
 * @param {string} value The value to test within the syllogism
 * @param {string} mortal Optional value for the human syllogism
 */
const humanSyllogism = (identifier, value, mortal) => {
    if (identifier === human.identifiers.men) {
        if (mortal === human.extra.mortal) {
            if (value === human.values.socrates) {
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
 * Determines whether or not the desert is desert. If it is, it checks the flavor and logs info based on the flavor
 * of the desert.
 *
 * @param {string} identifier The main identifier of the syllogism
 * @param {string} value The value to test within the syllogism
 */
const desertSyllogism = (identifier, value) => {
    if (identifier === desert.identifiers.cake) {
        if ((value === desert.values.vanilla) || (value === desert.values.chocolate)) {
            if (value !== desert.values.chocolate) {
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

// Setup our tests and set them to constants (though not needed as this setup uses console.log within the functions)
const socrates = syllogism(human.syllogism, human.identifiers.men, human.values.socrates, human.extra.mortal);
const immortalExample = syllogism(human.syllogism, human.identifiers.men, human.values.socrates, !human.extra.mortal);
const vanillaCake = syllogism(desert.syllogism, desert.identifiers.cake, desert.values.vanilla);
const invalidSyllogism = syllogism(invalid.syllogism, invalid.identifiers.invalid, invalid.values.invalid);