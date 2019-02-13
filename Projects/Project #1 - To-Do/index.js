/**
 * Project #1 - To-Do Application
 *
 * The application herein allows users to create To-Do Lists and attach tasks to each list. The application uses localStorage to store
 * the user and task data. It is able to support many users with the way data is stored. Users have to sign up with unique emails, and all
 * forms on the application are validation backed, with the exception of the login form. Once the user is logged in, they are able to see
 * all of the To-Do Lists they have created. The name of the list is shown along with how many complete and incomplete tasks there are.
 * They are then able to view the To-Do Task List, or delete it (confirmation for delete could be added with a modal, but was not implemented).
 * When a user views an existing To-Do list, they are able to make any change they want to. This includes re-naming it to whatever they want, and
 * adding or removing as many tasks they want to. To-Do Lists can be named whatever the user wants them to be, so these are not unique. This is
 * typical for real-world applications. The user is aslo able to change their settings including their first name, last name, email, and password.
 * The user can change their email so long as the email they want to use is not already in use. When the user updates their email to a new one,
 * it also updates the task list object in storage so that the user still has access to the To-Do Lists they have created.
 *
 */

// User information for logged in session.
let userData = [];
// Logged in tracker
let loggedIn = false;
// Tracker for the previous page visited, used for formatting since this is a one page application.
let oldPage = "intro";

// Validation rule object. This would normally come from a JSON file or from a database.
const validationRules = {
    registerFirstName: {
        min: {
            value: 5,
            text: "First name must be at least 5 characters"
        },
        max: {
            value: 25,
            text: "First name can only be 25 characters"
        }
    },
    registerLastName: {
        min: {
            value: 3,
            text: "Last name must be at least 3 characters"
        },
        max: {
            value: 30,
            text: "Last name can only be 30 characters"
        }
    },
    registerEmail: {
        text: "Please enter a valid email"
    },
    registerPassword: {
        min: {
            value: 5,
            text: "Password must be at least 5 characters"
        },
        max: {
            value: 50,
            text: "Passwords have a limit of 50 characters"
        }
    },
    registerTerms: {
        text: "Please agree to the terms of use"
    },
    todoListName: {
        min: {
            value: 5,
            text: "Task List name must be at least 5 characters."
        },
        max: {
            value: 255,
            text: "Task List name can't be more than 255 characters."
        }
    },
    requiredTask: {
        min: {
            value: 1,
            text: "Task List requires at least one task."
        },
        max: {
            value: 255,
            text: "Task item can't be more than 255 characters."
        }
    },
    taskItem: {
        min: {
            value: 1,
            text: "Task item must be at least 1 character."
        },
        max: {
            value: 255,
            text: "Task item can't be more than 255 characters."
        }
    },
    alias: {
        "firstName": "registerFirstName",
        "lastName": "registerLastName",
        "email": "registerEmail",
        "password": "registerPassword"
    }
}

/**
 * A user changes pages in this one page application by starting with this function. The function
 * takes the triggering object and checks what it is to determine what page to show. We hide the
 * logged in pages and related navbar info when the user logs out, or we hide the guest pages when
 * the user is logged in.
 *
 * @param {object} e Node triggering to change the screen. Typically a button.
 */
