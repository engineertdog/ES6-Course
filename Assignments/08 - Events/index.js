/**
 * Assignment #8 - Events
 *
 *
 */

// Setup the game's variables:
// Game move count, game move, object of the boxes and their current move, and an array of winning moves
let moveCount = 0;
let move = "x";
let boxes = {
    box1: "",
    box2: "",
    box3: "",
    box4: "",
    box5: "",
    box6: "",
    box7: "",
    box8: "",
    box9: ""
};
const winningMoves = [
    ["box1", "box2", "box3"],
    ["box4", "box5", "box6"],
    ["box7", "box8", "box9"],
    ["box1", "box4", "box7"],
    ["box2", "box5", "box8"],
    ["box3", "box6", "box9"],
    ["box1", "box5", "box9"],
    ["box3", "box5", "box7"]
]

/**
 * playGame function play tic tac toe and is invoked by an event listener on the gameContainer ID.
 *
 * @param {object} e Event handler passed from the event listener
 */
const playGame = (e) => {
    const box = e.target;

    // Check to see if the box selected has already been played. Return out of the function with an alert
    // if the box has been played this game.
    if (boxes[box.id] !== "") {
        alert("This box has been played! Choose another.");
        return;
    } else {
        // Set the game's box object to store the current move to check for winning moves later.
        // Then set the text of the box to the current player.
        // Finally, increment the game move count.
        boxes[box.id] = move;
        box.innerText = move;
        moveCount++;

        // Add a class to the box that was just played based on the player. Also, change the game player.
        if (move === "x") {
            box.classList.add("x");
            move = "o";
        } else {
            box.classList.add("o");
            move = "x";
        }
    }

    // Cycle through the array of winning moves to see if the game object, boxes, has any winning move matches.
    for (const w of winningMoves) {
        // Make sure that the box object's three possible winning move boxes are not empty to prevent false
        // wins based on empty data.
        if (boxes[w[0]] && boxes[w[1]] && boxes[w[2]] !== "") {
            // Check to see if the three boxes have been played by the same player
            if ((boxes[w[0]] === boxes[w[1]]) && (boxes[w[0]] === boxes[w[2]])) {
                // Alert the winner and restart the game.
                // A timeout is used to ensure the game shows the last move played. Without the timeout
                // in the current setup, the DOM update is fired after the alert and gameOver are invoked.
                // Use a timeout in the current setup to ensure the last play can be seen by the player before
                // ending the game.
                setTimeout(() => {
                    alert("Player '" + boxes[w[0]] + "' has won the game!");
                    gameOver();
                }, 100);
                return;
            }
        }
    }

    // If there are no winning moves and the game has reached 9 moves (board is full), then restart the game.
    // We use a timeout again for the same reason above.
    if (moveCount === 9) {
        setTimeout(() => {
            alert("Cats game! Restarting.");
            gameOver();
        }, 100);
    }
}

/**
 * gameOver function restart the game
 */
const gameOver = () => {
    // Set the game's moveCount and player variable.
    moveCount = 0;
    move = "x";

    // Loop through the game's object to set the box values to an empty string.
    for (const b of Object.keys(boxes)) {
        boxes[b] = "";
    }

    // Loop through the HTML box collection to set the text to an empty string and remove any conditional
    // styling applied with JavaScript.
    for (const c of boxCollection) {
        c.innerText = "";
        c.classList.remove("x", "o");
    }
}

// Setup the HTML box collection and game container.
const boxCollection = document.getElementsByClassName("box");
const game = document.getElementById("gameContainer");

// Add the event listener to a click anywhere within the game board.
game.addEventListener("click", playGame);