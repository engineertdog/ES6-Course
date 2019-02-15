/**
 * Project #1 - To-Do Application (With Assignment #9 modifications)
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
 * The project has been updated to use a JSON file to store details about the application so that
 * items can be iterated over and re-used. This helps to reduce clutter in the JavaScript file(s) and
 * mimicks real usage.
 *
 */

// Location of the app data JSON file.
const projectDataURL = "http://localhost:5000/project1data";
// Variable to hold the app data JSON, one for undefined, one for lang, one for the widely used d-none class,
// and one for the alert classes.
let appData, undef, lang, dNone, dClass, aClass, fClass;
// Variable to keep track of the task item on the To-Do Task List form.
let taskItemNum = 0;
// User information for logged in session.
let userData = [];
// Logged in tracker
let loggedIn = false;
// Tracker for the previous page visited, used for formatting since this is a one page application.
let oldPage = "intro";

const startApp = () => {
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
        if (id === appData.navbarItems.buttons.github.id) {
            return;
        } else {
            e.preventDefault();
        }

        // Reset the form's error div when the user changes pages
        if (oldPage === appData.login.page) {
            changeClassAndText(loginError, [aClass.danger, dNone], aClass, "");
        } else if (oldPage === appData.register.page) {
            changeClassAndText(registerError, [aClass.danger, dNone], aClass, "");
        } else if (oldPage === appData.settings.page) {
            changeClassAndText(settingsError, [aClass.danger, dNone], aClass, "");
        } else if (oldPage === appData.todoTaskList.page) {
            changeClassAndText(todoTaskListError, [aClass.danger, dNone], aClass, "");
            resetTodoTaskListForm();
        }

        // Set the previous page to the new page's ID. We need to set this here because when the user
        // clicks on the "View List" button for tasks, it will incorrectly set the id. This is fixed in
        // the pageDisplay function with this set up here.
        oldPage = id;

        // Display the correct page, and perform other functions, based on the button the user clicked.
        if (t.classList.contains(appData.app.guest.button)) {
            // Display the correct guest page when the user is logged out.
            pageDisplay(guestPage, id);
        } else if (t.classList.contains(appData.app.user.button)) {
            // This section could be reduced, but, the order of events is important because delays could
            // cause display issues.

            // User clicks logout button.
            if (id === appData.navbarItems.buttons.logoutButton.id) {
                // Make all of the logged in pages disappear.
                pageDisplay(userPage, id);
                // Send the user back to the intro to the application.
                pageDisplay(guestPage, appData.intro.id, id);
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
        } else if (t.classList.contains(appData.app.buttons.viewList)) {
            // This is invoked when the user clicks on "View List" button on the To-Do List page.
            // This will correctly display the edit form for the select To-Do List.
            pageDisplay(userPage, appData.todoTaskList.page, null, lang.edit);
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
            button.classList.toggle(dNone);
        }

        // Loop through the userButtons to show / hide them.
        for (const button of userButtons) {
            button.classList.toggle(dNone);
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
            if (!classes.contains(dNone)) {
                classes.add(dNone);
            }

            // If the current item in the HTML collection is the one we want to view, do a few things.
            if (classes.contains(id)) {
                // First, remove the d-none class so we can view the page.
                classes.remove(dNone);

                // Switch the ID to perform additional actions.
                switch (id) {
                    case appData.login.page:
                        // Set the focus to the email field on the login page.
                        app.querySelector(`#${appData.formFocus.login}`).focus();
                        break;
                    case appData.register.page:
                        // Set the focus to the first name field on the register page.
                        app.querySelector(`#${appData.formFocus.register}`).focus();
                        break;
                    case appData.dashboard.page:
                        // Get the list of To-Do Lists for the current user.
                        gettodoTaskList();
                        break;
                    case appData.todoTaskList.page:
                        // Set focus to the To-Do List name.
                        app.querySelector(`#${appData.formFocus.todoTaskList}`).focus();
                        // Set the previous page variable to the To-Do List form page. This is because
                        // when the user clicks the "View List" button on the Dashboard, this variable
                        // get set to the wrong value otherwise.

                        oldPage = appData.todoTaskList.page;

                        // Set the header of the To-Do List form page.
                        if (todoAction === null) {
                            todoTaskListHeader.innerText = lang.cList;
                        } else {
                            todoTaskListHeader.innerText = lang.eList;
                        }
                        break;
                    case appData.settings.page:
                        // Set focus to the first name field on the settings page.
                        app.querySelector(`#${appData.formFocus.settings}`).focus();

                        // Loop through the userData variable and set the settings input fields to
                        // the value of the setting in the userData variable.
                        for (const d in userData) {
                            app.querySelector(`#${d}`).value = userData[d];
                        }

                        break;
                }
            }

            // Help the user to see the intro page of the application when they click logout.
            if ((button === appData.navbarItems.buttons.logoutButton.id) && (page.id === id)) {
                classes.remove(dNone);
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
        const users = storageGet(appData.info.users);
        // Set email to an variable for easier use
        let email = t.loginEmail.value;
        // Set continue login to false so we can reject or accept the login.
        let contLogin = false;
        // Reset the login error div attributes.
        changeClassAndText(loginError, [aClass.danger, dNone], {}, "");

        // If the users object exists in storage, look to see if the user exists
        if (users) {
            // If the email entered is in the user object, continue to see if they can log in
            if (typeof users[email] !== undef) {
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

                // Reset the form validation classes.
                for (const i of t) {
                    changeClassAndText(i, {}, dClass.form);
                }
            } else {
                // Display an error message if the user entered an invalid password for their account.
                changeClassAndText(loginError, {}, [dNone], lang.login.invalid);
            }
        } else {
            // Show an error message if the user's email is not in the user object
            changeClassAndText(loginError, {}, [dNone], lang.login.dne);
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
        changeClassAndText(registerError, [aClass.danger, dNone], {}, "");

        // If the form has no errors, continue. Errors will be displayed by default through the function called by register.
        if (register) {
            // Set the entered email to a re-useable variable
            const email = t.registerEmail.value;
            // Grab the user object from storage. Normally, this would be from a database.
            const existingUsers = storageGet(appData.info.users);

            // If there are no users yet, continue.
            if (existingUsers === null) {
                contRegister = true;
            } else {
                // If the email entered does not exist in the user object, continue. This will be true when the existing users object is null.
                if (existingUsers[email] === null) {
                    contRegister = true;
                    // If the email entered does not exist in the user object, continue. This will be true when there are existing users and the user object is not null.
                } else if (typeof existingUsers[email] === undef) {
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
                storagePut(appData.info.users, user);
                // Copy the user data to a global variable for use throughout the application.
                userData = Object.assign({}, user[email]);
                // Simulate a click on the dashboardButton to simulate changing pages.
                dashboardButton.click();
                // Reset the register form.
                t.reset();

                // Reset the form validation classes.
                for (const i of t) {
                    changeClassAndText(i, {}, dClass.form);
                }
            } else {
                // Display an error if the selected email is already in use.
                changeClassAndText(registerError, {}, [dNone], lang.register.exists);
            }
        }
    }

    /**
     * Grab the To-Do Lists for the current user.
     */
    const gettodoTaskList = () => {
        // Set continue to false so we can perform checks.
        let contLists = false;
        // Grab the taskList object from storage. Normally, this would be from a database.
        const taskList = storageGet(appData.info.taskList);
        // Initialize a variable to hold the HTML for the To-Do Lists to be displayed.
        let taskHolder = "";

        // Check if the taskList object exists.
        if (taskList) {
            // If the user has task lists saved at one point, continue.
            if (typeof taskList[userData.email] !== undef) {
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
                    `<li class='list-group-item d-flex justify-content-between align-items-center'>
                       <div>
                           <span class='badge badge-success badge-pill px-2 mr-2 py-1'> ${complete}</span>
                           <span class='badge badge-danger badge-pill px-2 mr-2 py-1'> ${incomplete}</span>
                            ${taskListItem.taskName}
                       </div>
                       <div>
                           <button id='list-${listData}' type='button' class='btn btn-custom ${appData.app.buttons.viewList}'>${lang.vList}</button>
                           <button id='del-${listData}' type='button' class='btn btn-danger ${appData.app.buttons.deleteList}'>${lang.dList}</button>
                       </div>
                    </li>`;
            }

            // Add the To-Do Task List HTML content to the page.
            todoTaskListContainer.innerHTML = taskHolder;
        } else {
            // Show a message if the user has no task lists.
            todoTaskListContainer.innerHTML = `<p>${lang.dashboard.noLists}</p>`
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
        const taskList = storageGet(appData.info.taskList);

        // Continue if the task list exists.
        if (taskList[userData.email][id] !== undef) {
            // Set the To-Do Task List to a variable for easier access
            const thisTaskList = taskList[userData.email][id];
            // Set the taskNum variable to the list's number so it can be updated.
            todoTaskForm.querySelector(`#${appData.app.id.taskNum}`).value = id;
            // Set the name of the task list in the form.
            todoTaskForm.querySelector(`#${appData.app.id.taskListName}`).value = thisTaskList.taskName;
            // At least one task is required to create a list, so we set this required input's task name and done attribute to the first
            // item from the task list.
            todoTaskForm.querySelector(`#${dClass.requiredTask.input}`).value = thisTaskList.tasks[0].task;
            todoTaskForm.querySelector(`#${dClass.requiredTask.checkbox}`).checked = thisTaskList.tasks[0].done;

            // Loop through the task list's tasks.
            for (const i in thisTaskList.tasks) {
                // Do not include the first item as this was set above.
                if (parseInt(i) !== 0) {
                    // Set the done variable to checked or an empty string based on whether the task was marked done or not.
                    const checked = thisTaskList.tasks[i].done ? "checked" : "";
                    // Add the task item to the page.
                    taskItemContainer.appendChild(addTaskItem(checked, thisTaskList.tasks[i].task, parseInt(i) + 1));
                }
            }
        }
    }

    /**
     * Called when the user clicks the Add Task Item button. If not invoked like this,
     * then the new task input won't be added to the page.
     *
     */
    const addTaskItemToContainer = () => {
        taskItemContainer.appendChild(addTaskItem());
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
        if (typeof e.classList !== undef) {
            t = e;
        } else {
            t = e.target;
        }

        // Check if the node that triggered the function has the deleteTaskItem or trash can 'fa' icon. This means the user wanted to
        // remove the task item from the form.
        if (t.classList.contains(appData.app.classes.taskDelete) || t.classList.contains(appData.app.classes.trash)) {
            // Find the task item's parent container.
            const container = t.closest(`.${appData.app.classes.listGroup}`);

            // If the container is not the required one for the form, remove it from the page.
            if (container.id !== dClass.requiredTask.container) {
                // Decrease task item counter by 1 for form validation purposes.
                taskItemNum -= 1;
                container.remove();
            }
        }
    }

    /**
     * Handles the actions for when the To-Do Task List form is submitted.
     *
     * @param {object} e Form node
     */
    const savetodoTaskList = (e) => {
        // Set the target element to a re-usable variable
        const t = e.target;
        // Set the task list to an empty array.
        const tasks = [];
        // Set a counter for the task items.
        let count = 0;

        // Grab all of the task items and the checkbox that indicates if a task is done
        const taskItems = taskItemContainer.getElementsByClassName(appData.app.classes.taskItem);
        const taskDone = taskItemContainer.getElementsByClassName(appData.app.classes.taskItemDone);

        // Loop through the form elements.
        for (const i of t) {
            // If the element has the class taskItem, add it to the tasks array
            if (i.classList.contains(appData.app.classes.taskItem)) {
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
        const existingTasks = storageGet(appData.info.taskList);

        // If there are no tasks, allow creation.
        if (existingTasks === null) {
            taskNum = 1;
        } else {
            // If the user has not created any task lists yet, set the index of the task list to 1.
            if (typeof existingTasks[userData.email] === undef) {
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
        if (typeof myTasks[userData.email] === undef) {
            myTasks[userData.email] = {};
        }

        // Set the added, or edited, task list to the user's task list object.
        myTasks[userData.email][taskNum] = {
            taskName: e.target.todoTaskListName.value,
            tasks: tasks
        }

        // Set the task list object to the modified task list object.
        storagePut(appData.info.taskList, myTasks);
        // Tell the user we have added their task list.
        changeClassAndText(todoTaskListError, [aClass.success], aClass, lang.taskList.saved);
        // Reset the task list form with the function below.
        resetTodoTaskListForm();
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
        if (t.classList.contains(appData.app.buttons.deleteList)) {
            // Grab the taskList object from storage. Normally, this would be from a database.
            const taskList = storageGet(appData.info.taskList);
            // Find the parent container for the selected To-Do Task List.
            const container = t.closest(`.${appData.app.classes.listItem}`);
            // Remove the element from the page.
            container.remove();

            // Grab the ID from the string ID stored in the button (in format del-####).
            const id = t.id.substring(4, t.id.length);
            // Delete the task list from the task list object.
            delete taskList[userData.email][id];
            // Updated the task list object with the deleted entry.
            storagePut(appData.info.taskList, taskList);

            // Check to see if the user has deleted all of their To-Do Task Lists.
            if (Object.keys(taskList[userData.email]).length === 0) {
                // Show a message if the user has no more task lists.
                todoTaskListContainer.innerHTML = `<p>${lang.dashboard.noList}</p>`;
            }
        }
    }

    /**
     * Reset the To-Do Task List form
     */
    const resetTodoTaskListForm = () => {
        // Loop through the delete buttons to invoke the deleteTaskItem function in order to actually delete each task input.
        for (const delButton of taskItemContainer.getElementsByClassName(appData.app.classes.taskDelete)) {
            // Use setTimeout to avoid not deleting all of the task input nodes.
            setTimeout(() => {
                deleteTaskItem(delButton);
            }, 100);
        }

        // Reset the form validation classes.
        for (const i of todoTaskForm) {
            changeClassAndText(i, {}, dClass.form);
        }

        // Reset the task list number so we can store task lists properly.
        todoTaskForm.querySelector(`#${appData.app.id.taskNum}`).value = 0;
        // Reset the remaining form elements.
        todoTaskForm.reset();
        // Set the task item count to 1 so we can display inputs properly on the form.
        taskItemNum = 1;
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
        changeClassAndText(settingsError, [aClass.danger, dNone], {}, "");

        // If the form elements all passed validation checks, continue. Errors will be displayed by default.
        if (settings) {
            // Set a variable to the user's old email from the userData object.
            const oldEmail = userData.email;
            // Capture the email entered on the form.
            const email = t.email.value;
            // Grab the user object from storage.
            const existingUsers = storageGet(appData.info.users);

            // If the user object exists, continue.
            if (existingUsers) {
                // If the user object does not contain the object for the user with the old email, return false. This should always be true though
                // because we have no way to delete users in this application, unless the user deletes their localstorage while logged in.
                if ((existingUsers[oldEmail] === null) || (typeof existingUsers[oldEmail] === undef)) {
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
                            const taskList = storageGet(appData.info.taskList);

                            // If the user has created task lists at some point, update the task list object.
                            if (taskList !== null) {
                                if ((typeof taskList[oldEmail] !== undef)) {
                                    // Copy the old user task list object to the new email.
                                    taskList[email] = taskList[oldEmail];
                                    // Delete the old user task list object.
                                    delete taskList[oldEmail];
                                    // Update the task list object in storage.
                                    storagePut(appData.info.taskList, taskList);
                                }
                            }
                        }
                    }

                    // If the user can change their email, or by default, continue.
                    if (canChangeEmail) {
                        // Update the user object in storage.
                        storagePut(appData.info.users, user);
                        // Set the userData to the new user object for the current user.
                        userData = user[email];

                        // Alert the user that their settings have changed.
                        changeClassAndText(settingsError, [aClass.success], aClass, lang.settings.saved);

                        // Reset the form validation classes.
                        for (const i of t) {
                            changeClassAndText(i, {}, dClass.form);
                        }
                    } else {
                        // Display a message to the user if the email they wanted to change to is already in use.
                        changeClassAndText(settingsError, {}, [dNone], lang.settings.exists);
                    }
                } else {
                    // Display a message to the user if they have not changed any settings.
                    changeClassAndText(settingsError, [aClass.info], aClass, lang.settings.unchanged);
                }
            } else {
                // Display an error to the user that their account doesn't exist.
                changeClassAndText(settingsError, {}, [dNone], lang.settings.dne);
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
            if (inputs.target.form.id !== appData.login.form.id) {
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
        let errorText = "";
        let errorNode;
        let nodeID = formItem.id;

        // Following IF statement is used for the To-Do Task List form since it works differently than other forms.
        if ((formItem.classList.contains(appData.app.classes.taskItem)) || formItem.classList.contains(appData.app.classes.taskItemDone)) {
            // If the form element is a checkbox, skip validation as it's not needed.
            if (formItem.type === "checkbox") {
                return;
            }

            // If the form element's ID is blank (which is all added elements), then set the errorNode to the proper node.
            if (nodeID === "") {
                errorNode = app.querySelector(`#task-${formItem.dataset.tasknum}`);
                nodeID = appData.app.classes.taskItem;
            }
        }

        // Set a variable to the length of the form input value.
        const iLength = formItem.value.length;

        if (typeof errorNode === undef) {
            // Grab the form input's ID to grab it's respective error div.
            errorNode = app.querySelector(`#${nodeID}Error`);
        }

        // Do nothing if the input is the submit button
        if (formItem.type !== "submit") {
            // Set the validation rules to a re-useable variable
            const vRules = appData.validationRules;
            // Set item to the object from the validation rules based on the form input's ID. This object contains
            // all of the validation rules for the form input to be checked. Aliases are also used for items
            // that utilize the same data as other inputs for validation.
            const item = vRules[nodeID] || vRules[vRules.alias[nodeID]];
            // Remove the form input's validation classes in case it has any.
            changeClassAndText(formItem, {}, [fClass.invalid, fClass.valid], "");
            // Reset the form input's error div.
            changeClassAndText(errorNode, {}, [dClass.block], "");

            // item.text grabs the form input's error text
            // Same for item.min.text and item.max.text. We use the object to grab the respective
            if (formItem.type === "checkbox") {
                // Make all check boxes required to be checked
                if (!formItem.checked) {
                    errorText = item.text;
                    errors = true;
                }
            } else if (formItem.type === "email") {
                // Email regex, can use others though.
                const regex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

                // Show an error if the email does not meet the regex requirements.
                if (!regex.test(formItem.value)) {
                    errorText = item.text;
                    errors = true;
                }
            } else {
                // We can put more validation rule checks here, but min and max length are the only ones for now.

                // Check the min length and then the max length. Error if either one fails.
                if (item.min.value > iLength) {
                    errorText = item.min.text;
                    errors = true;
                } else if (item.max.value < iLength) {
                    errorText = item.max.text;
                    errors = true;
                }
            }
        }

        if (errors) {
            // Style the form input to show it is in error.
            changeClassAndText(formItem, [fClass.invalid]);
            // Show the form input's error div.
            changeClassAndText(errorNode, [dClass.block], {}, errorText);
            // Return true to indicate the form input has errors.
            return true;
        } else {
            // Style the form input to show it is valid.
            changeClassAndText(formItem, [fClass.valid]);
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
        if (id === appData.login.form.id) {
            doLogin(e);
        } else if (id === appData.register.form.id) {
            doRegister(e);
        } else if (id === appData.todoTaskList.form.id) {
            savetodoTaskList(e);
        } else if (id === appData.settings.form.id) {
            doSettings(e);
        }
    }

    // DOM References
    const app = document.getElementById(appData.info.container);
    const navbar = document.getElementById(appData.navbarItems.nav.id);
    const guestPage = document.getElementsByClassName(appData.app.guest.page);
    const userPage = document.getElementsByClassName(appData.app.user.page);
    const guestButtons = document.getElementsByClassName(appData.app.guest.button);
    const userButtons = document.getElementsByClassName(appData.app.user.button);
    const dashboardButton = document.getElementById(appData.dashboard.page);
    const dashboardPage = document.getElementById(appData.dashboard.id);
    const loginError = document.getElementById(appData.login.form.error);
    const registerError = document.getElementById(appData.register.form.error);
    const settingsError = document.getElementById(appData.settings.form.error);
    const createtodoTaskListButton = document.getElementById(appData.dashboard.button.id);
    const todoTaskListContainer = document.getElementById(dClass.dashboard);
    const todoTaskListHeader = document.getElementById(appData.todoTaskList.title.id);
    const addTaskItemButton = document.getElementById(appData.todoTaskList.button.id);
    const todoTaskForm = document.getElementById(appData.todoTaskList.form.id);
    const todoTaskListError = document.getElementById(appData.todoTaskList.form.error);
    const taskItemContainer = document.getElementById(dClass.requiredTask.parent);

    // Event listeners
    navbar.addEventListener("click", changeScreen);
    app.addEventListener("submit", doFormActions);
    app.addEventListener("change", doValidation);
    dashboardPage.addEventListener("click", deleteTaskList);
    todoTaskListContainer.addEventListener("click", changeScreen);
    createtodoTaskListButton.addEventListener("click", changeScreen);
    todoTaskForm.addEventListener("click", deleteTaskItem);
    addTaskItemButton.addEventListener("click", addTaskItemToContainer);
}

/**
 * Load the application content from a JSON file to setup the application.
 */
const loadAppData = async () => {
    // Fetch the app data json file and wait for it to return.
    const response = await fetch(projectDataURL);
    // Set a global variable to the json result.
    appData = await response.json();
    undef = appData.info.undefined;
    lang = appData.lang;
    dClass = appData.classes;
    dNone = dClass.dNone;
    aClass = dClass.alert;
    fClass = dClass.form;
}

/**
 * Add the navbar to the application.
 *
 */
const loadNavbar = () => {
    // Grab the navbar JSON info.
    const navbarData = appData.navbarItems
    const navItems = navbarData.buttons;
    // Create the elements needed for the navbar.
    const navDiv = document.createElement("div");
    const nav = document.createElement("nav");
    // Set a future HTML string to an empty string.
    let navData = "";

    // Loop through all the buttons in the navbar.
    for (const mItem in navItems) {
        // Set the button to a re-useable variable.
        const cItem = navItems[mItem];
        // Add the button to an HTML string of all the buttons.
        navData += `<a id="${cItem.id}" class="${navbarData.buttonClasses} ${cItem.class}" href="${cItem.href}">${cItem.text}</a>`;
    }

    // Set classes for the new elements.
    changeClassAndText(navDiv, navbarData.classes);
    changeClassAndText(nav, navbarData.nav.classes);

    // Set basic data for the new elements, including the innerHTML for the navbar and it's container.
    nav.id = navbarData.nav.id;
    nav.innerHTML = navData;
    navDiv.innerHTML = `<h5 class="my-0 mr-md-auto font-weight-normal">${appData.info.title}</h5>`;
    // Append the navbar to the container.
    navDiv.appendChild(nav);
    // Add the navbar to the application.
    app.prepend(navDiv);
}

/**
 * Add a page to the application.
 *
 * @param {string} p String representation of the page to add.
 * @param {boolean} hasForm Indicates whether the page has a form to use.
 */
const loadPage = async (p, hasForm = false) => {
    // Get the page's JSON data.
    const page = appData[p];
    // Create elements to display the page.
    const pageDiv = document.createElement("div");
    const childDiv = document.createElement("div");
    const titleH1 = document.createElement("div");
    const hr = document.createElement("hr");

    // Set classes for the new elements.
    changeClassAndText(pageDiv, page.classes);
    changeClassAndText(childDiv, page.child.classes);
    changeClassAndText(titleH1, page.title.classes);

    // Set basic info for the new elements.
    pageDiv.id = p;
    titleH1.id = page.title.id;
    titleH1.innerText = page.title.name;

    // Add the title to the page.
    childDiv.appendChild(titleH1);

    // Add a button between the title and line break if the page meets the requirements.
    if ((page.id === appData.dashboard.id) || (page.id === appData.todoTaskList.id)) {
        childDiv.appendChild(addButton(page.button.id, page.button.text, dClass.taskButtonContainer, dClass.taskButton));
    }

    // Add the line break to the page.
    childDiv.appendChild(hr);

    // If the page is the intro or dashboard, add their needed content.
    if (page.id === appData.intro.id) {
        childDiv.appendChild(introData());
    } else if (page.id === appData.dashboard.id) {
        childDiv.appendChild(dashboardData());
    }

    // If the page needs a form, load the form and append it to the page.
    if (hasForm) {
        childDiv.appendChild(loadForm(page));
    }

    // Append the child container to the page.
    pageDiv.appendChild(childDiv);
    // Add the page to the application.
    app.appendChild(pageDiv);
}

/**
 * Add a form to the page.
 *
 * @param {object} page Object with the required page's JSON data.
 */
const loadForm = (page) => {
    // Create some elements for the form.
    const form = document.createElement("form");
    const errorDiv = document.createElement("div");
    const submit = document.createElement("button");

    // Set classes for the new elements.
    changeClassAndText(errorDiv, [dClass.error, aClass.danger, dNone]);
    changeClassAndText(submit, dClass.submitButton);
    changeClassAndText(form, page.form.classes);

    // Some submit buttons may have extra classes. Add those.
    if (page.submit.classes) {
        changeClassAndText(submit, page.submit.classes);
    }

    // Set some basic info for the form elements.
    form.id = page.form.id;
    errorDiv.id = page.form.error;
    errorDiv.setAttribute("role", "alert");
    form.appendChild(errorDiv);
    submit.type = lang.submit;
    submit.innerText = page.submit.text;

    // Loop through the form inputs.
    for (const input of page.inputs) {
        // Create a parent container so we can set it later.
        let parentContainer;

        // Hidden inputs need different attributes, so they have their own set of checks.
        if (input.type === "hidden") {
            // Create the hidden input.
            const inputField = document.createElement("input");
            // Set the attributes for the input.
            inputField.id = input.id;
            inputField.type = input.type;
            inputField.value = input.value;
            inputField.required = input.required;
            // Set the parent container to the input itself.
            parentContainer = inputField;
        } else {
            // Create the elements needed to display the form input.
            const inputContainer = document.createElement("div");
            const inputChild = document.createElement("div");
            const inputField = document.createElement("input");
            const inputLabel = document.createElement("label");
            const inputError = document.createElement("div");

            // Set some basic attributes for the form input elements.
            inputField.type = input.type;
            inputField.id = input.id;
            inputField.required = input.required;
            changeClassAndText(inputField, input.class);
            inputField.setAttribute("placeholder", input.label);
            inputLabel.htmlFor = input.id;
            inputLabel.innerText = input.label;

            // Checkboxes need different elements and styles, so check for the input type.
            if (input.type !== "checkbox") {
                // Set the parent container to the input's container.
                parentContainer = inputContainer;
                // Set the styling for the input's container.
                changeClassAndText(inputContainer, dClass.inputContainer);
            } else {
                // Set the parent container to a child container.
                parentContainer = inputChild;
                // Set the styling for the input's containers.
                changeClassAndText(inputChild, dClass.checkboxChild);
                changeClassAndText(inputLabel, dClass.checkboxLabel);
                changeClassAndText(inputContainer, dClass.checkBoxContainer);
            }

            // Add the input field and the input label to the form.
            parentContainer.appendChild(inputField);
            parentContainer.appendChild(inputLabel);

            // Check if the form has an error help div.
            if (input.error) {
                // Set the styling for the error help div.
                changeClassAndText(inputError, [dClass.inputError]);
                // Set the ID for the div.
                inputError.id = input.error;
                // Add the div to the form.
                parentContainer.appendChild(inputError);
            }

            // Checkboxes have a different layout and have to be added differently.
            if (input.type === "checkbox") {
                // Add the input's container to the parent.
                inputContainer.appendChild(parentContainer);
                // Set the parent container to the input container.
                parentContainer = inputContainer;
            }
        }

        // Add the form element to the form.
        form.appendChild(parentContainer);
    }

    // Add the To-Do Task List to the form if that's the form we need. This one is different
    // from the other forms in the apps, so it needs a function to handle the uniqueness.
    if (page.form.id === appData.todoTaskList.form.id) {
        form.appendChild(insertTodoTaskList());
    }

    // Add the submit button to the form.
    form.appendChild(submit);
    // Return the form element so that it can be displayed.
    return form;
}

/**
 * Return the content needed to display the intro page.
 */
const introData = () => {
    // Create a paragraph tag that will display content to the user.
    const lead = document.createElement("p");
    // Add the required class to the paragraph tag.
    lead.classList.add("lead");
    // Set the content of the paragraph tag.
    lead.innerHTML =
        `This is a single page To-Do application that uses HTML, CSS, and JavaScript with no libraries, except for Bootstrap 4 and Font Awesome 5 (CSS ONLY).
        The application stores user login information with localStorage. This application demostrates the ability to utilize JavaScript to manipulate the DOM and
        to execute actions when events occur. <b>Note:</b> The way this page is designed to have the content vertically centered is <b>NOT</b> designed
        for applications with a lot of content as the content would be cut off due to the CSS settings.`;

    // Return the paragraph node.
    return lead;
}

/**
 * Return the content needed to display the dashboard page.
 */
const dashboardData = () => {
    // Create a UL element that will hold the user's To-Do Task Lists.
    const ul = document.createElement("ul");
    // Add the UL's attributes.
    changeClassAndText(ul, ["list-group"]);
    ul.id = dClass.dashboard;
    // Return the UL node.
    return ul;
}

/**
 * Return the newly created task item node to the calling function.
 */
const insertTodoTaskList = () => {
    const tClass = dClass.requiredTask;
    // Create a div that will hold the task list form's inputs.
    const tasksContainer = document.createElement("div");
    // Set the div's attributes.
    tasksContainer.id = tClass.parent;
    // Add the required first task for creating / editing a To-Do Task List.
    tasksContainer.appendChild(addTaskItem("", "", 0, tClass.container, tClass.checkbox, tClass.input, true, tClass.error));
    // Return the To-Do Task List container.
    return tasksContainer;
}

/**
 * Create a new task item for the To-Do Task List form. When adding the node when creating a new To-Do List, we do not mark
 * the task as done by default, and we set the value of the task item to an empty string. Otherwise, these variables are used
 * when viewing an existing To-Do Task List so that the appropriate entries can be shown.
 *
 * @param {string} taskDone String of empty string or 'checked' so indicate task completion.
 * @param {string} taskValue Value of the task item. Empty by default.
 * @param {number} taskNum Value of the task item index.
 * @param {string} newItemID ID value for the form element's container.
 * @param {string} checkboxID ID value for the task done checkbox.
 * @param {string} inputID ID value for the form input.
 * @param {boolean} required Boolean to indicate whether the form inputs are required.
 * @param {string} errorID ID of the error div for the form input.
 *
 */
const addTaskItem = (...args) => {
    // Setup the variables for the function based on their order.
    let taskDone, taskValue, taskNum, newItemID, checkboxID, inputID, isRequired, errorID;

    // Set the following variables to a default empty string if it was not passed to the function.
    taskDone = (typeof args[0] !== undef) ? args[0] : "";
    taskValue = (typeof args[1] !== undef) ? args[1] : "";
    taskNum = (typeof args[2] !== undef) ? parseInt(args[2]) : 0;
    newItemID = (typeof args[3] !== undef) ? args[3] : "";
    checkboxID = (typeof args[4] !== undef) ? args[4] : "";
    inputID = (typeof args[5] !== undef) ? args[5] : "";
    isRequired = args[6] ? "required" : "";

    // If we're adding a new element with the button and not because the function is being called by the view task function,
    // then we want to grab the current highest taskItemNum from the form and use that + 1 for the new form element.
    if (taskNum === 0) {
        taskNum = taskItemNum + 1;
    }

    // Set the task error ID down here because we need the proper task ID.
    errorID = args[7] ? args[7] : `task-${taskNum}`;

    // Create a new page element.
    const newItem = document.createElement("div");
    // Add the required class to the new element.
    changeClassAndText(newItem, ["list-group"]);
    // Add the id to the new element, if it should have one.
    newItem.id = newItemID;
    // Set the HTML of new element to the required HTML.
    newItem.innerHTML =
        `<div class='input-group'>
           <div class='input-group-prepend'>
               <div class='input-group-text'>
                   <input id='${checkboxID}' type='checkbox' class='taskItemDone' ${taskDone} />
               </div>
           </div>
           <input type='text' id='${inputID}' class='form-control taskItem' placeholder='Task' value='${taskValue}' data-taskNum='${taskNum}' ${isRequired} />
           <div class='input-group-append'>
               <div class='input-group-text'>
                   <button type='button' class='btn btn-danger ${appData.app.classes.taskDelete}'><i class='far fa-trash-alt'></i></button>
               </div>
           </div>
        </div>
        <div id='${errorID}' class='${dClass.inputError}'></div>`;

    // Update the taskItemNum to the new value.
    taskItemNum = taskNum;

    // Set focus to the newly created input.
    newItem.querySelector(`.${appData.app.classes.taskItem}`).focus();

    return newItem;
}

/**
 * Return a button to the calling function with a parent div node.
 *
 * @param {string} id ID of the button.
 * @param {string} text Text for the button.
 * @param {array} leadClasses Class array for the button container.
 * @param {array} buttonClasses Class array for the button.
 */
const addButton = (id, text, leadClasses, buttonClasses) => {
    // Create the required elements.
    const lead = document.createElement("div");
    const addButton = document.createElement("button");

    // Set the attributes of the button.
    addButton.id = id;
    addButton.type = "button";
    addButton.innerText = text;

    // Loop through the button's container classes and add them.
    changeClassAndText(lead, leadClasses);
    // Loop through the button's classes and add them.
    changeClassAndText(addButton, buttonClasses);

    // Add the button to it's container.
    lead.appendChild(addButton);

    // Return the container node.
    return lead;
}

/**
 * Take a node to remove and add classes from supplied objects to the node. Then set the inner
 * text of the node to the desired value.
 *
 * @param {object} node The node to modify.
 * @param {object} classesAdd Classes to add to the node.
 * @param {object} classesRemove Classes to remove from the node.
 * @param {string} text Inner text for the node to be set.
 */
const changeClassAndText = (node, classesAdd, classesRemove = {}, text = null) => {
    // Remove all classes desired.
    if (Array.isArray(classesRemove)) {
        for (const remove of classesRemove) {
            node.classList.remove(remove);
        }
    } else {
        for (const remove in classesRemove) {
            node.classList.remove(classesRemove[remove]);
        }
    }

    // Add all new classes to the node.
    if (Array.isArray(classesAdd)) {
        for (const add of classesAdd) {
            node.classList.add(add);
        }
    } else {
        for (const add in classesAdd) {
            node.classList.add(classesAdd[add]);
        }
    }

    // Set the inner text of the node.
    if (text !== null) {
        node.innerText = text;
    }
}

/**
 * Get data objects. Extracted function makes it easier to change to a database later on.
 *
 * @param {string} id
 */
const storageGet = (id) => {
    return JSON.parse(localStorage.getItem(id));
}

/**
 * Store data objects. Extracted function makes it easier to change to a database later on.
 *
 * @param {string} id ID of the data object to store.
 * @param {object} data Data object to save to storage.
 */
const storagePut = (id, data) => {
    localStorage.setItem(id, JSON.stringify(data));
}

/**
 * Load the application content and then allow the application to start using its functions.
 */
const loadHTML = async () => {
    // Load all of the application content first.
    await loadAppData();
    await loadNavbar();
    await loadPage("intro");
    await loadPage("login", true);
    await loadPage("register", true);
    await loadPage("dashboard");
    await loadPage("todoTaskList", true);
    await loadPage("settings", true);

    // Then give the application access to use its usage functions.
    startApp();
}

// Initialize the application
loadHTML();