const changeScreen = (e) => {
    // Set the target to t for easier calling
    const t = e.target;
    // Set the target id to id for easier calling
    const id = t.id;

    // If the node clicked was the github button, we return from the function to allow the user to
    // visit the link. Otherwise, we prevent the default action of links.
    if (id === "github") {
        return;
    } else {
        e.preventDefault();
    }

    if (oldPage === "loginUser") {
        loginError.classList.add("d-none");
        loginError.innerText = "";
    }

    if (oldPage === "registerUser") {
        registerError.classList.add("d-none");
        registerError.innerText = "";
    }

    if (oldPage === "settingsPage") {
        settingsError.classList.add("d-none");
        settingsError.classList.remove("alert-danger", "alert-success", "alert-info");
        settingsError.innerText = "";
    }

    if (oldPage === "todoListPage") {
        todoTaskForm.querySelector("#taskNum").value = 0;
        todoListError.classList.remove("alert-success");
        todoListError.classList.add("alert-danger", "d-none");
        todoListError.innerText = "";
        resetTodoListForm();
    }

    // Set the previous page to the new page's ID. We need to set this here because when the user
    // clicks on the "View List" button for tasks, it will incorrectly set the id. This is fixed in
    // the pageDisplay function with this set up here.
    oldPage = id;

    // Display the correct page, and perform other functions, based on the button the user clicked.
    if (t.classList.contains("guestButton")) {
        // Display the correct guest page when the user is logged out.
        pageDisplay(guestPage, id);
    } else if (t.classList.contains("userButton")) {
        // This section could be reduced, but, the order of events is important because delays could
        // cause display issues.

        // User clicks logout button.
        if (id === "logoutButton") {
            // Make all of the logged in pages disappear.
            pageDisplay(userPage, id);
            // Send the user back to the intro to the application.
            pageDisplay(guestPage, "intro", id);
            // Display the correct buttons for the user to be logged out.
            buttonDisplay();
            // Return from the function because we don't want to check the functions below.
            return;
        }

        // If the user just logged in, hide the guest pages and change the buttons displayed.
        if (!loggedIn) {
            pageDisplay(guestPage, id);
            buttonDisplay();
        }

        // Display the correct logged in page.
        pageDisplay(userPage, id);
    } else if (t.classList.contains("taskViewButton")) {
        // This is invoked when the user clicks on "View List" button on the To-Do List page.
        // This will correctly display the edit form for the select To-Do List.
        pageDisplay(userPage, "todoListPage", null, "Edit");
        // Set the form up to display the selected To-Do's List to be edited.
        displayTaskListItems(t.id);
    }
}

/**
 * Loop through all of the guestButtons and userButtons to show or hide them depending on what their
 * current state is. We also toggle the loggedIn variable to indicate whether or not the user is logged
 * into the application.
 */
const buttonDisplay = () => {
    // Loop through the guestButtons to show / hide them.
    for (const button of guestButtons) {
        button.classList.toggle("d-none");
    }

    // Loop through the userButtons to show / hide them.
    for (const button of userButtons) {
        button.classList.toggle("d-none");
    }

    // Toggle whether the user is logged in or not.
    loggedIn = !loggedIn;

    // If the user becomes logged out, empty the userData variable.
    if (!loggedIn) {
        userData = [];
    }
}

/**
 * Display the page the user intends to view based on the button clicked. The HTML collection of
 * pages to check is passed and looped through.
 *
 * @param {object} pages HTML Collection of pages to loop through.
 * @param {string} id ID of the desired page to view.
 * @param {string} button Triggering button.
 * @param {string} todoAction Action to control the To-Do List form header.
 */
const pageDisplay = (pages, id, button = null, todoAction = null) => {
    // Loop through collection.
    for (const page of pages) {
        // Set the classlist to a variable for easier usage.
        const classes = page.classList;

        // If the page does not have the d-none class, add it.
        if (!classes.contains("d-none")) {
            classes.add("d-none");
        }

        // If the current item in the HTML collection is the one we want to view, do a few things.
        if (classes.contains(id)) {
            // First, remove the d-none class so we can view the page.
            classes.remove("d-none");

            // Switch the ID to perform additional actions.
            switch (id) {
                case "loginUser":
                    // Set the focus to the email field on the login page.
                    forms.querySelector("#loginEmail").focus();
                    break;
                case "registerUser":
                    // Set the focus to the first name field on the register page.
                    forms.querySelector("#registerFirstName").focus();
                    break;
                case "dashboardPage":
                    // Get the list of To-Do Lists for the current user.
                    getToDolist();
                    break;
                case "todoListPage":
                    // Set focus to the To-Do List name.
                    forms.querySelector("#todoListName").focus();
                    // Set the previous page variable to the To-Do List form page. This is because
                    // when the user clicks the "View List" button on the Dashboard, this variable
                    // get set to the wrong value otherwise.
                    oldPage = "todoListPage";

                    // Set the header of the To-Do List form page.
                    if (todoAction === null) {
                        todoListHeader.innerText = "Create List";
                    } else {
                        todoListHeader.innerText = "Edit List";
                    }
                    break;
                case "settingsPage":
                    // Set focus to the first name field on the settings page.
                    forms.querySelector("#firstName").focus();

                    // Loop through the userData variable and set the settings input fields to
                    // the value of the setting in the userData variable.
                    for (const d in userData) {
                        forms.querySelector("#" + d).value = userData[d];
                    }

                    break;
            }
        }

        // Help the user to see the intro page of the application when they click logout.
        if ((button === "logoutButton") && (page.id === id)) {
            classes.remove("d-none");
        }
    }
}

