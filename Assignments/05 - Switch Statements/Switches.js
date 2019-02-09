/**
 * Assignment #5 - Switch Statements
 *
 * The set of functions below combine two time values & formats into one totalized time value and format.
 * Only positive numbers and valid time formats are allowed to be entered. All others will result in an
 * error message. With two inputs to the timeAddition function, they are added using the lowest time format
 * between the two inputs. Once totalized, timeRoundUp looks to see if the totalized time can be raised
 * to the next format, or higher.
 *
 */

// Setup string references
const days = "days";
const day = "day";
const hours = "hours";
const hour = "hour";
const minutes = "minutes";
const minute = "minute";
const seconds = "seconds";

// Setup time conversions
const secondsInMinutes = 60;
const secondsInHours = 60 * 60;
const secondsInDays = 60 * 60 * 24;
const minutesInHours = 60;
const minutesInDays = 60 * 24;
const hoursInDays = 24;

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
 * timeAddition adds two numerical values for diferent (or same) time sets using the lowest
 * time measurement label between the two time sets. Function only allows practical time values
 * and labels to be entered. The function uses convertTime to convert to the lowest time
 * measurement between the two time sets. If the result can be rounded up to the next label
 * with a whole number, then it is performed by the function timeRoundUp
 *
 * @param {array} inputs Test array with children datasets of objects that contain test data
 */
const timeAddition = (inputs) => {
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
 * @param {number} time The time value to format into the lowest common format
 * @param {string} currentFormat The current format for the time variable
 * @param {string} targetFormat The target format for the time variable
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
                return time * hoursInDays;
            } else if (targetFormat === minutes) {
                return time * minutesInDays;
            } else {
                return time * secondsInDays;
            }
        case hours:
            if (targetFormat === minutes) {
                return time * minutesInHours;
            } else {
                return time * secondsInHours;
            }
        case minutes:
            if (targetFormat === seconds) {
                return time * secondsInMinutes;
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
 * @param {number} time The total time value to re-format into higher level formats, if possible
 * @param {string} format The desired time format
 */
const timeRoundUp = (time, format) => {
    // Set our return values to the values sent to the function
    let newTime = time;
    let newFormat = format;

    // Switch the current time format
    // We check to see if the modulus of stepping a time value up to the next time format is equal to 0.
    // If the remainder is 0 and there is no higher time format, we return with the new time value and format.
    // Otherwise, we return with the time value and format that is a result of the appropriate IF function
    // which is based on the right format for a whole number.
    switch (format) {
        case hours:
            if (time % hoursInDays === 0) {
                newTime = time / hoursInDays;
                newFormat = days;
            }

            return {
                time: newTime,
                format: newFormat
            };
        case minutes:
            if (time % minutesInHours === 0) {
                if (time % minutesInDays === 0) {
                    newTime = time / minutesInDays;
                    newFormat = days;
                } else {
                    newTime = time / minutesInHours;
                    newFormat = hours;
                }
            }

            return {
                time: newTime,
                format: newFormat
            };
        case seconds:
            if (time % secondsInMinutes === 0) {
                if (time % secondsInHours === 0) {
                    if (time % secondsInDays === 0) {
                        newTime = time / secondsInDays;
                        newFormat = days;
                    } else {
                        newFormat = time / secondsInHours;
                        newFormat = hours;
                    }
                } else {
                    newTime = time / secondsInMinutes;
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
const doTest1 = timeAddition(tests.test1);
const doTest2 = timeAddition(tests.test2);
const doTest3 = timeAddition(tests.test3);
const doTest4 = timeAddition(tests.test4);

// Log the results of the tests
console.log(doTest1);
console.log(doTest2);
console.log(doTest3);
console.log(doTest4);