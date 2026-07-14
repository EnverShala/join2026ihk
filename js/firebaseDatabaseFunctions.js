const FIREBASE_URL = "https://join-4d42f-default-rtdb.europe-west1.firebasedatabase.app";

let users = [];
let tasks = [];
let accounts = [];
let login = [];
let currentUser = -1;
let currentId = -1;

/**
 * Routes index.html to summary for real users, otherwise to login and clears guest flag.
 */
function indexHtmlInit() {
  sessionStorage.removeItem("guestLoggedIn");
  const loggedInAccount = localStorage.getItem("loggedInAccount");
  if (loggedInAccount && loggedInAccount !== "") {
    window.location.href = "summary.html";
  } else {
    window.location.href = "login.html";
  }
}

/**
 * Loads users from Firebase into the global `users` array sorted by name.
 *
 * @param {string} [path="/users"] - The Firebase path from which to load users.
 * @returns {Promise<void>}
 */
async function loadUsers(path = "/users") {
  users = [];
  const userResponse = await fetch(FIREBASE_URL + path + ".json");
  const responseToJson = await userResponse.json();
  if (!responseToJson) return;
  Object.keys(responseToJson).forEach((key) => {
    users.push(mapUserRecord(key, responseToJson[key]));
  });
  users.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Builds a user object from a raw Firebase record.
 *
 * @param {string} id - The Firebase key of the user record.
 * @param {Object} raw - The raw Firebase record.
 * @returns {Object} The mapped user object.
 */
function mapUserRecord(id, raw) {
  return {
    id: id,
    name: raw["name"],
    email: raw["email"],
    phone: raw["phone"],
  };
}

/**
 * Loads tasks from Firebase into the global `tasks` array.
 *
 * @param {string} [path="/tasks"] - The Firebase path from which to load tasks.
 * @returns {Promise<void>}
 */
async function loadTasks(path = "/tasks") {
  tasks = [];
  const userResponse = await fetch(FIREBASE_URL + path + ".json");
  const responseToJson = await userResponse.json();
  if (!responseToJson) return;
  Object.keys(responseToJson).forEach((key) => {
    tasks.push(mapTaskRecord(key, responseToJson[key]));
  });
}

/**
 * Builds a task object from a raw Firebase record.
 *
 * @param {string} id - The Firebase key of the task record.
 * @param {Object} raw - The raw Firebase record.
 * @returns {Object} The mapped task object.
 */
function mapTaskRecord(id, raw) {
  return {
    id: id, title: raw["title"], description: raw["description"],
    date: raw["date"], category: raw["category"], priority: raw["priority"],
    level: raw["level"], subtasks: raw["subtasks"], assigned: raw["assigned"],
    subtasksDone: raw["subtasksDone"], attachments: raw["attachments"] || "",
  };
}

/**
 * Saves task data to Firebase using POST.
 *
 * @param {string} [path=""] - The Firebase path to POST to.
 * @param {Object} [data={}] - The task data to persist.
 * @returns {Promise<void>}
 */
async function saveTasks(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Updates a task in Firebase using PUT.
 *
 * @param {string} id - The Firebase id of the task to update.
 * @param {Object} [data={}] - The updated task data.
 * @returns {Promise<void>}
 */
async function editTask(id, data = {}) {
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/**
 * Deletes a task by id and redirects to board. No-op for id === -1.
 *
 * @param {string} id - The Firebase id of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
  if (id == -1) return;
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", { method: "DELETE" });
  window.location.href = "board.html";
}

/**
 * Stores an email in localStorage.remember if it is not already present.
 *
 * @param {string} accountEmail - The email address to remember.
 * @returns {void}
 */
function rememberUserAccount(accountEmail) {
  const rememberedUsers = localStorage.getItem("remember");
  if (rememberedUsers) {
    if (!rememberedUsers.includes(accountEmail)) {
      const accountAsText = rememberedUsers + JSON.stringify(accountEmail);
      localStorage.setItem("remember", accountAsText);
    }
  } else {
    localStorage.setItem("remember", JSON.stringify(accountEmail));
  }
}

/**
 * Removes an email from localStorage.remember if it is stored.
 *
 * @param {string} userEmail - The email address to forget.
 * @returns {void}
 */
function dontRememberUserAccount(userEmail) {
  let rememberedAccounts = localStorage.getItem("remember");
  if (rememberedAccounts && rememberedAccounts.includes(userEmail)) {
    rememberedAccounts = rememberedAccounts.replace(`"${userEmail}"`, "");
    localStorage.setItem("remember", rememberedAccounts);
  }
}

/**
 * Strict email format check. Requires local@domain.tld, forbids consecutive dots
 * and leading/trailing dots in local part and domain.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email matches the expected pattern.
 */
function isEmailValid(email) {
  const trimmed = (email || "").trim();
  if (trimmed.includes("..")) return false;
  const re = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
  return re.test(trimmed);
}

/**
 * Login input handler that reacts to remembered accounts and toggles submit state.
 *
 * @returns {Promise<void>}
 */
async function loginOnInput() {
  await loadAccounts();
  const password = document.getElementById("userPassword").value;
  const rememberedAccounts = localStorage.getItem("remember");
  const email = document.getElementById("userEmail").value.trim();
  if (rememberedAccounts && rememberedAccounts.includes(email)) {
    if (tryActivateRemembered(email)) return;
  }
  document.getElementById("loginButton").disabled = !(password.length >= 6 && isEmailValid(email));
}

/**
 * Attempts to activate a remembered account matching the given email.
 *
 * @param {string} email - The email address to look up in `accounts`.
 * @returns {boolean} True if a remembered account was activated.
 */
function tryActivateRemembered(email) {
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == email) {
      activateRememberedAccount(i);
      return true;
    }
  }
  return false;
}

/**
 * Fills the login form fields for a remembered account.
 *
 * @param {number} accountIndex - The index of the account inside `accounts`.
 * @returns {void}
 */
function activateRememberedAccount(accountIndex) {
  document.getElementById("userPassword").value = accounts[accountIndex].password;
  document.getElementById("rememberMeButton").checked = true;
  document.getElementById("loginButton").disabled = false;
}

/**
 * Persists login state (email and username) to localStorage.
 *
 * @param {string} accountEmail - The email of the account being logged in.
 * @returns {void}
 */
function logInUserAccount(accountEmail) {
  const accountAsText = JSON.stringify(accountEmail);
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == accountEmail) {
      localStorage.setItem("username", accounts[i].name);
    }
  }
  localStorage.setItem("loggedInAccount", accountAsText);
}

