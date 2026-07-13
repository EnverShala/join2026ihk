/** Initializes login page: runs logo intro and reveals card after 1.5s. */
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

/** Logs in as guest and redirects to the summary page. */
function guestLogin() {
  sessionStorage.setItem("guestLoggedIn", "true");
  window.location.href = "summary.html";
}

/** Shows a login message; redirects to summary on success after 3s. */
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
