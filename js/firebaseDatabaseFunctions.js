const FIREBASE_URL = "https://join-4d42f-default-rtdb.europe-west1.firebasedatabase.app";
let users = [];
let tasks = [];
let accounts = [];
let login = [];
let currentUser = -1;
let currentId = -1;

/**
 * Initializes the index.html page by redirecting the user to the login page (login.html).
 */
function indexHtmlInit() {
  window.location.href = "login.html";
}

/**
 * Asynchronously loads user data from a Firebase database.
 * @param {string} [path="/users"] The path to the user data in the Firebase database.
 *                             Defaults to "/users".
 * @returns {Promise<void>} A Promise that resolves when the user data is loaded.
 *                           The loaded user data is stored in the global `users` array.
 */
async function loadUsers(path = "/users") {
  users = [];
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      users.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        phone: responseToJson[key]["phone"],
      });
    });
    users.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}

/**
 * Asynchronously loads task data from a Firebase database.
 * @param {string} [path="/tasks"] The path to the task data in the Firebase database.
 *                             Defaults to "/tasks".
 * @returns {Promise<void>} A Promise that resolves when the task data is loaded.
 *                           The loaded task data is stored in the global `tasks` array.
 */
async function loadTasks(path = "/tasks") {
  tasks = [];
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      tasks.push({
        id: key,
        title: responseToJson[key]["title"],
        description: responseToJson[key]["description"],
        date: responseToJson[key]["date"],
        category: responseToJson[key]["category"],
        priority: responseToJson[key]["priority"],
        level: responseToJson[key]["level"],
        subtasks: responseToJson[key]["subtasks"],
        assigned: responseToJson[key]["assigned"],
        subtasksDone: responseToJson[key]["subtasksDone"],
        attachments: responseToJson[key]["attachments"] || "",
      });
    });
  }
}

/**
 * Asynchronously saves task data to a Firebase database using the POST method.
 * @param {string} [path=""] The path to save the task data in the Firebase database.
 *                         If empty, the data will be added to the root.
 * @param {object} [data={}] The task data to be saved.  Should be a JSON-serializable
 *                         object.
 * @returns {Promise<void>} A Promise that resolves when the data is successfully
 *                           saved.
 */
async function saveTasks(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Asynchronously edits an existing task in the Firebase database using the PUT method.
 * @param {string} id The ID of the task to be edited.
 * @param {object} [data={}] The updated task data. Should be a JSON-serializable object.
 * @returns {Promise<void>} A Promise that resolves when the task is successfully updated.
 */
async function editTask(id, data = {}) {
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * Asynchronously deletes a task from the Firebase database using the DELETE method.
 * If the provided ID is -1, the function does nothing and returns immediately.
 * After successful deletion, redirects the user to the "board.html" page.
 * @param {string|number} id The ID of the task to be deleted. Can be a string or a number.
 * @returns {Promise<void>} A Promise that resolves when the task is successfully deleted
 *                           or if the ID is -1.
 */
async function deleteTask(id) {
  if (id == -1) {
    return;
  }
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", {
    method: "DELETE",
  });

  window.location.href = "board.html";
}

/**
 * Stores a user's email address in local storage to remember their account.
 * If the email is already stored, this function does nothing.  Emails are stored
 * as a comma-separated string.
 * @param {string} accountEmail The email address of the user account to remember.
 */
function rememberUserAccount(accountEmail) {
  let rememberedUsers = localStorage.getItem("remember");

  if (rememberedUsers) {
    if (!rememberedUsers.includes(accountEmail)) {
      let accountAsText = rememberedUsers + JSON.stringify(accountEmail);
      localStorage.setItem("remember", accountAsText);
    }
  } else {
    let accountAsText = JSON.stringify(accountEmail);
    localStorage.setItem("remember", accountAsText);
  }
}

/**
 * Deletes a user's email address in local storage of remembered accounts.
 * If the email is isnt stored, this function does nothing.
 */
function dontRememberUserAccount(userEmail) {
  let rememberedAccounts = localStorage.getItem("remember");

  if(rememberedAccounts) {
    if(rememberedAccounts.includes(userEmail)) {
      rememberedAccounts = rememberedAccounts.replace(`"${userEmail}"`, "");

      localStorage.setItem("remember", rememberedAccounts);
    }
  }
}

/**
 * Checks if a given email address is valid based on a basic set of criteria.
 * This function performs a simple validation, checking for the presence of "@" and ".",
 * a minimum length, and ensuring that the TLD (top-level domain) is present and not
 * immediately preceded by an "@" symbol.  It is important to note that this
 * function does *not* perform full email address validation according to RFC standards.
 * For more robust validation, consider using a dedicated email validation library.
 *
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email is considered valid based on these criteria,
 *                    false otherwise.
 */
 function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