/**
 * Clears login state on logout.
 *
 * @returns {void}
 */
function logOutUserAccount() {
  localStorage.setItem("loggedInAccount", "");
  localStorage.setItem("username", "");
  sessionStorage.removeItem("guestLoggedIn");
  setTimeout(() => {}, 500);
}

/**
 * Returns the currently logged-in email from localStorage.
 *
 * @returns {string} The stored email, or an empty string if none is stored.
 */
function getLoggedInUser() {
  const loggedInUserAsText = localStorage.getItem("loggedInAccount");
  if (loggedInUserAsText) return JSON.parse(loggedInUserAsText);
  return "";
}

/**
 * Logs a user in by matching form email/password against stored accounts.
 *
 * @returns {Promise<void>}
 */
async function loginUser() {
  const userEmail = document.getElementById("userEmail").value.trim();
  const userPassword = document.getElementById("userPassword").value;
  await loadAccounts();
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == userEmail) {
      finalizeLoginAttempt(accounts[i], userEmail, userPassword);
      return;
    }
  }
  showLoginMessage("Username oder Passwort falsch!", 0);
}

/**
 * Handles a login attempt once the matching account is found.
 *
 * @param {Object} account - The account record to validate against.
 * @param {string} userEmail - The email entered by the user.
 * @param {string} userPassword - The password entered by the user.
 * @returns {void}
 */
function finalizeLoginAttempt(account, userEmail, userPassword) {
  if (account.password != userPassword) {
    showLoginMessage("Username oder Passwort falsch!", 0);
    return;
  }
  if (document.getElementById("rememberMeButton").checked) {
    rememberUserAccount(userEmail);
  } else {
    dontRememberUserAccount(userEmail);
  }
  logInUserAccount(userEmail);
  showLoginMessage("Login erfolgreich!", 1);
}

/**
 * Signs up a new user unless an account with the same email already exists.
 *
 * @param {Object} [data={}] - The signup payload with name, email and password.
 * @returns {Promise<void>}
 */
async function signUpUser(data = {}) {
  await loadAccounts();
  const exists = accounts.some(a => a.email.toLowerCase() == data.email.toLowerCase());
  if (exists) {
    showSignupMessage("Zu dieser E-Mail-Adresse besteht bereits ein Account!", 0);
    return;
  }
  await postData("/accounts", data);
  showSignupMessage("Signup erfolgreich!", 1);
}

/**
 * Loads accounts from Firebase into the global `accounts` array.
 *
 * @returns {Promise<void>}
 */
async function loadAccounts() {
  accounts = [];
  const userResponse = await fetch(FIREBASE_URL + "/accounts" + ".json");
  const responseToJson = await userResponse.json();
  if (!responseToJson) return;
  Object.keys(responseToJson).forEach((key) => {
    accounts.push(mapAccountRecord(key, responseToJson[key]));
  });
}

/**
 * Builds an account object from a raw Firebase record.
 *
 * @param {string} id - The Firebase key of the account record.
 * @param {Object} raw - The raw Firebase record.
 * @returns {Object} The mapped account object.
 */
function mapAccountRecord(id, raw) {
  return {
    id: id,
    name: raw["name"],
    email: raw["email"],
    password: raw["password"],
  };
}

/**
 * Registers a new user if signup conditions are met, otherwise shows an inline error.
 *
 * @returns {Promise<void>}
 */
async function registerUser() {
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;
  const loginData = { name: name, email: email, password: password };
  if (checkSignUpConditions()) {
    await signUpUser(loginData);
  } else {
    showSignupMessage("Bitte Pflichtfelder ausfüllen & Datenschutz akzeptieren.", 0);
  }
}

/**
 * Adds a new user from the contact form, clears inputs, saves, then re-renders.
 *
 * @returns {Promise<void>}
 */
async function addUser() {
  const nameValue = document.getElementById("name").value.trim();
  const phoneValue = document.getElementById("phone").value.trim();
  const emailValue = document.getElementById("email").value.trim();
  const newUser = { name: nameValue, email: emailValue, phone: phoneValue };
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  await postData("/users", newUser);
  await renderContacts();
}

/**
 * Posts JSON data to the given Firebase path.
 *
 * @param {string} [path=""] - The Firebase path to POST to.
 * @param {Object} [data={}] - The JSON body to send.
 * @returns {Promise<void>}
 */
async function postData(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
