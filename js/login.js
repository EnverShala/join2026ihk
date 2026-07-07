/**
 * Initializes the application by removing the "start" class from the logo container,
 * setting the background to white, and showing the login container after a delay.
 */
function init() {
  document.getElementById("logo-container").classList.remove("start");
  document.getElementById("myBody").style.background = "white";
  setTimeout(showLoginContainer, 1500);
}

/**
 * Shows the login container if no user is logged in, otherwise redirects to the summary page.
 */
function showLoginContainer() {
  let loggedInAccount = localStorage.getItem("loggedInAccount");
  if (loggedInAccount) {
    if (loggedInAccount != "") {
      location.href = "./summary.html";
      return;
    }
  }

  document.getElementById("main_wrapper").classList.remove("d-none");
  document.getElementById("footerID").classList.remove("d-none");
  document.getElementById("authOpt").classList.remove("d-none");
  document.getElementById("logo-container").classList.remove("d-none");
  document.getElementById("login_section").classList.remove("d-none");
  document.getElementById("logo-container").classList.remove("transition2s");
}

/**
 * Logs in the user as a guest and redirects to the summary page.
 */
function guestLogin() {
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