/**
 * Function handles the login actions when the login form is submitted.
 *
 * @param {object} e Form node
 */
const doLogin = (e) => {
    // Set the form target to t
    const t = e.target;
    // Grab the user's data list from storage. Normally, this would be from a database.
    const users = JSON.parse(localStorage.getItem("users"));
    // Set email to an variable for easier use
    let email = t.loginEmail.value;
    // Set continue login to false so we can reject or accept the login.
    let contLogin = false;
    // Reset the login error div attributes.
    loginError.classList.add("d-none");
    loginError.innerText = "";

    // If the users object exists in storage, look to see if the user exists
    if (users) {
        // If the email entered is in the user object, continue to see if they can log in
        if (typeof users[email] !== "undefined") {
            contLogin = true;
        }
    }

    // Let the user log in, or show an error message
    if (contLogin) {
        // Check the user password against the user object
        if (t.loginPassword.value === users[email].password) {
            // Copy the user's data from the users object to a global variable userData for access throughout the application.
            userData = Object.assign({}, users[email]);
            // Simulate a click on the dashboardButton to simulate changing pages.
            dashboardButton.click();
            // Reset the login form.
            t.reset();
        } else {
            // Display an error message if the user entered an invalid password for their account.
            loginError.classList.remove("d-none");
            loginError.innerText = "Your password is incorrect.";
        }
    } else {
        // Show an error message if the user's email is not in the user object
        loginError.classList.remove("d-none");
        loginError.innerText = "There is no account associated with that email.";
    }
}

/**
 * Function handles the register actions when the register form is submitted.
 *
 * @param {object} e Form node
 */
const doRegister = (e) => {
    // Set the form target to t
    const t = e.target;
    // Validate the form
    const register = doValidation(e.target);
    // Set a function continue variable to false initally so checks can be performed.
    let contRegister = false;
    // Reset the register error div attributes.
    registerError.classList.add("d-none");
    registerError.innerText = "";

    // If the form has no errors, continue. Errors will be displayed by default through the function called by register.
    if (register) {
        // Set the entered email to a re-useable variable
        const email = t.registerEmail.value;
        // Grab the user object from storage. Normally, this would be from a database.
        const existingUsers = JSON.parse(localStorage.getItem("users"));

        // If there are no users yet, continue.
        if (existingUsers === null) {
            contRegister = true;
        } else {
            // If the email entered does not exist in the user object, continue. This will be true when the existing users object is null.
            if (existingUsers[email] === null) {
                contRegister = true;
                // If the email entered does not exist in the user object, continue. This will be true when there are existing users and the user object is not null.
            } else if (typeof existingUsers[email] === "undefined") {
                contRegister = true;
            }
        }

        // Continue if the email is not already used.
        if (contRegister) {
            // Copy the user object to a new variable.
            const user = Object.assign({}, existingUsers);
            // Create a new entry for the user object with the key being the user's email.
            user[email] = {
                firstName: t.registerFirstName.value,
                lastName: t.registerLastName.value,
                email: email,
                password: t.registerPassword.value
            };

            // Set the user object in storage to the new user object with the newly created user.
            localStorage.setItem("users", JSON.stringify(user));
            // Copy the user data to a global variable for use throughout the application.
            userData = Object.assign({}, user[email]);
            // Simulate a click on the dashboardButton to simulate changing pages.
            dashboardButton.click();
            // Reset the register form.
            t.reset();

            // Remove the validation attributes from the register form inputs.
            for (const i of t) {
                i.classList.remove("is-valid", "is-invalid");
            }
        } else {
            // Display an error if the selected email is already in use.
            registerError.classList.remove("d-none");
            registerError.innerText = "That email is already in use.";
        }
    }
}

/**
 * Grab the To-Do Lists for the current user.
 */
