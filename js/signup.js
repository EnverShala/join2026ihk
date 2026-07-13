const touchedSignupFields = new Set();

/**
 * Markiert ein Signup-Feld als berührt und aktualisiert den Submit-Button.
 *
 * @param {string} fieldId - Die ID des berührten Formularfeldes.
 */
function markSignupFieldTouched(fieldId) {
  touchedSignupFields.add(fieldId);
  checkSignUpButton();
}

/**
 * Schaltet den Disabled-Zustand des Registrierungs-Buttons um.
 */
function toggleSignUpButton() {
  document.getElementById("registerButton").disabled =
    document.getElementById("registerButton").disabled == true ? false : true;
}

/**
 * Prüft die Datenschutz-Checkbox und markiert die Zustimmungstexte bei Bedarf rot.
 *
 * @returns {boolean} True wenn die Checkbox aktiviert ist.
 */
function checkPrivacyPolicy() {
  let agreeCheckbox = document.getElementById("agreeCheckbox").checked;
  if (agreeCheckbox) {
    document.getElementById("agreementText").classList.remove("redFont");
    document.getElementById("agreementLink").classList.remove("redFont");
    return true;
  }
  document.getElementById("agreementText").classList.add("redFont");
  document.getElementById("agreementLink").classList.add("redFont");
  return false;
}

/**
 * Aktiviert oder deaktiviert den Registrierungs-Button basierend auf den Signup-Bedingungen.
 *
 * @returns {boolean} True wenn alle Bedingungen erfüllt sind.
 */
function checkSignUpButton() {
  let registerButton = document.getElementById("registerButton");
  if (checkSignUpConditions()) {
    registerButton.className = "submit__button";
    registerButton.disabled = false;
    return true;
  }
  registerButton.className = "submit__button__disabled";
  registerButton.disabled = true;
  return false;
}

/**
 * Submit-Handler des Signup-Formulars; markiert alle Felder und ruft bei Gültigkeit registerUser auf.
 *
 * @param {Event} event - Das Submit-Event.
 * @returns {boolean} Immer false, um das Standard-Submit zu verhindern.
 */
function handleSignUpSubmit(event) {
  event.preventDefault();
  ["fullName", "userEmail", "userPassword", "confirmPassword"].forEach(function (id) {
    touchedSignupFields.add(id);
  });
  if (checkSignUpButton()) registerUser();
  return false;
}

/**
 * Prüft, ob Name, Email, Passwort, Passwortabgleich und Datenschutz alle gültig sind.
 *
 * @returns {boolean} True wenn alle Prüfungen bestehen.
 */
function checkSignUpConditions() {
  return checkName() && checkEmail() && checkPassword() &&
    clearPasswordMismatchMessage() && checkPrivacyPolicy();
}

/**
 * Wendet das Show/Hide-Fehlermuster auf ein Signup-Feld an.
 *
 * @param {string} boxId - Die ID der umgebenden Box.
 * @param {string} msgId - Die ID des Fehlermeldung-Elements.
 * @param {string} fieldId - Die ID des Formularfeldes.
 * @param {boolean} isValid - Ob der aktuelle Wert gültig ist.
 * @param {boolean} isEmpty - Ob das Feld leer ist.
 */
function _applySignupFieldState(boxId, msgId, fieldId, isValid, isEmpty) {
  const box = document.getElementById(boxId);
  const msg = document.getElementById(msgId);
  const showError = !isValid && !isEmpty && touchedSignupFields.has(fieldId);
  msg.classList.toggle("d-none", !showError);
  box.classList.toggle("margin-bottom24px", !showError);
}

/**
 * Validiert die Signup-Email und schaltet die Fehlermeldung um.
 *
 * @returns {boolean} True wenn die Email gültig ist.
 */
function checkEmail() {
  const email = document.getElementById("userEmail").value.trim();
  const valid = isEmailValid(email);
  _applySignupFieldState("emailBox", "requiredEmail", "userEmail", valid, email == "");
  return valid;
}

/**
 * Prüft, ob Passwort und Passwort-Bestätigung übereinstimmen (oder Bestätigung leer ist).
 *
 * @returns {boolean} True wenn kein Konflikt vorliegt.
 */
