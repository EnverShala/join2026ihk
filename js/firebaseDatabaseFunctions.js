const FIREBASE_URL = "https://join-4d42f-default-rtdb.europe-west1.firebasedatabase.app";
let users = [];
let tasks = [];
let accounts = [];
let login = [];
let currentUser = -1;
let currentId = -1;

/** Routes index.html: real users to summary, everyone else to login. Clears guest flag. */
function indexHtmlInit() {
  sessionStorage.removeItem("guestLoggedIn");
  const loggedInAccount = localStorage.getItem("loggedInAccount");
  if (loggedInAccount && loggedInAccount !== "") {
    window.location.href = "summary.html";
  } else {
    window.location.href = "login.html";
  }
}

/** Loads users from Firebase into the global `users` array (sorted by name). */
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
    users.sort((a, b) => a.name.localeCompare(b.name));
  }
}

/** Loads tasks from Firebase into the global `tasks` array. */
async function loadTasks(path = "/tasks") {
  tasks = [];
  let userResponse = await fetch(FIREBASE_URL + path + ".json");
  let responseToJson = await userResponse.json();
  if (!responseToJson) return;
  Object.keys(responseToJson).forEach((key) => {
    tasks.push(mapTaskRecord(key, responseToJson[key]));
  });
}

/** Builds a task object from a raw Firebase record. */
function mapTaskRecord(id, raw) {
  return {
    id: id,
    title: raw["title"],
    description: raw["description"],
    date: raw["date"],
    category: raw["category"],
    priority: raw["priority"],
    level: raw["level"],
    subtasks: raw["subtasks"],
    assigned: raw["assigned"],
    subtasksDone: raw["subtasksDone"],
    attachments: raw["attachments"] || "",
  };
}

/** Saves task data to Firebase using POST. */
async function saveTasks(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Updates a task in Firebase using PUT. */
async function editTask(id, data = {}) {
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

/** Deletes a task by id and redirects to board. No-op for id === -1. */
async function deleteTask(id) {
  if (id == -1) return;
  await fetch(FIREBASE_URL + `/tasks/${id}` + ".json", { method: "DELETE" });
  window.location.href = "board.html";
}

/** Stores an email in localStorage.remember (comma-joined) if not already present. */
function rememberUserAccount(accountEmail) {
  let rememberedUsers = localStorage.getItem("remember");
  if (rememberedUsers) {
    if (!rememberedUsers.includes(accountEmail)) {
      let accountAsText = rememberedUsers + JSON.stringify(accountEmail);
      localStorage.setItem("remember", accountAsText);
    }
  } else {
    localStorage.setItem("remember", JSON.stringify(accountEmail));
  }
}

/** Removes an email from localStorage.remember if it is stored. */
function dontRememberUserAccount(userEmail) {
  let rememberedAccounts = localStorage.getItem("remember");
  if (rememberedAccounts && rememberedAccounts.includes(userEmail)) {
    rememberedAccounts = rememberedAccounts.replace(`"${userEmail}"`, "");
    localStorage.setItem("remember", rememberedAccounts);
  }
}

/** Basic email format check: local@domain.tld (min 2-char TLD). */
function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

/** Login input handler: reacts to remembered accounts and toggles submit state. */
async function loginOnInput() {
  await loadAccounts();
  let password = document.getElementById("userPassword").value;
  let rememberedAccounts = localStorage.getItem("remember");
  let email = document.getElementById("userEmail").value.trim();
  if (rememberedAccounts && rememberedAccounts.includes(email)) {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].email == email) {
        activateRememberedAccount(i);
        return;
      }
    }
  }
  document.getElementById("loginButton").disabled = !(password.length >= 6 && isEmailValid(email));
}

/** Fills the login form fields for a remembered account. */
function activateRememberedAccount(accountIndex) {
  document.getElementById("userPassword").value = accounts[accountIndex].password;
  document.getElementById("rememberMeButton").checked = true;
  document.getElementById("loginButton").disabled = false;
}

/** Persists login state (email + username) to localStorage. */
function logInUserAccount(accountEmail) {
  let accountAsText = JSON.stringify(accountEmail);
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == accountEmail) {
      localStorage.setItem("username", accounts[i].name);
    }
  }
  localStorage.setItem("loggedInAccount", accountAsText);
}

/** Clears login state on logout. */
function logOutUserAccount() {
  localStorage.setItem("loggedInAccount", "");
  localStorage.setItem("username", "");
  sessionStorage.removeItem("guestLoggedIn");
  setTimeout(() => {}, 500);
}

/** Returns the currently logged-in email from localStorage, or "". */
function getLoggedInUser() {
  let loggedInUserAsText = localStorage.getItem("loggedInAccount");
  if (loggedInUserAsText) return JSON.parse(loggedInUserAsText);
  return "";
}