const getToDolist = () => {
    // Set continue to false so we can perform checks.
    let contLists = false;
    // Grab the taskList object from storage. Normally, this would be from a database.
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    // Initialize a variable to hold the HTML for the To-Do Lists to be displayed.
    let taskHolder = "";

    // Check if the taskList object exists.
    if (taskList) {
        // If the user has task lists saved at one point, continue.
        if (typeof taskList[userData.email] !== "undefined") {
            // If the user actually has task lists, and hasn't deleted them all, then show their tasks.
            if (Object.keys(taskList[userData.email]).length !== 0) {
                contLists = true;
            }
        }
    }

    // Continue if the user has content to show.
    if (contLists) {
        // Loop through the user's task lists
        for (const listData in taskList[userData.email]) {
            // Setup a variable for easier data access.
            const taskListItem = taskList[userData.email][listData];
            // Setup a counter for complete and incomplete tasks.
            let complete = incomplete = 0;

            // Loop through each task in the To-Do Task List and increment the complete or incomplete counter
            // based on whether the task has been checked as done.
            for (const i in taskListItem.tasks) {
                if (taskListItem.tasks[i].done) {
                    complete++;
                } else {
                    incomplete++;
                }
            }

            // Add the task to the HTML variable so it can be displayed.
            taskHolder +=
                "<li class='list-group-item d-flex justify-content-between align-items-center'>" +
                "   <div>" +
                "       <span class='badge badge-success badge-pill px-2 mr-2 py-1'> " + complete + "</span>" +
                "       <span class='badge badge-danger badge-pill px-2 mr-2 py-1'> " + incomplete + "</span>" +
                taskListItem.taskName +
                "   </div>" +
                "   <div>" +
                "       <button id='list-" + listData + "' type='button' class='btn btn-custom taskViewButton'>View List</button>" +
                "       <button id='del-" + listData + "' type='button' class='btn btn-danger taskDeleteButton'>Delete List</button>" +
                "   </div>" +
                "</li>";
        }

        // Add the To-Do Task List HTML content to the page.
        todoListContainer.innerHTML = taskHolder;
    } else {
        // Show a message if the user has no task lists.
        todoListContainer.innerHTML = "<p>You currently do not have any To-Do Lists made. Create one now!</p>"
    }
}

/**
 * Function taks in the ID of the task list to be displayed. The same form is used for both To-Do Task List creation and editing.
 * This form enables the ability to use the same form and populates it with the right data.
 *
 * @param {string} id String ID of the To-Do Task List to be displayed.
 */
const displayTaskListItems = (id) => {
    // Grab the ID string and extract the number from the string (in format list-####).
    id = id.substring(5, id.length);
    // Grab the taskList object from storage. Normally, this would be from a database.
    const taskList = JSON.parse(localStorage.getItem("taskList"));

    // Continue if the task list exists.
    if (taskList[userData.email][id] !== "undefined") {
        // Set the To-Do Task List to a variable for easier access
        const thisTaskList = taskList[userData.email][id];
        // Set the form's taskNum hidden input to the list's number so it can be updated.
        todoTaskForm.querySelector("#taskNum").value = id;
        // Set the name of the task list in the form.
        todoTaskForm.querySelector("#todoListName").value = thisTaskList.taskName;
        // At least one task is required to create a list, so we set this required input's task name and done attribute to the first
        // item from the task list.
        todoTaskForm.querySelector("#requiredTask").value = thisTaskList.tasks[0].task;
        todoTaskForm.querySelector("#requiredTaskDone").checked = thisTaskList.tasks[0].done;

        // Loop through the task list's tasks.
        for (const i in thisTaskList.tasks) {
            // Do not include the first item as this was set above.
            if (parseInt(i) !== 0) {
                // Set the done variable to checked or an empty string based on whether the task was marked done or not.
                const checked = thisTaskList.tasks[i].done ? "checked" : "";
                // Add the task item to the page.
                addTaskItem(checked, thisTaskList.tasks[i].task, i)
            }
        }
    }
}

/**
 * Create a new task item for the To-Do Task List form. When adding the node when creating a new To-Do List, we do not mark
 * the task as done by default, and we set the value of the task item to an empty string. Otherwise, these variables are used
 * when viewing an existing To-Do Task List so that the appropriate entries can be shown.
 *
 * @param {string} taskDone String of empty string or 'checked' so indicate task completion.
 * @param {string} taskValue Value of the task item. Empty by default.
 * @param {number} taskNum Value of the task item index.
 */