function clearPasswordMismatchMessage() {
  let messageContainer = document.getElementById("requiredConfirmation");
  let confirmBox = document.getElementById("confirmPasswordBox");
  let confirmValue = document.getElementById("confirmPassword").value.trim();
  let passwordValue = document.getElementById("userPassword").value.trim();
  if (confirmValue == "") return hideConfirmError(messageContainer, confirmBox, false);
  if (passwordValue == confirmValue) return hideConfirmError(messageContainer, confirmBox, true);
  if (!touchedSignupFields.has("confirmPassword")) return hideConfirmError(messageContainer, confirmBox, false);
  messageContainer.classList.remove("d-none");
  confirmBox.classList.remove("margin-bottom24px");
  return false;
}

/**
 * Blendet die Confirm-Password-Fehlermeldung aus und gibt das übergebene Ergebnis zurück.
 *
 * @param {HTMLElement} messageContainer - Der Container der Fehlermeldung.
 * @param {HTMLElement} confirmBox - Die umgebende Box des Bestätigungsfeldes.
 * @param {boolean} result - Der Rückgabewert, der weitergereicht werden soll.
 * @returns {boolean} Der übergebene `result`-Wert.
 */
function hideConfirmError(messageContainer, confirmBox, result) {
  messageContainer.classList.add("d-none");
  confirmBox.classList.add("margin-bottom24px");
  return result;
}

/**
 * Validiert das Signup-Passwort (mindestens 6 Zeichen) und schaltet die Fehlermeldung um.
 *
 * @returns {boolean} True wenn das Passwort mindestens 6 Zeichen hat.
 */
function checkPassword() {
  const password = document.getElementById("userPassword").value;
  const valid = password.length >= 6;
  _applySignupFieldState("passwordBox", "requiredPassword", "userPassword", valid, password == "");
  clearPasswordMismatchMessage();
  return valid;
}

/**
 * Validiert den Signup-Namen (mindestens 5 Zeichen, mindestens ein Leerzeichen).
 *
 * @returns {boolean} True wenn der Name gültig ist.
 */
function checkName() {
  const name = document.getElementById("fullName").value.trim();
  const valid = name.length >= 5 && name.split(" ").length > 1;
  _applySignupFieldState("nameBox", "requiredName", "fullName", valid, name == "");
  return valid;
}

/**
 * Schaltet die Passwort-Sichtbarkeit und das zugehörige Lock/Unlock-Icon um.
 *
 * @param {string} iconId - Die ID des Icon-Elements.
 * @param {string} passwordInputfieldId - Die ID des zugehörigen Passwort-Eingabefeldes.
 */
function togglePasswordIcon(iconId, passwordInputfieldId) {
  let icon = document.getElementById(iconId);
  inputField = document.getElementById(passwordInputfieldId);
  if (icon.src.includes("unlock")) {
    inputField.type = "password";
    icon.src = "./img/lock.svg";
  } else {
    inputField.type = "text";
    icon.src = "./img/unlock.svg";
  }
}

/**
 * Schaltet den data-checked-Zustand und die visuelle Darstellung einer Checkbox um.
 *
 * @param {string} checkboxId - Die ID der umzuschaltenden Checkbox.
 */
function toggleCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.dataset.checked = checkbox.dataset.checked == true ? false : true;
  if (checkbox.checked) {
    checkbox.style.backgroundColor = "#2a3647";
    checkbox.style.color = "white";
  } else {
    checkbox.style.backgroundColor = "";
    checkbox.style.color = "black";
  }
}

/**
 * Zeigt einen Signup-Toast und leitet bei Erfolg nach 3 Sekunden zur Login-Seite weiter.
 *
 * @param {string} messageText - Der anzuzeigende Nachrichtentext.
 * @param {number} success - Truthy wenn nach 3s zur Login-Seite weitergeleitet werden soll.
 */
function showSignupMessage(messageText, success) {
  const successMessage = document.querySelector(".msg-signup");
  successMessage.style.display = "flex";
  document.getElementById("signupMessage").textContent = messageText;
  setTimeout(() => {
    successMessage.style.display = "none";
    if (success) window.location.href = "login.html";
  }, 3000);
}