/** Logs a user in by matching form email/password against stored accounts. */
async function loginUser() {
  let userEmail = document.getElementById("userEmail").value.trim();
  let userPassword = document.getElementById("userPassword").value;
  await loadAccounts();
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].email == userEmail) {
      finalizeLoginAttempt(accounts[i], userEmail, userPassword);
      return;
    }
  }
  showLoginMessage("Zu dieser E-Mail existiert kein Account!", 0);
}

/** Handles a login attempt once the matching account is found. */
function finalizeLoginAttempt(account, userEmail, userPassword) {
  if (account.password != userPassword) {
    showLoginMessage("Login fehlgeschlagen!", 0);
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

/** Signs up a new user unless an account with the same email already exists. */
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    showSignupMessage("Signup erfolgreich!", 1);
  }
}

/** Loads accounts from Firebase into the global `accounts` array. */
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

/** Displays the logged-in user's initials (or "G" for guests) in header icons. */
function loadAccountInitials() {
  const icons = document.querySelectorAll("#header-profile-icon");
  if (!icons.length) return;
  const loggedInAccount = localStorage.getItem("loggedInAccount");
  const guestLoggedIn = sessionStorage.getItem("guestLoggedIn") === "true";
  const isRealUser = loggedInAccount && loggedInAccount !== "";
  if (!isRealUser && !guestLoggedIn) return;
  document.querySelectorAll(".desktop-header .header-icons").forEach(el => (el.style.display = "flex"));
  document.querySelectorAll(".mobile-header .profile-icon").forEach(el => (el.style.display = "flex"));
  let initials;
  if (isRealUser) {
    const accountName = localStorage.getItem("username");
    initials = getUserInitials(accountName && accountName !== "" ? accountName : "Guest");
  } else {
    initials = "G";
  }
  icons.forEach(icon => (icon.innerHTML = initials));
}

/** Shrinks the contact-detail name font-size until the text fits its container. */
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

/** Marks the sidebar/nav link matching the current URL as active. */
function markActiveNavLink(selector, currentPage) {
  document.querySelectorAll(selector).forEach(a => {
    let href = (a.getAttribute("href") || "").toLowerCase();
    if (!href) return;
    href = href.replace(/^\.\//, "");
    if (href === currentPage || currentPage.endsWith("/" + href)) {
      a.classList.add("active");
    }
  });
}

/** Injects a Log-In link into the desktop sidebar for guest visitors. */
function injectGuestLoginLink() {
  const sidebar = document.querySelector(".desktop-sidebar");
  if (!sidebar || sidebar.querySelector(".login-sidebar-link")) return;
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

/** Restructures nav for guest visitors on privacy/legal/help pages. */
function hideNavIfNotLoggedIn() {
  const currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
  markActiveNavLink(".nav-links-footer a", currentPage);
  markActiveNavLink(".menu-sidebar .nav-links", currentPage);
  markActiveNavLink(".mobile-nav .container-nav-links > a", currentPage);
  markActiveNavLink(".sub-menu a", currentPage);

  const loggedInAccount = localStorage.getItem("loggedInAccount");
  const guestLoggedIn = sessionStorage.getItem("guestLoggedIn");
  const isLoggedIn = (loggedInAccount && loggedInAccount !== "") || guestLoggedIn === "true";
  if (isLoggedIn) {
    document.body.classList.add("logged-in");
    return;
  }

  document.body.classList.add("guest-view");
  document.querySelectorAll(".desktop-sidebar .menu-sidebar").forEach(el => el.remove());
  injectGuestLoginLink();
  document.querySelectorAll(".desktop-header .header-icons").forEach(el => (el.style.display = "none"));
  document.querySelectorAll(".mobile-header .profile-icon").forEach(el => (el.style.display = "none"));
  document.querySelectorAll(".mobile-nav").forEach(el => (el.style.display = "none"));
}

/** Registers a new user if signup conditions are met, otherwise shows an inline error. */
async function registerUser() {
  let name = document.getElementById("fullName").value.trim();
  let email = document.getElementById("userEmail").value.trim();
  let password = document.getElementById("userPassword").value;
  let loginData = { name: name, email: email, password: password };
  if (checkSignUpConditions()) {
    await signUpUser(loginData);
  } else {
    showSignupMessage("Bitte Pflichtfelder ausfüllen & Datenschutz akzeptieren.", 0);
  }
}

/** Adds a new user from the contact form, clears inputs, saves, then re-renders. */
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

/** Posts JSON data to the given Firebase path. */
async function postData(path = "", data = {}) {
  await fetch(FIREBASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