const addTaskItem = (taskDone = "", taskValue = "", taskNum = "") => {
    // If we're adding a new element with the button and not because the function is being called by the view task function,
    // then we want to grab the current highest taskItemNum from the form and use that + 1 for the new form element.
    if (taskValue === "") {
        taskNum = parseInt(taskItemNum.value) + 1;
    }

    // Create a new page element.
    const newItem = document.createElement("div");
    // Add the required class to the new element.
    newItem.classList.add("list-group");
    // Set the HTML of new element to the required HTML.
    newItem.innerHTML =
        "<div class='input-group'>" +
        "   <div class='input-group-prepend'>" +
        "       <div class='input-group-text'>" +
        "           <input type='checkbox' class='taskItemDone' " + taskDone + " />" +
        "       </div>" +
        "   </div>" +
        "   <input type='text' class='form-control taskItem' placeholder='Task' value='" + taskValue + "' data-taskNum='" + taskNum + "' />" +
        "   <div class='input-group-append'>" +
        "       <div class='input-group-text'>" +
        "           <button type='button' class='btn btn-danger deleteTaskItem'><i class='far fa-trash-alt'></i></button>" +
        "       </div>" +
        "   </div>" +
        "</div>" +
        "<div id='task-" + taskNum + "' class='invalid-feedback'></div>";

    // Update the taskItemNum to the new value.
    taskItemNum.value = taskNum;

    // Append the new element to the task form.
    taskItemContainer.appendChild(newItem);
    // Set focus to the newly created input.
    newItem.querySelector(".taskItem").focus();
}

/**
 * Function deletes a task input node. Can either be invoked through clicking the deleteTaskItem button for an input, or through looping each delete button
 * which is done on form save or page change.
 *
 * @param {object} e Task Input Node to be deleted
 */
const deleteTaskItem = (e) => {
    // The function can be invoked with a form element or a button, so set the target here that we'll set with an IF statement below.
    let t;

    // If the node that invoked the function was a form, classlist will be undefined. Set the target to 'e' for when button nodes
    // invoke the function, otherwise set it it to e.target for forms.
    if (typeof e.classList !== "undefined") {
        t = e;
    } else {
        t = e.target;
    }

    // Check if the node that triggered the function has the deleteTaskItem or trash can 'fa' icon. This means the user wanted to
    // remove the task item from the form.
    if (t.classList.contains("deleteTaskItem") || t.classList.contains("fa-trash-alt")) {
        // Find the task item's parent container.
        const container = t.closest(".list-group");

        // If the container is not the required one for the form, remove it from the page.
        if (container.id !== "noDeleteTask") {
            // Decrease task item counter by 1 for form validation purposes.
            taskItemNum.value--;
            container.remove();
        }
    }
}

/**
 * Handles the actions for when the To-Do Task List form is submitted.
 *
 * @param {object} e Form node
 */
const saveTodoList = (e) => {
    // Set the target element to a re-usable variable
    const t = e.target;
    // Set the task list to an empty array.
    const tasks = [];
    // Set a counter for the task items.
    let count = 0;

    // Grab all of the task items and the checkbox that indicates if a task is done
    const taskItems = taskItemContainer.getElementsByClassName("taskItem");
    const taskDone = taskItemContainer.getElementsByClassName("taskItemDone");

    // Loop through the form elements.
    for (const i of t) {
        // If the element has the class taskItem, add it to the tasks array
        if (i.classList.contains("taskItem")) {
            // Add the current (based on count) task to the task array. This will only run for form elements that have
            // the taskItem class, so this will not capture invalid data, and we can use the index of the taskItems and
            // taskDone objects because of this.
            tasks.push({
                done: taskDone[count].checked,
                task: taskItems[count].value
            });

            // Increment the task counter
            count++;
        }
    }

    // Grab the taskList object from storage. Normally, this would be from a database.
    const existingTasks = JSON.parse(localStorage.getItem("taskList"));

    // If there are no tasks, allow creation.
    if (existingTasks === null) {
        taskNum = 1;
    } else {
        // If the user has not created any task lists yet, set the index of the task list to 1.
        if (typeof existingTasks[userData.email] === "undefined") {
            taskNum = 1;
        } else {
            // If we're adding a task list, we want to get the number of task lists the user has created, from the
            // task list object, and add one to create the new task list.
            if (e.target.taskNum.value == 0) {
                taskNum = Object.keys(existingTasks[userData.email]).length + 1;
            } else {
                // If we're editing a task list, we want to grab the task list's index.
                taskNum = e.target.taskNum.value;
            }
        }
    }

    // Copy the task list object to a new variable.
    const myTasks = Object.assign({}, existingTasks);

    // If the user has not created any tasks yet, set their task list object to an empty object.
    if (typeof myTasks[userData.email] === "undefined") {
        myTasks[userData.email] = {};
    }

    // Set the added, or edited, task list to the user's task list object.
    myTasks[userData.email][taskNum] = {
        taskName: e.target.todoListName.value,
        tasks: tasks
    }

    // Set the task list object to the modified task list object.
    localStorage.setItem("taskList", JSON.stringify(myTasks));
    // Tell the user we have added their task list.
    todoListError.innerText = "We have saved your To-Do List.";
    todoListError.classList.add("alert-success");
    todoListError.classList.remove("alert-danger", "d-none");
    // Reset the task list form with the function below.
    resetTodoListForm();
}