/**
 * Asynchronously handles login input changes. Loads user accounts, checks
 * if the entered email is remembered, and enables/disables the login button
 * based on password length and email validity.
 * @returns {Promise<void>}
 */
async function loginOnInput() {
  await loadAccounts();
  let password = document.getElementById("userPassword").value;

  let rememberedAccounts = localStorage.getItem("remember");
  let email = document.getElementById("userEmail").value.trim();

  if (rememberedAccounts) {
    if (rememberedAccounts.includes(email)) {
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email == email) {
          activateRememberedAccount(i);
          return;
        }
      }
    }
  }

  if (password.length >= 6 && isEmailValid(email)) {
    document.getElementById("loginButton").disabled = false;
  } else {
    document.getElementById("loginButton").disabled = true;
  }
}

/**
 * fills the Account / login input fields when Account is remembered
 */
function activateRememberedAccount(accountIndex) {
  document.getElementById("userPassword").value = accounts[accountIndex].password;
  document.getElementById("rememberMeButton").checked = true;
  document.getElementById("loginButton").disabled = false;
}

/**
 * Logs in a user by storing their email and username in local storage.
 * @param {string} accountEmail The email address of the logged-in user.
 */
function logInUserAccount(accountEmail) {
  let accountAsText = JSON.stringify(accountEmail);

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == accountEmail) {
      localStorage.setItem("username", accounts[i].name);
    }
  }

  localStorage.setItem("loggedInAccount", accountAsText);
}

/**
 * Logs out the current user by clearing their email and username from local storage.
 * Sleeps 500 Milliseconds, because sometimes the Page reloaded before localStorage was deleted (logout)
 * so the User remained logged in without refreshing the login Page again
 */
function logOutUserAccount() {
  localStorage.setItem("loggedInAccount", "");
  localStorage.setItem("username", "");
  sessionStorage.removeItem("guestLoggedIn");

  setTimeout(() => {

  }, 500);
}

/**
 * Retrieves the email address of the logged-in user from local storage.
 * @returns {string|null} The email address of the logged-in user, or `null` if no user is logged in.
 */
function getLoggedInUser() {
  let loggedInUserAsText = localStorage.getItem("loggedInAccount");

  if (loggedInUserAsText) {
    return JSON.parse(loggedInUserAsText);
  }

  return "";
}

/**
 * Asynchronously handles user login. Loads user accounts, checks credentials,
 * remembers the user if requested, logs the user in, and displays messages
 * based on the login result.
 * @returns {Promise<void>}
 */
async function loginUser() {
  let userEmail = document.getElementById("userEmail").value.trim();
  let userPassword = document.getElementById("userPassword").value;

  await loadAccounts();

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == userEmail) {
      if (accounts[i].password == userPassword) {
        if (document.getElementById("rememberMeButton").checked) {
          rememberUserAccount(userEmail);
        } else {
          dontRememberUserAccount(userEmail);
        }
        logInUserAccount(userEmail);
        showLoginMessage("Login erfolgreich!", 1);
        return;
      } else {
        showLoginMessage("Login fehlgeschlagen!", 0);
        return;
      }
    }
  }
  showLoginMessage("Zu dieser E-Mail existiert kein Account!", 0);
}

/**
 * Asynchronously handles user sign-up. Checks for existing accounts with the
 * given email, and if no account exists, creates a new account in the Firebase
 * database.
 * @param {object} [data={}] The user data for the new account. Should be a
 *                           JSON-serializable object containing at least 'email'
 *                           and 'password' properties.
 * @returns {Promise<void>}
 */
async function signUpUser(data = {}) {
  let stopSignUp = false;
  await loadAccounts();

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email.toLowerCase() == data.email.toLowerCase()) {
      showSignupMessage("Zu dieser E-Mail-Adresse besteht bereits ein Account!", 0);
      stopSignUp = true;
    }
  }

  if (stopSignUp == false) {
    await fetch(FIREBASE_URL + "/accounts" + ".json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    showSignupMessage("Signup erfolgreich!", 1);
  }
}

/**
 * Asynchronously loads user account data from a Firebase database.
 * The loaded account data is stored in the global `accounts` array.
 * @returns {Promise<void>} A Promise that resolves when the account data is loaded.
 */
async function loadAccounts() {
  accounts = [];
  let userResponse = await fetch(FIREBASE_URL + "/accounts" + ".json");
  let responseToJson = await userResponse.json();

  if (responseToJson) {
    Object.keys(responseToJson).forEach((key) => {
      accounts.push({
        id: key,
        name: responseToJson[key]["name"],
        email: responseToJson[key]["email"],
        password: responseToJson[key]["password"],
      });
    });
  }
}

