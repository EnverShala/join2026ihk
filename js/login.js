/**
 * Initializes the login page: kicks off the logo intro animation and reveals
 * the login card after 1.5s. Safe against missing elements.
 */
function init() {
  const logo = document.getElementById("logo-container");
  const body = document.getElementById("myBody");
  if (logo) logo.classList.remove("start");
  if (body) body.style.background = "white";
  setTimeout(showLoginContainer, 1500);
}

/** Reveals the login container, or redirects to summary if a user is logged in. */
function showLoginContainer() {
  let loggedInAccount = localStorage.getItem("loggedInAccount");
  if (loggedInAccount && loggedInAccount != "") {
    location.href = "./summary.html";
    return;
  }
  revealLoginElements();
}

/** Removes the initial `d-none`/animation classes from the login layout elements. */
function revealLoginElements() {
  const ids = ["main_wrapper", "footerID", "authOpt", "logo-container", "login_section"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("d-none");
  });
  const logo = document.getElementById("logo-container");
  if (logo) logo.classList.remove("transition2s");
}

/**
 * Logs in the user as a guest and redirects to the summary page.
 */
function guestLogin() {
  sessionStorage.setItem("guestLoggedIn", "true");
  window.location.href = "summary.html";
}

/**
 * Displays a login message to the user.
 *
 * @param {string} messageText The text of the message to display.
 * @param {boolean} success Whether the login was successful. If true, redirects to summary.html after message display.
 */
function showLoginMessage(messageText, success) {
  const successMessage = document.querySelector(".msg-login");
  successMessage.style.display = "flex";
  document.getElementById("loginMessage").textContent = messageText;

  setTimeout(() => {
    successMessage.style.display = "none";
    if (success) {
      window.location.href = "summary.html";
    }
  }, 3000);
}