/**
 * Delete a To-Do Task List from the task list object.
 *
 * @param {object} e
 */
const deleteTaskList = (e) => {
    // Set the event target to t
    const t = e.target;

    // If the target event has the class taskDeleteButton, then the user likely wanted to delete the respective To-Do Task List.
    if (t.classList.contains("taskDeleteButton")) {
        // Grab the taskList object from storage. Normally, this would be from a database.
        const taskList = JSON.parse(localStorage.getItem("taskList"));
        // Find the parent container for the selected To-Do Task List.
        const container = t.closest(".list-group-item");
        // Remove the element from the page.
        container.remove();

        // Grab the ID from the string ID stored in the button (in format del-####).
        const id = t.id.substring(4, t.id.length);
        // Delete the task list from the task list object.
        delete taskList[userData.email][id];
        // Updated the task list object with the deleted entry.
        localStorage.setItem("taskList", JSON.stringify(taskList));

        // Check to see if the user has deleted all of their To-Do Task Lists.
        if (Object.keys(taskList[userData.email]).length === 0) {
            // Show a message if the user has no more task lists.
            todoListContainer.innerHTML = "<p>You currently do not have any To-Do Lists made. Create one now!</p>"
        }
    }
}

/**
 * Reset the To-Do Task List form
 */
const resetTodoListForm = () => {
    // Loop through the delete buttons to invoke the deleteTaskItem function in order to actually delete each task input.
    for (const delButton of taskItemContainer.getElementsByClassName("deleteTaskItem")) {
        // Use setTimeout to avoid not deleting all of the task input nodes.
        setTimeout(() => {
            deleteTaskItem(delButton);
        }, 100);
    }

    for (const i of todoTaskForm) {
        i.classList.remove("is-valid", "is-invalid");
    }

    // Reset the remaining form elements.
    todoTaskForm.reset();
}

/**
 * Handle the submittal of the settings form.
 *
 * @param {object} e Settings form node
 */
