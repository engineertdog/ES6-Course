/**
 * Project #1 - To-Do Application
 *
 */

// Logged in tracker
let userData = [];
let loggedIn = false;
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

const changeScreen = (e) => {
    const t = e.target;
    const id = t.id;

    if (id === "github") {
        return;
    } else {
        e.preventDefault();
    }

    if (oldPage === "settingsPage") {
        settingsError.classList.add("d-none");
        settingsError.classList.remove("alert-danger", "alert-success", "alert-info");
        settingsError.innerText = "";
    }

    if (t.classList.contains("guestButton")) {
        pageDisplay(guestPage, id);
    } else if (t.classList.contains("userButton")) {
        if (id === "logoutButton") {
            pageDisplay(userPage, id);
            pageDisplay(guestPage, "intro", id);
            buttonDisplay();
            return;
        }

        if (!loggedIn) {
            pageDisplay(guestPage, id);
            buttonDisplay();
        }

        pageDisplay(userPage, id);
    }

    oldPage = id;
}

const buttonDisplay = () => {
    for (const button of guestButtons) {
        button.classList.toggle("d-none");
    }

    for (const button of userButtons) {
        button.classList.toggle("d-none");
    }

    loggedIn = !loggedIn;
}

const pageDisplay = (pages, id, button = null) => {
    for (const page of pages) {
        const classes = page.classList;

        if (!classes.contains("d-none")) {
            classes.add("d-none");
        }

        if (classes.contains(id)) {
            classes.remove("d-none");

            switch (id) {
                case "loginUser":
                    document.getElementById("loginEmail").focus();
                    break;
                case "registerUser":
                    document.getElementById("registerFirstName").focus();
                    break;
                case "dashboardPage":
                    getToDolist();
                    break;
                case "todoListPage":
                    document.getElementById("requiredTask").focus();
                    todoListHeader.innerText = "Create List";
                    break;
                case "settingsPage":
                    document.getElementById("firstName").focus();

                    for (const d in userData) {
                        document.getElementById(d).value = userData[d];
                    }

                    break;
            }
        }

        if ((button === "logoutButton") && (page.id === id)) {
            classes.remove("d-none");
        }
    }
}

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
            dashboardPage.click();
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
            dashboardPage.click();
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

            taskHolder +=
                "<li class='list-group-item d-flex justify-content-between align-items-center'>" +
                taskListItem.taskName +
                "   <span class='badge badge-primary badge-pill px-2 py-1 bg-custom'> " + taskListItem.tasks.length + "</span>" +
                "</li>";
        }
        todoListContainer.innerHTML = taskHolder;
    } else {
        todoListContainer.innerHTML = "<p>You currently do not have any To-Do Lists made. Create one now!</p>"
    }
}

const addTaskItem = () => {
    const newItem = document.createElement("div");
    newItem.classList.add("list-group");
    newItem.innerHTML =
        "<div class='list-group'>" +
        "   <div class='input-group'>" +
        "       <div class='input-group-prepend'>" +
        "           <div class='input-group-text'>" +
        "               <input type='checkbox' class='taskItemDone' />" +
        "            </div>" +
        "       </div>" +
        "       <input type='text' class='form-control taskItem' placeholder='Task' />" +
        "       <div class='input-group-append'>" +
        "           <div class='input-group-text'>" +
        "               <button type='button' class='btn btn-danger deleteTaskItem'><i class='far fa-trash-alt'></i></button>" +
        "           </div>" +
        "       </div>" +
        "   </div>" +
        "</div>";
    taskItemContainer.appendChild(newItem);
    newItem.querySelector(".taskItem").focus();
}

const deleteTaskItem = (e) => {
    const classes = e.target.classList;

    if (classes.contains("deleteTaskItem") || classes.contains("fa-trash-alt")) {
        const container = e.target.offsetParent.offsetParent.offsetParent;

        container.remove();
    }
}

const siblingDelete = (sibling) => {
    if (sibling !== null) {
        if (!sibling.classList) {
            if (typeof sibling.classList !== "undefined") {
                if (!sibling.classList.contains("form-label-group")) {
                    sibling.remove();
                }
            }
        }
    }
}

const saveTodoList = (e) => {
    const t = e.target;
    const tasks = {};
    let count = 0;

    const taskItems = document.getElementsByClassName("taskItem");
    const taskDone = document.getElementsByClassName("taskItemDone");

    for (const i of t) {
        if (i.classList.contains("taskItem")) {
            tasks[count] = {
                done: taskDone[count].checked,
                task: taskItems[count].value
            };
            count++;
        }
    }

    const existingTasks = JSON.parse(localStorage.getItem("taskList"));
    let userTaskObj = {};
    let taskNum = 0;

    if (existingTasks === null) {
        taskNum = 1;
    } else {
        taskNum = e.target.taskNum.value || (parseInt(existingTasks[userData.email].length) + 1);
        userTaskObj = existingTasks;
    }

    const myTasks = Object.assign({}, userTaskObj);

    if (typeof myTasks[userData.email] === "undefined") {
        myTasks[userData.email] = {};
    }

    myTasks[userData.email][taskNum] = {
        taskName: e.target.todoListName.value,
        tasks: [tasks]
    }

    localStorage.setItem("taskList", JSON.stringify(myTasks));
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

const doValidation = (inputs) => {
    let cont = true;

    if (inputs.type === "change") {
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

    return cont;
}

const validateInputs = (formItem) => {
    let errors = false;
    const iLength = formItem.value.length;
    const errorText = document.getElementById(formItem.id + "Error");

    if (formItem.type !== "submit") {
        const item = validationRules[formItem.id] || validationRules[validationRules.alias[formItem.id]];
        formItem.classList.remove("is-invalid", "is-valid");
        errorText.innerText = "";
        errorText.classList.remove("d-block");

        if (formItem.type === "checkbox") {
            if (!formItem.checked) {
                errorText.innerText = item.text;
                errors = true;
            }
        } else if (formItem.type === "email") {
            const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

            if (!regex.test(formItem.value)) {
                errorText.innerText = item.text;
                errors = true;
            }
        } else {
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
        formItem.classList.add("is-invalid");
        errorText.classList.add("d-block");
        return true;
    } else {
        formItem.classList.add("is-valid");
        return false;
    }
}

const doFormActions = (e) => {
    e.preventDefault();
    const id = e.target.id;

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
const dashboardPage = document.getElementById("dashboardPage");
const forms = document.getElementById("pageContainer");
const loginError = document.getElementById("loginError");
const registerError = document.getElementById("registerError");
const settingsError = document.getElementById("settingsError");
const createTodoListButton = document.getElementById("todoListPage");
const todoListContainer = document.getElementById("todoListContainer");
const todoListHeader = document.getElementById("todoListHeader");
const taskForm = document.getElementById("todoTaskForm");
const taskItemContainer = document.getElementById("taskItemContainer");
const addTaskItemButton = document.getElementById("addTaskItemButton");

// Event listeners
navbar.addEventListener("click", changeScreen);
forms.addEventListener("submit", doFormActions);
forms.addEventListener("change", doValidation);
createTodoListButton.addEventListener("click", changeScreen);
taskForm.addEventListener("click", deleteTaskItem);
addTaskItemButton.addEventListener("click", addTaskItem);