/**
 * Initialisiert die Login-Seite: startet die Logo-Animation und zeigt die Card nach 1.5s.
 */
function init() {
  const logo = document.getElementById("logo-container");
  const body = document.getElementById("myBody");
  if (logo) logo.classList.remove("start");
  if (body) body.style.background = "white";
  setTimeout(showLoginContainer, 1500);
}

/**
 * Zeigt die Login-Card oder leitet zum Summary weiter, wenn ein User eingeloggt ist.
 */
function showLoginContainer() {
  let loggedInAccount = localStorage.getItem("loggedInAccount");
  if (loggedInAccount && loggedInAccount != "") {
    location.href = "./summary.html";
    return;
  }
  revealLoginElements();
}

/**
 * Entfernt die `d-none`- und Animations-Klassen von den Login-Layout-Elementen.
 */
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
 * Loggt den User als Gast ein und leitet zur Summary-Seite weiter.
 */
function guestLogin() {
  sessionStorage.setItem("guestLoggedIn", "true");
  window.location.href = "summary.html";
}

/**
 * Zeigt eine Login-Nachricht an und leitet bei Erfolg nach 3 Sekunden zur Summary weiter.
 *
 * @param {string} messageText - Der anzuzeigende Nachrichtentext.
 * @param {number} success - Truthy wenn nach 3s zur Summary weitergeleitet werden soll.
 */
function showLoginMessage(messageText, success) {
  const successMessage = document.querySelector(".msg-login");
  successMessage.style.display = "flex";
  document.getElementById("loginMessage").textContent = messageText;
  setTimeout(() => {
    successMessage.style.display = "none";
    if (success) window.location.href = "summary.html";
  }, 3000);
}