const doSettings = (e) => {
    // Set the form to a re-useable variable.
    const t = e.target;
    // Validate the form elements.
    const settings = doValidation(e.target);
    // Set a continue value to true that can be changed to false after checking a few things.
    let contSettings = true;
    // Rset the settings form error div.
    settingsError.classList.add("d-none", "alert-danger");
    settingsError.classList.remove("alert-info", "alert-success");
    settingsError.innerText = "";

    // If the form elements all passed validation checks, continue. Errors will be displayed by default.
    if (settings) {
        // Set a variable to the user's old email from the userData object.
        const oldEmail = userData.email;
        // Capture the email entered on the form.
        const email = t.email.value;
        // Grab the user object from storage.
        const existingUsers = JSON.parse(localStorage.getItem("users"));

        // If the user object exists, continue.
        if (existingUsers) {
            // If the user object does not contain the object for the user with the old email, return false. This should always be true though
            // because we have no way to delete users in this application, unless the user deletes their localstorage while logged in.
            if ((existingUsers[oldEmail] === null) || (typeof existingUsers[oldEmail] === "undefined")) {
                contSettings = false;
            }
        }

        // Continue if the user object for the old email is found.
        if (contSettings) {
            // Copy the user object to a new variable
            const user = Object.assign({}, existingUsers);
            // Set the user's object in the user object to the values from the settings form
            user[email] = {
                firstName: t.firstName.value,
                lastName: t.lastName.value,
                email: email,
                password: t.password.value
            };

            // Compare the old user object against the new user object for the current user to check for changes. Continue with
            // changing the settings if the two are different.
            if (JSON.stringify(user[email]) !== JSON.stringify(existingUsers[oldEmail])) {
                // Set a variable for being able to change emails to true initially.
                let canChangeEmail = true;

                // Check if the email entered on the form is different from their old email.
                if (email !== oldEmail) {
                    // Loop through the users in the user object to see if the email they want to change to is available.
                    for (const loopedUser in existingUsers) {
                        // If the email the user wants exists already, set a variable to false to display the correct message.
                        if (email === loopedUser) {
                            canChangeEmail = false;
                        }
                    }

                    // If the user is able to use a new email, update some info.
                    if (canChangeEmail) {
                        // Delete the old user object.
                        delete user[oldEmail];
                        // Grab the task list object from storage.
                        const taskList = JSON.parse(localStorage.getItem("taskList"));

                        // If the user has created task lists at some point, update the task list object.
                        if ((typeof taskList[oldEmail] !== "undefined")) {
                            // Copy the old user task list object to the new email.
                            taskList[email] = taskList[oldEmail];
                            // Delete the old user task list object.
                            delete taskList[oldEmail];
                            // Update the task list object in storage.
                            localStorage.setItem("taskList", JSON.stringify(taskList));
                        }
                    }
                }

                // If the user can change their email, or by default, continue.
                if (canChangeEmail) {
                    // Update the user object in storage.
                    localStorage.setItem("users", JSON.stringify(user));
                    // Set the userData to the new user object for the current user.
                    userData = user[email];

                    // Alert the user that their settings have changed.
                    settingsError.classList.add("alert-success");
                    settingsError.classList.remove("alert-danger", "d-none");
                    settingsError.innerText = "We have updated your settings";

                    // Loop through the settings form and remove validation styling.
                    for (const i of t) {
                        i.classList.remove("is-valid", "is-invalid");
                    }
                } else {
                    // Display a message to the user if the email they wanted to change to is already in use.
                    settingsError.classList.remove("d-none");
                    settingsError.innerText = "That email is already in use";
                }
            } else {
                // Display a message to the user if they have not changed any settings.
                settingsError.classList.add("alert-info");
                settingsError.classList.remove("alert-danger", "d-none");
                settingsError.innerText = "You have not changed any setting";
            }
        } else {
            // Display an error to the user that their account doesn't exist.
            settingsError.classList.remove("d-none");
            settingsError.innerText = "We couldn't find your account.";
        }
    }
}

/**
 * Validate a form input element on change (blur), or when a form is submitted.
 *
 * @param {object} inputs Can be a full form or an individual form input node.
 */
const doValidation = (inputs) => {
    // Set the return to true so that it only has to be set to false once to return false.
    let cont = true;

    // If the type of the inputs object is change, then it is a single form input node that has been triggered
    // by the form change listen event. Otherwise, it is a form submit event.
    if (inputs.type === "change") {
        // Ignore validation for the login form because when the form is submitted, it will take care of checking the values. We don't
        // need to validate the login form values when the form element is changed. Did not set up form validation for the To-Do Task List form.
        if (inputs.target.form.id !== "loginForm") {
            validateInputs(inputs.target);
        }
    } else {
        // Loop through the form inputs.
        for (const input of inputs) {
            // Validate the individual form element to check for errors.
            const error = validateInputs(input);

            // If the form element has errors, then the function will return false to indicate this.
            if (error) {
                cont = false;
            }
        }
    }

    // Return true / false based on if all of the inputs have passed validation.
    return cont;
}

/**
 * Validate form input nodes
 *
 * @param {object} formItem Form input node to validate
 */
