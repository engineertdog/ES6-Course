/**
 * Assignment #5 - Switch Statements
 *
 * The set of functions below check a couple of different syllogisms. The information for the syllogisms are contained
 * within the constant at the top of the file. One function takes the inputs and determines which function to send them
 * to, if to any function at all. Each function then determines the path of execuation of statements based on the given
 * values.
 *
 */

// Setup quick string references
const days = "days";
const day = "day";
const hours = "hours";
const hour = "hour";
const minutes = "minutes";
const minute = "minute";
const seconds = "seconds";

// Setup our data for the tests
const tests = {
    test1: [
        {
            value: 25,
            label: days
        }, {
            value: 3,
            label: hours
        }
    ],
    test2: [
        {
            value: 1,
            label: minutes
        }, {
            value: 240,
            label: seconds
        }
    ],
    test3: [
        {
            value: false,
            label: false
        }, {
            value: 5,
            label: minutes
        }
    ],
    test4: [
        {
            value: {},
            label: days
        }, {
            value: 5,
            label: minutes
        }
    ]
}

/**
 * timeAdder adds two numerical values for diferent (or same) time sets using the lowest
 * time measurement label between the two time sets. Function only allows practical time values
 * and labels to be entered. The function uses convertTime to convert to the lowest time
 * measurement between the two time sets. If the result can be rounded up to the next label
 * with a whole number, then it is performed by the function timeRoundUp
 *
 * @param {array} inputs Test array with children datasets of objects that contain test data
 */
const timeAdder = (inputs) => {
    // Initialize some variables to hold time data
    let lowestTimeFormat;
    let totalTime = 0;

    // Loop through the test data to check it's label and time value for correctness
    // Return with an error if the label and time value are invalid
    for (let test of inputs) {
        // Switch the time label to make sure it's valid
        // This is also where the lowest time format is picked
        // The lowest time format is automatically set to whatever the first label is. After that,
        // the lowestTimeFormat variable is updated based on whether or not it is lower than the current
        // lowestTimeFormat variable by using IF statements.
        switch(test.label) {
            case days:
            case day:
                if (!lowestTimeFormat) {
                    lowestTimeFormat = days;
                }

                break;
            case hours:
            case hour:
                if (!lowestTimeFormat || lowestTimeFormat === days) {
                    lowestTimeFormat = hours;
                }

                break;
            case minutes:
            case minute:
                if (!lowestTimeFormat || lowestTimeFormat === days || lowestTimeFormat === hours) {
                    lowestTimeFormat = minutes;
                }

                break;
            case seconds:
            case second:
                lowestTimeFormat = seconds;

                break;
            default:
                return "Your label '" + test.label + "' must be either days, hours, minutes, or seconds.";
        }

        // Check to see if the time value is a positive number, return with an error otherwise
        if (!(test.value >= 0)) {
            return "You entered '" + test.value + "' for the numerical entry. This has to be a positive integer.";
        }
    }

    // Totalize the time between the two time inputs
    inputs.forEach(test => {
        totalTime += convertTime(test.value, test.label, lowestTimeFormat);
    });

    // Attempt to round up the time to the next available time format. Automatically returns the default
    // time object if the current time format is days, or otherwise is an invalid time format.
    const newTime = timeRoundUp(totalTime, lowestTimeFormat);

    // If the numerical value for the time field is only 1, we'll remove the trailing 's'
    // from the format field to show the correct version of the time format.
    if (newTime.time === 1) {
        newTime.format = newTime["format"].substring(0, newTime["format"].length - 1);
    }

    // Check to see if the new time total is different from the original total time, after
    // trying to upgrade the time format. Show the new time object if it has changed from the original
    if (newTime.time !== totalTime) {
        return newTime;
    } else {
        return {
            time: totalTime,
            format: lowestTimeFormat
        };
    }
}

/**
 * This function serves the purpose to convert the current time value to the desired target time value format
 *
 * @param {number} num
 * @param {string} currentFormat
 * @param {string} targetFormat
 */
const convertTime = (time, currentFormat, targetFormat) => {
    // We start by switching the current time's format
    // By default, if the current format is the same as the target, or if the current time format
    // does not match any in the switch list, then we return the time value sent to the function
    // Otherwise, we convert the current time value into the desired time format value based on what the
    // current format and the desired format are.
    switch(currentFormat) {
        case targetFormat:
            return time;
        case days:
            if (targetFormat === hours) {
                return time * 24;
            } else if (targetFormat === minutes) {
                return time * 24 * 60;
            } else {
                return time * 24 * 60 * 60;
            }
        case hours:
            if (targetFormat === minutes) {
                return time * 60;
            } else {
                return time * 60 * 60;
            }
        case minutes:
            if (targetFormat === seconds) {
                return time * 60;
            }
        default:
            return time;
    }
}

/**
 * This function rounds up the totalized time into the highest possible time format, if we can do that at all.
 * The function will only round up the time format if it can round the time value to a whole number within
 * the next time format.
 *
 * @param {number} time
 * @param {string} format
 */
const timeRoundUp = (time, format) => {
    // Set our return values to the values sent to the function
    let newTime = time;
    let newFormat = format;

    // Switch the current time format
    switch (format) {
        case hours:
            if (time % 24 === 0) {
                newTime = time / 24;
                newFormat = days;
            }

            return {
                time: newTime,
                format: newFormat
            };
        case minutes:
            if (time % 60 === 0) {
                if (time % (60 * 24) === 0) {
                    newTime = time / (60 * 24);
                    newFormat = days;
                } else {
                    newTime = time / 60;
                    newFormat = hours;
                }
            }

            return {
                time: newTime,
                format: newFormat
            };
        case seconds:
            if (time % 60 === 0) {
                if (time % (60 * 60) === 0) {
                    if (time % (60 * 60 * 24) === 0) {
                        newTime = time / (60 * 60 * 24);
                        newFormat = days;
                    } else {
                        newFormat = time / (60 * 60);
                        newFormat = hours;
                    }
                } else {
                    newTime = time / 60;
                    newFormat = minutes;
                }
            }

            return {
                time: newTime,
                format: newFormat
            };
        default:
            return {
                time: time,
                format: format
            };
    }
}

// Setup our tests and set them to constants to use in the console.log
const doTest1 = timeAdder(tests.test1);
const doTest2 = timeAdder(tests.test2);
const doTest3 = timeAdder(tests.test3);
const doTest4 = timeAdder(tests.test4);

// Log the results of the tests
console.log(doTest1);
console.log(doTest2);
console.log(doTest3);
console.log(doTest4);