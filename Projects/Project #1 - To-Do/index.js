/**
 * Project #1 - To-Do Application
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
        document.getElementById("taskNum").value = 0;
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
                    document.getElementById("loginEmail").focus();
                    break;
                case "registerUser":
                    // Set the focus to the first name field on the register page.
                    document.getElementById("registerFirstName").focus();
                    break;
                case "dashboardPage":
                    // Get the list of To-Do Lists for the current user.
                    getToDolist();
                    break;
                case "todoListPage":
                    // Set focus to the To-Do List name.
                    document.getElementById("todoListName").focus();
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
                    document.getElementById("firstName").focus();

                    // Loop through the userData variable and set the settings input fields to
                    // the value of the setting in the userData variable.
                    for (const d in userData) {
                        document.getElementById(d).value = userData[d];
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
 *
 * @param {object} e
 */
const doLogin = (e) => {
    const t = e.target;
    const users = JSON.parse(localStorage.getItem("users"));
    let email = t.loginEmail.value;
    let contLogin = false;
    loginError.classList.add("d-none");
    loginError.innerText = "";

    if (users) {
        if (typeof users[email] !== "undefined") {
            contLogin = true;
            user = users[email];
        }
    }

    if (contLogin) {
        if (t.loginPassword.value === users[email].password) {
            userData = Object.assign({}, users[email]);
            dashboardButton.click();
            t.reset();
        } else {
            loginError.classList.remove("d-none");
            loginError.innerText = "Your password is incorrect.";
        }
    } else {
        loginError.classList.remove("d-none");
        loginError.innerText = "There is no account associated with that email.";
    }
}

const doRegister = (e) => {
    const t = e.target;
    const register = doValidation(e.target);
    let contRegister = false;
    registerError.classList.add("d-none");
    registerError.innerText = "";

    if (register) {
        const email = t.registerEmail.value;
        const existingUsers = JSON.parse(localStorage.getItem("users"));


        if (existingUsers === null) {
            contRegister = true;
        } else {
            if (existingUsers[email] === null) {
                contRegister = true;
            } else if (typeof existingUsers[email] === "undefined") {
                contRegister = true;
            }
        }

        if (contRegister) {
            const user = Object.assign({}, existingUsers);
            user[email] = {
                firstName: t.registerFirstName.value,
                lastName: t.registerLastName.value,
                email: email,
                password: t.registerPassword.value
            };

            localStorage.setItem("users", JSON.stringify(user));
            dashboardButton.click();
            t.reset();

            for (const i of t) {
                i.classList.remove("is-valid", "is-invalid");
            }
        } else {
            registerError.classList.remove("d-none");
            registerError.innerText = "That email is already in use.";
        }
    }
}

const getToDolist = () => {
    let contLists = false;
    const taskList = JSON.parse(localStorage.getItem("taskList"));
    let taskHolder = "";

    if (taskList) {
        if (typeof taskList[userData.email] !== "undefined") {
            contLists = true;
        }
    }

    if (contLists) {
        for (const listData in taskList[userData.email]) {
            const taskListItem = taskList[userData.email][listData];
            let complete = incomplete = 0;

            for (const i in taskListItem.tasks) {
                if (taskListItem.tasks[i].done) {
                    complete++;
                } else {
                    incomplete++;
                }
            }

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
        todoListContainer.innerHTML = taskHolder;
    } else {
        todoListContainer.innerHTML = "<p>You currently do not have any To-Do Lists made. Create one now!</p>"
    }
}

const displayTaskListItems = (id) => {
    id = id.substring(5, id.length);
    const taskList = JSON.parse(localStorage.getItem("taskList"));

    if (taskList[userData.email][id] !== "undefined") {
        const thisTaskList = taskList[userData.email][id];
        document.getElementById("taskNum").value = id;
        document.getElementById("todoListName").value = thisTaskList.taskName;
        document.getElementById("requiredTask").value = thisTaskList.tasks[0].task;
        document.getElementById("requiredTaskDone").checked = thisTaskList.tasks[0].done;

        for (const i in thisTaskList.tasks) {
            if (parseInt(i) !== 0) {
                const checked = thisTaskList.tasks[i].done ? "checked" : "";
                addTaskItem(checked, thisTaskList.tasks[i].task)
            }
        }
    }
}

const addTaskItem = (taskDone = "", taskValue = "") => {
    const newItem = document.createElement("div");
    newItem.classList.add("list-group");
    newItem.innerHTML =
        "<div class='input-group'>" +
        "   <div class='input-group-prepend'>" +
        "       <div class='input-group-text'>" +
        "           <input type='checkbox' class='taskItemDone' " + taskDone + " />" +
        "       </div>" +
        "   </div>" +
        "   <input type='text' class='form-control taskItem' placeholder='Task' value='" + taskValue + "' />" +
        "   <div class='input-group-append'>" +
        "       <div class='input-group-text'>" +
        "           <button type='button' class='btn btn-danger deleteTaskItem'><i class='far fa-trash-alt'></i></button>" +
        "       </div>" +
        "   </div>" +
        "</div>";
    taskItemContainer.appendChild(newItem);
    newItem.querySelector(".taskItem").focus();
}

const deleteTaskList = (e) => {
    const t = e.target;

    if (t.classList.contains("taskDeleteButton")) {
        const taskList = JSON.parse(localStorage.getItem("taskList"));
        const container = t.closest(".list-group-item");
        container.remove();

        const id = t.id.substring(4, t.id.length);
        delete taskList[userData.email][id];
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
}

const deleteTaskItem = (e) => {
    let t;

    if (typeof e.classList !== "undefined") {
        t = e;
    } else {
        t = e.target;
    }

    if (t.classList.contains("deleteTaskItem") || t.classList.contains("fa-trash-alt")) {
        const container = t.closest(".list-group");

        if (container.id !== "noDeleteTask") {
            container.remove();
        }
    }
}

const resetTodoListForm = () => {
    for (const delButton of taskItemContainer.getElementsByClassName("deleteTaskItem")) {
        setTimeout(() => {
            deleteTaskItem(delButton);
        }, 100);
    }

    todoTaskForm.reset();
}

const saveTodoList = (e) => {
    const t = e.target;
    const tasks = [];
    let count = 0;

    const taskItems = document.getElementsByClassName("taskItem");
    const taskDone = document.getElementsByClassName("taskItemDone");

    for (const i of t) {
        if (i.classList.contains("taskItem")) {
            tasks.push({
                done: taskDone[count].checked,
                task: taskItems[count].value
            });
            count++;
        }
    }

    const existingTasks = JSON.parse(localStorage.getItem("taskList"));

    if (existingTasks === null) {
        taskNum = 1;
    } else {
        if (typeof existingTasks[userData.email] === "undefined") {
            taskNum = 1;
        } else {
            if (e.target.taskNum.value == 0) {
                taskNum = Object.keys(existingTasks[userData.email]).length;
            } else {
                taskNum = e.target.taskNum.value;
            }
        }
    }

    const myTasks = Object.assign({}, existingTasks);

    if (typeof myTasks[userData.email] === "undefined") {
        myTasks[userData.email] = {};
    }

    myTasks[userData.email][taskNum] = {
        taskName: e.target.todoListName.value,
        tasks: tasks
    }

    localStorage.setItem("taskList", JSON.stringify(myTasks));
    todoListError.innerText = "We have saved your To-Do List.";
    todoListError.classList.add("alert-success");
    todoListError.classList.remove("alert-danger", "d-none");
    resetTodoListForm();
}

const doSettings = (e) => {
    const t = e.target;
    const settings = doValidation(e.target);
    let contSettings = true;
    settingsError.classList.add("d-none", "alert-danger");
    settingsError.classList.remove("alert-info", "alert-success");
    settingsError.innerText = "";

    if (settings) {
        const oldEmail = userData.email;
        const email = t.email.value;
        const existingUsers = JSON.parse(localStorage.getItem("users"));

        if (existingUsers) {
            if ((existingUsers[oldEmail] === null) || (typeof existingUsers[oldEmail] === "undefined")) {
                contSettings = false;
            }
        }

        if (contSettings) {
            const user = Object.assign({}, existingUsers);;
            user[email] = {
                firstName: t.firstName.value,
                lastName: t.lastName.value,
                email: email,
                password: t.password.value
            };

            if (JSON.stringify(user[email]) !== JSON.stringify(existingUsers[oldEmail])) {
                let canChangeEmail = true;

                if (email !== existingUsers[oldEmail].email) {
                    for (const loopedUser in existingUsers) {
                        if (email === loopedUser) {
                            canChangeEmail = false;
                        }
                    }

                    if (canChangeEmail) {
                        delete user[oldEmail];
                    }
                }

                if (canChangeEmail) {
                    localStorage.setItem("users", JSON.stringify(user));
                    userData = user[email];

                    settingsError.classList.add("alert-success");
                    settingsError.classList.remove("alert-danger", "d-none");
                    settingsError.innerText = "We have updated your settings";

                    for (const i of t) {
                        i.classList.remove("is-valid", "is-invalid");
                    }
                } else {
                    settingsError.classList.remove("d-none");
                    settingsError.innerText = "That email is already in use";
                }
            } else {
                settingsError.classList.add("alert-info");
                settingsError.classList.remove("alert-danger", "d-none");
                settingsError.innerText = "You have not changed any setting";
            }
        } else {
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
        // Ignore validation for the login form
        if ((inputs.target.form.id !== "loginForm") && (inputs.target.form.id !== "todoTaskForm")) {
            validateInputs(inputs.target);
        }
    } else {
        if (typeof inputs.target.form !== "undefined") {
            if (inputs.target.form.id !== "todoTaskForm") {
                return;
            }
        }

        for (const input of inputs) {
            const error = validateInputs(input);

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
    // Set a variable to the length of the form input value.
    const iLength = formItem.value.length;
    // Grab the form input's ID to grab it's respective error div.
    const errorText = document.getElementById(formItem.id + "Error");

    // Do nothing if the input is the submit button
    if (formItem.type !== "submit") {
        // Set item to the object from the validation rules based on the form input's ID. This object contains
        // all of the validation rules for the form input to be checked. Aliases are also used for items
        // that utilize the same data as other inputs for validation.
        const item = validationRules[formItem.id] || validationRules[validationRules.alias[formItem.id]];
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