/**
 * Loads and displays the user's initials in the header profile icon.
 * If no username is found in local storage, displays "Guest" initials.
 */
function loadAccountInitials() {
  const icons = document.querySelectorAll("#header-profile-icon");
  if (!icons.length) return;
  let accountName = localStorage.getItem("username");
  const initials = getUserInitials(accountName && accountName !== "" ? accountName : "Guest");
  icons.forEach(icon => (icon.innerHTML = initials));
}

/**
 * Shrinks the contact name font size until the text fits its container without overflow.
 * Scales down from 47px to a minimum of 22px.
 */
function fitNameToContainer() {
  const span = document.getElementById("contact-name");
  if (!span) return;
  const container = span.closest(".contact-name");
  if (!container || container.clientWidth === 0) return;

  span.style.fontSize = "";
  const maxSize = parseInt(getComputedStyle(span).fontSize) || 40;
  for (let size = maxSize; size >= 16; size--) {
    span.style.fontSize = size + "px";
    if (span.scrollWidth <= container.clientWidth) break;
  }
}

/**
 * When no user session is active on privacy/legal/help pages, restructures the
 * chrome for guest visitors: hides the main nav, exposes a Log In link in the
 * sidebar, hides the header account menu and mobile bottom nav, and marks the
 * active page in the sidebar footer.
 */
function hideNavIfNotLoggedIn() {
  const loggedInAccount = localStorage.getItem("loggedInAccount");
  const guestLoggedIn = sessionStorage.getItem("guestLoggedIn");
  const isLoggedIn = (loggedInAccount && loggedInAccount !== "") || guestLoggedIn === "true";
  if (isLoggedIn) return;

  document.body.classList.add("guest-view");

  document.querySelectorAll(".desktop-sidebar .menu-sidebar").forEach(el => el.remove());

  const sidebar = document.querySelector(".desktop-sidebar");
  if (sidebar && !sidebar.querySelector(".login-sidebar-link")) {
    const loginLink = document.createElement("a");
    loginLink.href = "./login.html";
    loginLink.className = "login-sidebar-link";
    loginLink.innerHTML =
      '<svg class="login-sidebar-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' +
      '<span>Log In</span>';
    const logo = sidebar.querySelector(".logo-sidebar");
    if (logo && logo.parentNode) {
      logo.insertAdjacentElement("afterend", loginLink);
    } else {
      sidebar.prepend(loginLink);
    }
  }

  document.querySelectorAll(".desktop-header .header-icons").forEach(el => (el.style.display = "none"));
  document.querySelectorAll(".mobile-header .profile-icon").forEach(el => (el.style.display = "none"));
  document.querySelectorAll(".mobile-nav").forEach(el => (el.style.display = "none"));

  const currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
  document.querySelectorAll(".nav-links-footer a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href && (href === currentPage || currentPage.endsWith("/" + href))) {
      a.classList.add("active");
    }
  });
}

/**
 * Asynchronously registers a new user. Retrieves user input, creates a user
 * data object, checks sign-up conditions, and then calls the `signUpUser`
 * function to create the account.  Redirects to the login page upon
 * successful registration.  Displays a message if sign-up conditions are not met.
 * @returns {Promise<void>}
 */
async function registerUser() {
  let name = document.getElementById("fullName").value.trim();
  let email = document.getElementById("userEmail").value.trim();
  let password = document.getElementById("userPassword").value;

  let loginData = {
    name: name,
    email: email,
    password: password,
  };

  if (checkSignUpConditions()) {
    await signUpUser(loginData);
  } else {
    showSignupMessage("Please enter the required informations & accept the privacy policy.", 0);
  }
}

/**
 * Asynchronously adds a new user. Retrieves user input from the form,
 * creates a user object, clears the form fields, saves the user data using
 * the `postData` function, and re-renders the contact list.
 * @returns {Promise<void>}
 */
async function addUser() {
  let nameValue = document.getElementById("name").value;
  let phoneValue = document.getElementById("phone").value;
  let emailValue = document.getElementById("email").value;
  let newUser = { name: nameValue, email: emailValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  await postData("/users", newUser);
  await renderContacts();
}

/**
 * Asynchronously posts data to a specified path in the Firebase database using the POST method.
 * @param {string} [path=""] The path in the Firebase database to post the data to.
 *                         If empty, the data will be added to the root.
 * @param {object} [data={}] The data to be posted. Must be a JSON-serializable object.
 * @returns {Promise<void>} A Promise that resolves when the data is successfully posted.
 */
async function postData(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