const validateInputs = (formItem) => {
    // Set the function return initially to false
    let errors = false;
    let errorText;
    let nodeID = formItem.id;

    // Following IF statement is used for the To-Do Task List form since it works differently than other forms.
    if ((formItem.classList.contains("taskItem")) || formItem.classList.contains("taskItemDone")) {
        // If the form element is a checkbox, skip validation as it's not needed.
        if (formItem.type === "checkbox") {
            return;
        }

        // If the form element's ID is blank (which is all added elements), then set the errorText to the proper node.
        if (nodeID === "") {
            errorText = forms.querySelector("#task-" + formItem.dataset.tasknum);
            nodeID = "taskItem";
        }
    }

    // Set a variable to the length of the form input value.
    const iLength = formItem.value.length;

    if (typeof errorText === "undefined") {
        // Grab the form input's ID to grab it's respective error div.
        errorText = forms.querySelector("#" + nodeID + "Error");
    }

    // Do nothing if the input is the submit button
    if (formItem.type !== "submit") {
        // Set item to the object from the validation rules based on the form input's ID. This object contains
        // all of the validation rules for the form input to be checked. Aliases are also used for items
        // that utilize the same data as other inputs for validation.
        const item = validationRules[nodeID] || validationRules[validationRules.alias[nodeID]];
        // Remove the form input's validation classes in case it has any.
        formItem.classList.remove("is-invalid", "is-valid");
        // Reset the form input's error div.
        errorText.innerText = "";
        errorText.classList.remove("d-block");

        // item.text grabs the form input's error text
        // Same for item.min.text and item.max.text. We use the object to grab the respective
        if (formItem.type === "checkbox") {
            // Make all check boxes required to be checked
            if (!formItem.checked) {
                errorText.innerText = item.text;
                errors = true;
            }
        } else if (formItem.type === "email") {
            // Email regex, can use others though.
            const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

            // Show an error if the email does not meet the regex requirements.
            if (!regex.test(formItem.value)) {
                errorText.innerText = item.text;
                errors = true;
            }
        } else {
            // We can put more validation rule checks here, but min and max length are the only ones for now.

            // Check the min length and then the max length. Error if either one fails.
            if (item.min.value > iLength) {
                errorText.innerText = item.min.text;
                errors = true;
            } else if (item.max.value < iLength) {
                errorText.innerText = item.max.text;
                errors = true;
            }
        }
    }

    if (errors) {
        // Style the form input to show it is in error.
        formItem.classList.add("is-invalid");
        // Show the form input's error div.
        errorText.classList.add("d-block");
        // Return true to indicate the form input has errors.
        return true;
    } else {
        // Style the form input to show it is valid.
        formItem.classList.add("is-valid");
        // Return false to indicate the form input is valid based on our rules.
        return false;
    }
}

/**
 * Direct the application to the proper form submit function based on which form was submitted.
 *
 * @param {object} e Form submit event
 */
const doFormActions = (e) => {
    // Prevent form submit.
    e.preventDefault();
    // Set id of the form to re-usable variable
    const id = e.target.id;

    // Send the application to the right form submit function.
    if (id === "loginForm") {
        doLogin(e);
    } else if (id === "registerForm") {
        doRegister(e);
    } else if (id === "todoTaskForm") {
        saveTodoList(e);
    } else if (id === "settingsForm") {
        doSettings(e);
    }
}

// DOM References
const navbar = document.getElementById("navbar");
const guestPage = document.getElementsByClassName("guestPage");
const userPage = document.getElementsByClassName("userPage");
const guestButtons = document.getElementsByClassName("guestButton");
const userButtons = document.getElementsByClassName("userButton");
const dashboardButton = document.getElementById("dashboardPage");
const dashboardPage = document.getElementById("dashboard");
const forms = document.getElementById("pageContainer");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const todoListError = document.getElementById("todoListError");
const settingsError = document.getElementById("settingsError");
const createTodoListButton = document.getElementById("todoListPage");
const todoListContainer = document.getElementById("todoListContainer");
const todoListHeader = document.getElementById("todoListHeader");
const todoTaskForm = document.getElementById("todoTaskForm");
const taskItemNum = document.getElementById("taskItemNum");
const taskItemContainer = document.getElementById("taskItemContainer");
const addTaskItemButton = document.getElementById("addTaskItemButton");

// Event listeners
navbar.addEventListener("click", changeScreen);
forms.addEventListener("submit", doFormActions);
forms.addEventListener("change", doValidation);
dashboardPage.addEventListener("click", deleteTaskList);
todoListContainer.addEventListener("click", changeScreen);
createTodoListButton.addEventListener("click", changeScreen);
todoTaskForm.addEventListener("click", deleteTaskItem);
addTaskItemButton.addEventListener("click", addTaskItem);