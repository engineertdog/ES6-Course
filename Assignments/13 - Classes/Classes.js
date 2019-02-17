/**
 * Assignment #13 - Classes
 *
 * A Vehicle superclass is defined with subclasses Car and Plane. Car and Plane have their own drive methods while
 * the Vehicle superclass controls the rest of the information about the vehicle, which includes: trips, maintenance,
 * performing maintenance, and storing information about the vehicle itself. Two objects are created that hold data about
 * cars and planes that we want to drive. There's also a random number generated that is used to define a random number of
 * trips each car or plane will take. The car and plane object is passed to the driveMyVehicles function to create
 * an array of the newly created Car or Plane object for each vehicle, and then drive each vehicle the random number
 * of times. Once the vehicle is done driving, it is pushed to the vehicle array. Once all the vehicles in the object
 * have been driven, the function returns with the array of vehicle objects and their current state. Invoking a Plane object's
 * drive method while it needs maintenace will cause the application to log an error messages stating that maintenance needs to be
 * performed, and the function will return false.
 *
 */

/**
 * Vehicle class takes in a maintenance interval that allows us to set custom maintanence intervals for each
 * Vehicle object created from the class. The Vehicle class controls the maintenance and attributes of the Vehicle
 * created from it. It also has the ability to end a drive since the functionality is common between models that share
 * the Vehicle class.
 */
class Vehicle {
    // Construct a Vehicle object with a passed maintenance interval.
    constructor (maintenanceInterval) {
        // Set the default maintenance, trip, and driving information.
        this.isDriving = false;
        this.totalTrips = 0;
        this.totalMaintenance = 0;
        this.needsMaintenance = false;
        this.tripsSinceMaintenance = 0;
        this.maintenanceInterval = maintenanceInterval;
    }

    /**
     * Set the make of the vehicle.
     *
     * @param {string} make Make of the vehicle
     */
    setMake(make) {
        this.make = make;
    }


    /**
     * Set the model of the vehicle.
     *
     * @param {string} model Model of the vehicle.
     */
    setModel(model) {
        this.model = model;
    }

    /**
     * Set the year of the vehicle.
     *
     * @param {number} year Set the year of the vehicle.
     */
    setYear(year) {
        this.year = parseInt(year);
    }

    /**
     * Set the weight of the vehicle.
     *
     * @param {number} weight Weight of the vehicle.
     */
    setWeight(weight) {
        this.weight = parseInt(weight);
    }

    /**
     * End the vehicle drive.
     */
    endDrive() {
        // Change the driving setting to false.
        this.isDriving = false;
        // Increment the total trips since last maintenance counter.
        this.tripsSinceMaintenance++;
        // Increment the total trips counter.
        this.totalTrips++;

        // Check if the vehicle needs maintenance based on it's maintenance interval.
        if (this.tripsSinceMaintenance === this.maintenanceInterval) {
            // Set needsMaintenance to true so that we know we need to repair the vehicle.
            this.needsMaintenance = true;
        }
    }

    /**
     * Repair the vehicle. Change the maintenance settings for the vehicle and increment a counter for the
     * number of times the vehicle has had maintenance.
     */
    repair() {
        this.needsMaintenance = false;
        this.tripsSinceMaintenance = 0;
        this.totalMaintenance++;
    }
}

/**
 * Car class extends Vehicle class so that a custom drive function can be created.
 * The Car drive function simply allows us to set isDriving to true so that we can drive
 * the car.
 */
class Car extends Vehicle {
    // Construct the Car class by extending the Vehicle class.
    constructor (maintenanceInterval) {
        super(maintenanceInterval);
    }

    // Drive the car.
    drive() {
        // Set isDriving to true to indicate that you're driving the car.
        this.isDriving = true;
        // Return true so that we can check if the car is driving now.
        return true;
    }
}

/**
 * Plane class extends Vehicle class so that a custom drive function can be created.
 * The Plane drive function ensures that the plane is repaired prior to flying, and an
 * error message is logged to the console when attempting to fly an unmaintained plane.
 */
class Plane extends Vehicle {
    // Construct the Plane class by extending the Vehicle class.
    constructor (maintenanceInterval) {
        super(maintenanceInterval);
    }

