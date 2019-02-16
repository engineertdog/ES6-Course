/**
 * Assignment 10 - Destructuring
 *
 * ***********************
 * File Purpose
 * ***********************
 * The code in this file loops through an array of user objects and logs a formatted statement based on the information stored in
 * the user object. There are nested arrays and objects used in the format function, and each set of nested arrays or objects
 * are extracted out to make dealing with them easier.
 *
 * ***********************
 * Destructuring explained
 * ***********************
 * Destructuring an Object and an Array are similar in operation, but Objects work a little differently because the
 * syntax makes the compiler think that the destructured object should be a function (if using already declared variables).
 * When destructuring an array, the index of the variable in the destructured array is the value of the same index in the array.
 * However, in objects, the name of the variable is going to be the value from the same key name in the object. This means that
 * you can associate whichever key / value pair from the object that you want without worrying about order. You can also
 * associate the key from the object to a variable with a name that is different from the object's key.
 *
 * You use destructuring to reduce the amount of code you would have when you extract large amounts of data from arrays and
 * objects. The old way is indicated below for referece. Destructuring makes it easier to access data from arrays and objects
 * and makes for cleaner code.
 *
 * Old way, arrays for example. Objects work the same.
 * var myArray = ["Joe", "Taylor", "Bob", "Sally"];
 * var sally = myArray[3];
 * var taylor = myArray[2];
 *
 */

const comma = `, `;
const period = `.`;

// Array of user objects to parse.
const users = [
    {
        username: "BobTheGreatest",
        email: "bob@mymail.com",
        job: "Sales",
        info: {
            name: "Billy Bob",
            age: 28,
            phone: {
                cell: 123456789,
                home: 987654321
            },
            likes: [
                "hiking",
                "camping",
                "fishing"
            ],
            friends: [
                {
                    username: "BillNye",
                    liked: 7
                }
            ]
        }
    }, {
        username: "BillNye",
        email: "bill@nye.com",
        job: "Instructor",
        info: {
            name: "Bill Nye",
            age: 51,
            phone: {
                cell: 111222333,
                home: 333222111
            },
            likes: [
                "computers",
                "programming",
                "science"
            ],
            friends: [
                {
                    username: "BobTheGreatest",
                    liked: 5
                }
            ]
        }
    }, {
        username: "SallyMae",
        email: "smae@gmail.com",
        job: "Computer Repair",
        info: {
            name: "Sally Mae",
            age: 34,
            phone: {
                cell: 345345345,
                home: 543543543
            },
            likes: [
                "computers",
                "biking",
            ]
        }
    }, {
        username: "JCBoss",
        email: "jcboss@mail.com",
        job: "Rally Driver",
        info: {
            name: "JC Jackson",
            age: 25,
            phone: {
                cell: 987987987,
                home: 789789789
            },
            likes: [
                "rally",
                "cars",
                "engines"
            ],
            friends: [
                {
                    username: "SallyMae",
                    liked: 7
                },
                {
                    username: "noPhoneOrLikes",
                    liked: 5
                }
            ]
        }
    }, {
        username: "noPhoneOrLikes",
        email: "phone@empty.com",
        job: "Non Existing Keys",
        info: {
            name: "Friendless",
            age: 15,
            friends: []
        }
    }, {
        username: "emptyArrays",
        email: "iamempty@empty.com",
        job: "Empty Keys",
        info: {
            name: "Empty Inside",
            age: 1,
            phone: {},
            likes: [],
            friends: []
        }
    }
];

/**
 * Returns a formatted statement from the user object passed to it.
 *
 * @param {object} param0 User object to format
 */
const formatUser = ({username, email, job, info}) => {
    // Grab the string, arrays, and objects from the info key.
    const {name, age, phone, likes, friends} = info;

    // Grab the string result, or false, from formatSentence with the phone numbers.
    const phonesResult = formatSentence("phones", `${name} has the following phone numbers: `, phone);
    // Set phoneText to phoneResult or a default string.
    const phoneText = phonesResult ? phonesResult : `Sadly, ${name} has no phone number.`;

    // Grab the string result, or false, from formatSentence with the likes.
    const likesResult = formatSentence("likes", `${name} likes the following things: `, likes);
    // Set likedText to likesResult or a default string.
    const likedText = likesResult ? likesResult : `Sadly, ${name} doesn't like anything at all.`;

    // Grab the string result, or false, from formatSentence with the friends.
    const friendsResult = formatSentence("friends", `${name} has the following friends: `, friends);
    // Set friendsText to friendsResult or a default string.
    const friendsText = friendsResult ? friendsResult : `${name} has no friends. That is sad.`;

    // Formatted statement to return to the calling function.
    const formattedStatement = `Meet ${info.name}; they are ${age} years old. Their username here is "${username}" and you can reach them at ${email}. Their job title is "${job}". ${phoneText} ${likedText} ${friendsText}`;

    // Return the formatted statement.
    return formattedStatement;
}

/**
 * Format a sentence for a set of object or array values passed to the function.
 *
 * @param {string} field The object or array field that we want to format text for.
 * @param {string} formattedString Base string to write data to.
 * @param {object} objArr Object or array to parse.
 */
const formatSentence = (field, formattedString, objArr) => {
    // Check if the object / array is null.
    if (objArr) {
        // Set a length variable for the object / array length and a counter.
        let length, cPhoneNum = 0;

        // Set the length to the length of the array or object and subtract 1 to get the total length.
        if (Array.isArray(objArr)) {
            length = objArr.length - 1;
        } else {
            length = Object.keys(objArr).length - 1;
        }

        // Length will be -1 if the object / array is empty. This will cause the function to return false if empty.
        if (length !== -1) {
            // Grab all of the items from the object / array and set them to a rest variable.
            let {...allItems} = objArr;

            // Loop through all of the items from the object / array.
            for (const item in objArr) {
                // Add text to the base string passed, and format the text added based on the key passed.
                if (field === "phones") {
                    formattedString += `${allItems[item]}${formatSentenceEnd(cPhoneNum, length)}`;
                    // Since phones is an object, we have to keep track of the current number with a counter instead of the index
                    // number, which is what the arrays keep track with.
                    cPhoneNum++;
                } else if (field === "likes") {
                    formattedString += `${allItems[item]}${formatSentenceEnd(item, length)}`;
                } else if (field === "friends") {
                    formattedString += `${allItems[item].username} liked ${allItems[item].liked}/10${formatSentenceEnd(item, length)}`;
                }
            }

            // Return the formatted string.
            return formattedString;
        }
    }

    // Return false if the object / array is null or empty.
    return false;
}

/**
 * Return either a comma or period if the index is equal to the passed object or array length.
 *
 * @param {number} index Index of the current array / object item.
 * @param {number} count Length of the array / object.
 */
const formatSentenceEnd = (index, count) => {
    if (parseInt(index) !== count) {
        return comma;
    } else {
        return period;
    }
}

// Loop through the users and log the result of the function.
for (index in users) {
    console.log(formatUser(users[index]));
}