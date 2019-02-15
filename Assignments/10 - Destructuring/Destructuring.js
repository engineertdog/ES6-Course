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
 */

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
    // Create variables to set later and set the default string for phones, liked, and friendsText which
    // are used in the formatted statement.
    let numbers, phones = `Sadly, ${name} has no phone number.`,
        allLikes, liked = `Sadly, ${name} doesn't like anything at all.`,
        allFriends, friendsText = `${name} has no friends. That is sad.`;
    // Set counters to format text properly.
    let cPhoneNum = 0, phoneCount, likeCount, friendCount;

    // This shows how to handle non-existent phone keys in the object.
    if (phone) {
        // Set the phone count since the key exists in the object.
        phoneCount = Object.keys(phone).length - 1;

        // Make sure the phone object is not empty.
        if (phoneCount !== -1) {
            // Set all the phone numbers to a rest variable so we can iterate over them.
            ({...numbers} = phone);
            phones = `${name} has the following phone numbers: `;
        }
    }

    // Iterate over the phone numbers and add to a phones string that we can add to the returned message.
    for (const number in numbers) {
        // Add the phone number to the phones string.
        phones += numbers[number];

        // If the current number is not the length of the numbes array, format with a comma. Otherwise, end the sentence.
        if (cPhoneNum !== phoneCount) {
            phones += `, `;
        } else {
            phones += `.`;
        }

        // Increment the counter.
        cPhoneNum++;
    }

    // This shows how to handle non-existent like keys in the object.
    if (likes) {
        // Set the like count since it exists in the object;
        likeCount = likes.length - 1;

        // Make sure the likes object is not empty.
        if (likeCount !== -1) {
            // Set all the phone numbers to a rest variable so we can iterate over them.
            ({...allLikes} = likes);
            liked = `${name} likes the following things: `;
        }
    }

    // Iterate over the likes of the user and add to a likes string that we can add to the returned message.
    for (const cLike in allLikes) {
        // Add the like to the liked string.
        liked += allLikes[cLike];

        // If the index is not the last item, format it with a comma. Otherwise, end the sentence.
        if (cLike != likeCount) {
            liked += `, `;
        } else {
            liked += `.`;
        }
    }

    // This shows how to handle non-existent friend keys in the object.
    if (friends) {
        // Set the friend count since it exists in the object;
        friendCount = friends.length - 1;

        // Make sure the friends object is not empty.
        if (friendCount !== -1) {
            // Set all the friends to a rest variable so we can iterate over them.
            ({...allFriends} = friends);
            friendsText = `${name} has the following friends: `;
        }
    }

    // Iterate over the friends and add to a friends string that we can add to the returned message.
    for (const f in allFriends) {
        // Add the username and liked status to the friendsText string.
        friendsText += `${allFriends[f].username} liked ${allFriends[f].liked}/10`;

        // If the index is not the last item, format it with a comma. Otherwise, end the sentence.
        if (f != friendCount) {
            friendsText += `, `;
        } else {
            friendsText += `.`;
        }
    }

    // Formatted statement to return to the calling function.
    const formattedStatement = `Meet ${info.name}; they are ${age} years old. Their username here is "${username}" and you can reach them at ${email}. Their job title is "${job}". ${phones} ${liked} ${friendsText}`;

    return formattedStatement;
}

// Loop through the users and log the result of the function.
for (index in users) {
    console.log(formatUser(users[index]));
}