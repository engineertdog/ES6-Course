/**
 * Project #3 - Elevator Controller
 *
 * This project uses classes to control two elevators within a building. The building holds the information about
 * each elevator instantiated, as well as the information about the people who are waiting for elevators, or who have
 * been served by an elevator. The building class is the common place for all information. People are added to the
 * building's waitlist which is used by the elevators to know who to pick up, where to pick them up at, and where
 * to deliver them. If one elevator is targeting a floor, the other elevator will find the next longest wait by a person
 * and target their floor instead. The elevators run until all people are served, or until the eStop button is pushed.
 * Only when the reset button is pushed will the elevator reset.
 *
 */

/**
 * timeout promise waits x number of seconds before allowing the code after it to be executed.
 *
 * @param {number} ms Number of milliseconds to wait before returning.
 */
const timeout = (ms) => {
    // Wait x number of seconds by using a promise.
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Building object keeps track of the people waiting for elevators, people served by elevators,
 * and the elevators themselves.
 */
class Building {
    // Construct the new building object.
    constructor () {
        // Create empty arrays to hold information about the elevators and people served by elevators or waiting
        // for elevators.
        this.people = [];
        this.servedPeople = [];
        this.elevators = [];
    }

    /**
     * Return the building waitlist.
     */
    getWaitlist() {
        return this.people;
    }

    /**
     * Add a person object to the waitlist array.
     *
     * @param {Object} person Person object to add to the building's waitlist.
     */
    addWaitlist(person) {
        // Push the person to the waitlist.
        this.people.push(person);
    }

    /**
     * Remove a person object from the building's elevator waitlist.
     *
     * @param {object} person Object of the person to remove from the waitlist.
     */
    removeWaitlist(person) {
        // Splice the person object out of the waitlist array.
        this.people.splice(person, 1);
    }

    /**
     * Add a person object to the servedPeople array.
     */
    addServed(person) {
        this.servedPeople.push(person);
    }

    /**
     * Return the people served by elevators at the building.
     */
    getServedPeople() {
        return this.servedPeople;
    }

    /**
     * Find the longest wait for an elevator.
     */
    getLongestWait() {
        // Sort the waitlist by the person's wait time.
        return this.people.sort((p, p2) => p2.getWait() - p.getWait());
    }

    /**
     * Return the elevator object that does not have the name of the one passed into the function.
     *
     * @param {String} name Name of the current elevator object.
     */
    getOtherElevator(name) {
        // Loop through the building's elevators.
        for (const e in this.elevators) {
            // Check if the current object in the array has the name of the one passed to the function.
            if (this.elevators[e].name !== name) {
                // Return the elevator object if it does not have the name passed to the function.
                return this.elevators[e];
            }
        }
    }

    /**
     * Add an elevator to the building.
     */
    addElevator(elevator) {
        // Push the passed elevator object to the elevators array.
        this.elevators.push(elevator);
    }
}

class Elevator {
    constructor (building, name, floorMin, floorMax) {
        this.building = building;
        this.name = name;
        this.floorMin = floorMin;
        this.floorMax = floorMax;
        this.doorsOpen = false;
        this.floor = 0;
        this.targetFloor = 0;
        this.passengers = [];
        this.mainPassenger = [];
        this.hasMainPassenger = false;
        this.canCheckFloor = false;
        this.eStopped = false;
        this.started = false;
    }

    /**
     * Adds a person object to the elevator's passenger list.
     *
     * @param {Object} passenger Person object to add the the elevator passenger list.
     */
    addPassenger(passenger) {
        // Push the passenger object to the elevator's passenger array.
        this.passengers.push(passenger);
    }

    async startElevator() {
        // Start the elevator (used for the call button when adding users to the waitlist).
        this.started = true;
        // Grab the building's elevator waitlist.
        const waitlist = this.building.getWaitlist();

        // Make sure the elevator doesn't have the emergency stop button pushed.
        if (!this.eStopped) {
            // Check the number of people in the hotel waiting for an elevator.
            if (waitlist.length > 0) {
                // Check if the elevator has a main passenger (person with the longest wait).
                if (this.mainPassenger.length === 0) {
                    // Check if the elevator has passengers since it does not have a main passenger.
                    if (this.passengers.length === 0) {
                        // Grab info about the other elevator.
                        const otherElevator = this.building.getOtherElevator(this.name);
                        // Grab the building's waitlist.
                        const longestWait = this.building.getLongestWait();
                        // Set a boolean to false so we can see if the elevator can stop or not.
                        let checkedWait = false;

                        // Loop through the waitlist.
                        for (const wait in longestWait) {
                            // Check if the item in the waitlist is undefined.
                            if (longestWait[wait] !== "undefined") {
                                // Grab the current floor and desired floor of the person on the waitlist.
                                const cFloor = longestWait[wait].getCurrentFloor();
                                const dFloor = longestWait[wait].getDesiredFloor();

                                // Check if the elevator is able to serve this person.
                                if ((cFloor >= this.floorMin) && (cFloor <= this.floorMax) && (dFloor >= this.floorMin) && (dFloor <= this.floorMax)) {
                                    // Check if the other elevator is already going to that floor, or if the elevator is not running.
                                    if ((otherElevator.targetFloor !== cFloor) || !otherElevator.started) {
                                        if ((cFloor >= this.floorMin) && (cFloor <= this.floorMax) && (dFloor >= this.floorMin) && (dFloor <= this.floorMax)) {
                                            // Try to move to the target passenger's floor.
                                            await this.moveFloor(longestWait[wait].getCurrentFloor());
                                            // Add the target passenger as the main passenger.
                                            this.mainPassenger.push(longestWait[wait]);
                                            // Set the checkedWait to true so that we don't stop the elevator.
                                            checkedWait = true;
                                            // Break the waitlist loop check.
                                            break;
                                        }
                                    }
                                } else {
                                    // The elevator can't serve this person, so skip over them.
                                    continue;
                                }
                            } else {
                                // Wait 1.2 seconds before starting the elevator again.
                                await timeout(1200);
                                this.startElevator();
                            }
                        }

                        // We've checked all of the passengers in the waitlist, and the elevator is empty. Either the other
                        // elevator is serving the passengers, or we're unable to serve them ourselves. So, stop the elevator.
                        if (!checkedWait) {
                            // Stop the elevator.
                            this.stopElevator();
                            return;
                        }
                    } else {
                        // Move passengers since the elevator currently has at least one passenger.
                        await this.movePassengers();
                    }
                } else {
                    // Move the main passenger since it has the one its looking for.
                    await this.moveMainPassenger();
                }
            } else {
                // Check if the elevator has any current passengers since the waitlist is empty.
                if (this.passengers.length !== 0) {
                    // Move the passengers in the waitlist.
                    await this.movePassengers();
                } else {
                    // Stop the elevator since the waitlist is empty and it has no passengers.
                    this.stopElevator();
                    return;
                }
            }
        } else {
            // Check the floor's passengers if the eStop button is pushed.
            this.checkFloor();
        }

        // Wait 1.2 seconds before starting the elevator checks again. We don't want the elevator to move
        // at superhuman speed.
        await timeout(1200);
        // Restart the elevator checks.
        this.startElevator();
    }

    /**
     * Check if we can stop running the elevator.
     */
    stopElevator() {
        // Log the people served by elevators in the hotel.
        console.log(this.building.getServedPeople())
        // Log that the elevator no longer has people to serve.
        console.log(`${this.name}: Out of people to serve.`);
        // Turn the elevator off.
        this.started = false;
    }

    /**
     * Find the passenger on the elevator with the longest wait and get them to their floor.
     */
    async movePassengers() {
        // Sort the passengers on the elevator to put the one with the longest wait at the front.
        this.passengers.sort((p, p2) => p2.getWait() - p.getWait());
        // Add the passenger with the longest wait to the mainPassenger array.
        this.mainPassenger.push(this.passengers[0]);
        // Set hasMainPassenger to true.
        this.hasMainPassenger = true;
        // Move the main passenger.
        await this.moveMainPassenger();
    }

    /**
     * Move the main passenger in the elevator to their floor. This is the person in the elevator who has
     * waited the longest.
     */
    async moveMainPassenger() {
        // Check if the elevator has the person with the longest wait.
        if (this.hasMainPassenger) {
            // Move the person to their desired floor.
            await this.moveFloor(this.mainPassenger[0].getDesiredFloor());
        } else {
            // Check if the elevator has the person with the longest wait.
            if (this.passengers.some(p => p === this.mainPassenger[0])) {
                // Set hasMainPassenger to true if the elevator has the person with the longest wait.
                this.hasMainPassenger = true;
                // Move to that person's desired floor.
                await this.moveFloor(this.mainPassenger[0].getDesiredFloor());
            } else {
                // Check if the elevator has a main passenger.
                if (this.mainPassenger.length === 0) {
                    // Move the current passengers if the elevator has no main passenger.
                    await this.movePassengers();
                } else {
                    // Go pick up the person with the longest wait.
                    await this.moveFloor(this.mainPassenger[0].getCurrentFloor());
                }
            }
        }
    }

    /**
     * Move the elevator to the target floor while continuously checking if the eStop button has been pressed,
     * or if the elevator has reached the target floor so that the function can quit.
     */
    async moveElevator() {
        // Set the direction of movement based on where the target floor is in relation to the current floor.
        const direction = (this.targetFloor > this.floor) ? 0.01 : -0.01;
        // Let the elevator object know the elevator is moving.
        this.moving = true;

        // Move only if the eStop button has not been pressed.
        if (!this.eStopped) {
            // Check if the elevator is at it's target floor.
            if (this.floor !== this.targetFloor) {
                // Move in the direction of the target floor.
                this.floor = +(this.floor + direction).toFixed(2);
                // Wait 0.01 seconds before checking the elevator's location again by calling the function on itself.
                await timeout(10);
                this.moveElevator();
            } else {
                // The elevator has reached its target floor, so set moving to false.
                this.moving = false;
                // Let the elevator know that it can check if it can drop passenger off and pick up more.
                this.canCheckFloor = true;
                // Perform the floor check.
                await this.checkFloor();
            }
        }
    }

    /**
     * Move the elevator to a desired floor.
     *
     * @param {number} floor Floor to move the elevator to.
     */
    async moveFloor(floor) {
        // Make sure the doors aren't open before trying to move the elevator.
        if (!this.doorsOpen) {
            // Make sure the elevator is not already moving.
            if (!this.moving) {
                // Check if the elevator is already at the target floor.
                if (this.floor !== floor) {
                    // Make sure the elevator can reach the target floor and that the target floor is not the current floor.
                    if ((floor >= this.floorMin) && (floor <= this.floorMax) && (floor !== this.floor)) {
                        // Set the elevator's target floor to the floor number passed.
                        this.targetFloor = floor;
                        // Log that the elevator is now moving.
                        console.log(`${this.name}: Moving to floor #${floor}`);
                        // Move the elevator with the moveElevator function.
                        await this.moveElevator();
                    }
                } else {
                    // Check if the elevator has the main passenger because we are already at the target floor.
                    if (this.hasMainPassenger) {
                        // Set moving back to false.
                        this.moving = false;
                        // Allow the elevator to check the floor.
                        this.canCheckFloor = true;
                        // Perform the floor check.
                        await this.checkFloor();
                    }
                }
            }
        }
    }

    /**
     * Check the floor that the elevator is on to see what passengers on the building's waitlist
     * that it can pick up or drop off at the floor the elevator is at.
     */
    async checkFloor() {
        // Set counters for the number of passengers picked up or dropped off.
        let droppedOff = 0, pickedUp = 0;

        // Make sure the elevator has the ability to check the current floor.
        if (this.canCheckFloor) {
            // Make sure the elevator is not moving.
            if (!this.moving) {
                // Make sure the elevator is at the target floor for passengers.
                if (this.floor === this.targetFloor) {
                    // Check if the elevator doors are already open or not.
                    if (!this.doorsOpen) {
                        // Set the doors to open.
                        this.doorsOpen = true;
                        // Log that the doors are not open.
                        console.log(`${this.name}: Opening Doors.`);
                    }

                    // Grab the building's elevator waitlist.
                    const waitlist = this.building.getWaitlist();

                    // Loop through the waitlist to see who can be picked up.
                    for (const w in waitlist) {
                        // Find the person's current floor and desired floor.
                        const cFloor = waitlist[w].getCurrentFloor();
                        const dFloor = waitlist[w].getDesiredFloor();

                        // Check if the person on the waitlist is on the floor that the elevator is currently at.
                        if (this.floor === cFloor) {
                            // Make sure the elevator can reach the floor the passenger is looking to go to.
                            if ((dFloor >= this.floorMin) && (dFloor <= this.floorMax)) {
                                // If the waitlist passenger currently being looped over has the ID of the main passenger (the
                                // person with the longest wait time), then set hasMainPassenger to true.
                                if (waitlist[w].id === this.mainPassenger[0].id) {
                                    this.hasMainPassenger = true;
                                }

                                // Add the passenger to the elevator's passenger list.
                                this.addPassenger(waitlist[w]);
                                // Remove the passenger from the building's waitlist.
                                this.building.removeWaitlist(waitlist[w]);
                                // Increment the number of passengers picked up at the floor.
                                pickedUp++;
                            }
                        }
                    }

                    // Loop through the elevator's passenger list to see who can be dropped off.
                    for (const p in this.passengers) {
                        // Find the desired floor of the passenger.
                        const dFloor = this.passengers[p].getDesiredFloor();

                        // Check to see if the passenger is looking to get off at the floor the elevator is currently at.
                        if (this.floor === dFloor) {
                            // Check if the elevator still has the main passenger, the person with the longest wait.
                            if (this.mainPassenger.length !== 0) {
                                // If the elevator has the main passenger still, check if it's ID is equal to the
                                // current passenger's ID being looped over.
                                if (this.mainPassenger[0].id === this.passengers[p].id) {
                                    // Reset the main passenger to an empty array if we've found the main passenger and
                                    // let them off the elevator.
                                    this.mainPassenger = [];
                                    // Reset hasMainPassenger to false.
                                    this.hasMainPassenger = false;
                                }
                            }

                            // Call the passenger's arrived function to make changes to their object.
                            this.passengers[p].setArrived(this.name);
                            // Add the passenger to the building's elevator served list.
                            this.building.addServed(this.passengers[p]);
                            // Remove the passenger from the elevator's passenger list.
                            this.passengers.splice(p, 1);
                            // Increment the dropped off counter.
                            droppedOff++;
                        }
                    }

                    // Wait up to 2 seconds to let people off and on the elevator.
                    await timeout(Math.random() * 2000);

                    // Check if the doors are open.
                    if (this.doorsOpen) {
                        // Close the doors and do a few other things.
                        this.resetDoors();
                        // Reset the ability to check the floor to false.
                        this.canCheckFloor = false;
                        // Log the events of the stop.
                        console.log(`${this.name}: Dropped off ${droppedOff} people and picked up ${pickedUp} people. ${this.passengers.length} people are in the elevator.`);
                    }
                }
            }
        }
    }

    /**
     * Emergency stop the elevator to the nearest floor and prevent usage of the elevator until the
     * reset button is pushed.
     */
    eStop() {
        // Find the nearest floor and go to it.
        this.floor = Math.round(this.floor);
        // Set the target floor to the floor we just stopped at.
        this.targetFloor = this.floor;
        // Open the doors.
        this.doorsOpen = true;
        // Set the emergency stop boolean to true so that we can no longer use the elevator until the
        // reset button has been pushed.
        this.eStopped = true;
        // Log the emergency stop.
        console.log(`${this.name}: Emergency Stop at floor #${this.floor}.`);
        // Log that the doors have opened.
        console.log(`${this.name}: Opening Doors.`);
    }

    /**
     * Reset the elevator doors. Function would also be called when the reset button inside the elevator is
     * pushed so that after the emergency stop button has been pressed, the elevator can be used again.
     */
    resetDoors() {
        // Return the emergency stopped boolean to false.
        this.eStopped = false;
        // Return doors to the closed position.
        this.doorsOpen = false;
        // Log that the doors have closed for the elevator.
        console.log(`${this.name}: Closing Doors.`);
    }
}

/**
 * Person class keeps track of information about people trying to use elevators within a building.
 */
class Person {
    // Construct the Person object.
    constructor (currentFloor, desiredFloor) {
        // Generate a random ID for tracking.
        this.id = Math.random() * 1000 * Math.random() * Math.random() * 150;
        // Set the current and desired floor passed to the object.
        this.currentFloor = currentFloor;
        this.desiredFloor = desiredFloor;
        // Set default values about the person.
        this.servedBy;
        this.startWait = Date.now();
        this.arrived = false;
        this.waited = 0;
    }

    /**
     * Update attributes for the person once they get off the elevator.
     *
     * @param {stirng} name Name of the elevator that served the person.
     */
    setArrived(name) {
        // Set the name of the elevator that served the person.
        this.servedBy = name;
        // Update the person object to know that the person has arrived.
        this.arrived = true;
        // Set the total time waiting for an elevator to the time of arrival.
        this.waited = (Date.now() - this.startWait) / 1000;
    }

    /**
     * Return the floor the person is currently at.
     */
    getCurrentFloor() {
        return this.currentFloor;
    }

    /**
     * Return the person's desired floor to take the elevator to.
     */
    getDesiredFloor() {
        return this.desiredFloor;
    }

    /**
     * Return how long the person has been waiting to get to their floor.
     */
    getWait() {
        return Date.now() - this.startWait;
    }
}

// Create a building object.
const hotel = new Building();

// Create two elevator objects.
const elevatorA = new Elevator(hotel, "Elevator A", 0, 10);
const elevatorB = new Elevator(hotel, "Elevator B", 1, 11);

// Add each elevator to the hotel object.
hotel.addElevator(elevatorA);
hotel.addElevator(elevatorB);

/**
 * Add people to the building who need to use the elevators.
 */
const addPeople = async () => {
    // Loop a specified amount of times to add a certain number of people.
    for (let i = 0; i < 100; i++) {
        // Generate a random start and end floor.
        let end = +(Math.random() * 11).toFixed();
        let start = +(Math.random() * 11).toFixed();

        // Check if the end number equals the start number.
        if (end === start) {
            // Check if the end number is the highest floor. Change the end floor to
            // the base floor if so.
            if (end + 1 === 11) {
                end = 0;
            } else {
                end++;
            }
        }

        // Wait a random time before adding the user to the building so that their start time is
        // not the same as anyone else.
        await timeout(Math.random() * 1000);
        // Create the new person object.
        const newPerson = new Person(start, end);
        // Add the new person to the hotel.
        hotel.addWaitlist(newPerson);

        // Start both elevators if neither one is running currently. This could simulate
        // the push of a call button.
        if (!elevatorA.started || !elevatorB.started) {
            // Startup each elevator after 1 second to let the waitlist get populated.
            setTimeout(() => {
                elevatorA.startElevator();
                elevatorB.startElevator();
            }, 1000)
        }
    }
}

// Call the async function addPeople so that we can use the timeout promise.
addPeople();