    // Fly the plane.
    drive() {
        // Check if the plane needs maintenance before attempting to fly.
        if (!this.needsMaintenance) {
            // Set isDriving to true and return true if we can fly the plane.
            this.isDriving = true;
            return true;
        } else {
            // Log an error to show that we need to maintain the plane before flying it.
            console.log("Plane needs to be maintainced prior to driving it.");
            // Return false to show that we cannot fly the plane right now.
            return false;
        }
    }
}

// Generate a random number to be used as the number of times to drive each vehicle
const randomNum = () => {
    const base = Math.round(Math.random() * 100);
    const max = Math.round(Math.random() * 100);
    const min = Math.round(Math.random() * 100);
    return base * Math.abs(max - min) + min;
}

// Create a cars object to hold data about the cars we want to drive.
const myCars = {
    ferrari: {
        type: "Car",
        make: "Ferrari",
        model: "FXX",
        year: 2005,
        weight: 2568,
        numberDrives: randomNum(),
        maintenanceInterval: 25
    },
    pickup: {
        type: "Car",
        make: "Chevrolet",
        model: "K10",
        year: 1987,
        weight: 4000,
        numberDrives: randomNum(),
        maintenanceInterval: 50
    },
    sti: {
        type: "Car",
        make: "Subaru",
        model: "WRX STi",
        year: 2017,
        weight: 3391,
        numberDrives: randomNum(),
        maintenanceInterval: 100
    }
};

// Create a planes object to hold data about the planes we want to fly.
const myPlanes = {
    plane1: {
        type: "Plane",
        make: "Cessna",
        model: "208 Caravan",
        year: 2013,
        weight: 4729,
        numberDrives: randomNum(),
        maintenanceInterval: 25
    },
    plane2: {
        type: "Plane",
        make: "Cessna",
        model: "172 Skyhawk",
        year: 2013,
        weight: 1669,
        numberDrives: randomNum(),
        maintenanceInterval: 40
    },
    plane3: {
        type: "Plane",
        make: "Bombarier",
        model: "Learjet 35",
        year: 2015,
        weight: 3500,
        numberDrives: randomNum(),
        maintenanceInterval: 30
    }
};

/**
 * Create an array of Vehicle objects (either planes or cars) and drive them a random number of times. Return
 * the resulting array object so we can see the status of the vehicles passed to the function.
 *
 * @param {object} myVehicles Object of vehicle to drive.
 */
const driveMyVehicles = (myVehicles) => {
    // Create an empty vehicle object.
    const vehicleObjs = [];

    // Loop through all of the vehicles in the passed object.
    for (const v in myVehicles) {
        // Create an empty reference for the object that will be created.
        let cVehicle;

        // Check the type of the vehicle and create the corresponding object, and pass the maintenance interval of the
        // vehicle.
        if (myVehicles[v].type === "Plane") {
            cVehicle = new Plane(myVehicles[v].maintenanceInterval);
        } else {
            cVehicle = new Car(myVehicles[v].maintenanceInterval);
        }

        // Set information about the vehicle.
        cVehicle.setMake(myVehicles[v].make);
        cVehicle.setModel(myVehicles[v].model);
        cVehicle.setYear(myVehicles[v].year);
        cVehicle.setWeight(myVehicles[v].weight);

        // Loop until the randomized number of drives for the vehicle is met.
        for (let i = 0; i <= myVehicles[v].numberDrives; i++) {
            // Check if we can drive the vehicle.
            if (cVehicle.drive()) {
                // We are now driving the vehicle. Check if it needs maintenance.
                if (cVehicle.needsMaintenance) {
                    // Repair the vehicle if it needs maintenance.
                    cVehicle.repair();
                }

                // End the vehicle's drive.
                cVehicle.endDrive();
            } else {
                // Repair the vehicle if we are unable to drive it due to needing maintenance.
                cVehicle.repair();
            }
        }

        // Add the current vehicle to the vehicle object.
        vehicleObjs.push(cVehicle);
    }

    // Return the vehicle object.
    return vehicleObjs;
}

// Set constants to the returned object of driveMyVehicles for each object passed to it.
const myCarObj = driveMyVehicles(myCars);
const myPlaneObj = driveMyVehicles(myPlanes);

// Log the results of each returned car / plane object.
console.log(myCarObj);
console.log(myPlaneObj);