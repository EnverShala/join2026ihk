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
 * Submit-Handler des Login-Formulars; validiert Felder und ruft loginUser auf.
 *
 * @param {Event} event - Das Submit-Event.
 * @returns {boolean} Immer false, um das native Submit zu unterdrücken.
 */
function handleLoginSubmit(event) {
  event.preventDefault();
  loginEmailOnBlur();
  loginPasswordOnBlur();
  const button = document.getElementById("loginButton");
  if (button && !button.disabled) loginUser();
  return false;
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

/**
 * Setzt die Sichtbarkeit einer Fehlermeldung sowie den Fehler-Rahmen des Feldes.
 *
 * @param {string} wrapperId - Die ID des Message-Wrappers.
 * @param {string} textElId - Die ID des Textelements innerhalb des Wrappers.
 * @param {string} inputId - Die ID des zugehörigen Eingabefelds.
 * @param {string} errorClass - CSS-Klasse für den Fehler-Rahmen des Feldes.
 * @param {string} message - Der Nachrichtentext (leer = kein Fehler).
 */
function setLoginFieldError(wrapperId, textElId, inputId, errorClass, message) {
  const wrapper = document.getElementById(wrapperId);
  const text = document.getElementById(textElId) || wrapper?.querySelector("div");
  const input = document.getElementById(inputId);
  const fieldGroup = input?.closest(".field_group");
  if (!wrapper || !input) return;
  if (message) {
    if (text) text.textContent = message;
    wrapper.classList.remove("d-none");
    fieldGroup?.classList.add(errorClass);
  } else {
    wrapper.classList.add("d-none");
    fieldGroup?.classList.remove(errorClass);
  }
}

/**
 * Blur-Handler für das Login-Email-Feld. Zeigt Feedback bei ungültiger Email.
 */
function loginEmailOnBlur() {
  const emailField = document.getElementById("userEmail");
  const email = emailField.value.trim();
  emailField.value = email;
  if (email === "") {
    setLoginFieldError("error_email_message", null, "userEmail", "wrongMail", "");
    return;
  }
  if (!isEmailValid(email)) {
    setLoginFieldError("error_email_message", null, "userEmail", "wrongMail", "Bitte gültige Email eingeben");
    return;
  }
  setLoginFieldError("error_email_message", null, "userEmail", "wrongMail", "");
}

/**
 * Blur-Handler für das Login-Passwort-Feld. Zeigt Feedback bei zu kurzem Passwort.
 */
function loginPasswordOnBlur() {
  const password = document.getElementById("userPassword").value;
  if (password === "") {
    setLoginFieldError("error_password_message", null, "userPassword", "wrongPassword", "");
    return;
  }
  if (password.length < 6) {
    setLoginFieldError("error_password_message", null, "userPassword", "wrongPassword", "Mindestens 6 Zeichen");
    return;
  }
  setLoginFieldError("error_password_message", null, "userPassword", "wrongPassword", "");
}
