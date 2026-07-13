const CONTACT_PHONE_REGEX = /^[0-9]{6,16}$/;

/**
 * Strips any non-digit characters from a phone input so only 0-9 remain.
 *
 * @param {HTMLInputElement} input - Das Telefon-Eingabefeld.
 */
function filterPhoneInput(input) {
  const cleaned = input.value.replace(/[^0-9]/g, "");
  if (input.value !== cleaned) input.value = cleaned;
}

/**
 * Ermittelt, ob ein Feldwert nach den Regeln des Feldnamens gültig ist.
 *
 * @param {string} field - Der Name des Feldes ("name", "email" oder "phone").
 * @param {string} value - Der zu prüfende Wert (bereits getrimmt).
 * @returns {boolean} True wenn der Wert für das Feld gültig ist.
 */
function _isContactFieldValid(field, value) {
  if (field === "name") return value.length > 0;
  if (field === "email") return isEmailValid(value);
  if (field === "phone") return CONTACT_PHONE_REGEX.test(value);
  return true;
}

/**
 * Validiert ein einzelnes Kontakt-Formularfeld und schaltet die Fehlermeldung.
 *
 * @param {string} field - Der Feldname ("name", "email" oder "phone").
 * @returns {boolean} True wenn das Feld gültig ist.
 */
function validateContactField(field) {
  const input = document.getElementById(field);
  const errorEl = document.getElementById(field + "-error");
  if (!input || !errorEl) return true;
  const valid = _isContactFieldValid(field, input.value.trim());
  errorEl.style.visibility = valid ? "hidden" : "visible";
  return valid;
}

/**
 * Führt alle drei Kontaktfeld-Validierungen aus.
 *
 * @returns {boolean} True wenn alle Felder gültig sind.
 */
function validateContactForm() {
  const nameOk = validateContactField("name");
  const emailOk = validateContactField("email");
  const phoneOk = validateContactField("phone");
  return nameOk && emailOk && phoneOk;
}

/**
 * Submit-Handler für "Kontakt hinzufügen": validiert, speichert und schließt das Popup.
 *
 * @returns {boolean} Immer false, um das Standard-Submit zu verhindern.
 */
function handleAddContact() {
  if (!validateContactForm()) return false;
  addUser().then(() => closePopup());
  return false;
}

/**
 * Submit-Handler für "Kontakt bearbeiten": validiert und speichert den aktuellen User.
 *
 * @returns {boolean} Immer false, um das Standard-Submit zu verhindern.
 */
function handleEditContact() {
  if (!validateContactForm()) return false;
  editUser(users[currentUser].id, users[currentUser]);
  return false;
}

/**
 * Injiziert den geladenen HTML-Text in den Popup-Body und zeigt das Popup.
 *
 * @param {string} data - Der Roh-HTML-Text der geladenen Seite.
 */
function _injectPopupHtml(data) {
  const doc = new DOMParser().parseFromString(data, "text/html");
  document.getElementById("popup-body").innerHTML = doc.body.innerHTML;
  document.getElementById("popup").style.display = "block";
}

/**
 * Holt "addContacts.html" und zeigt den Inhalt als Popup an.
 */
function addNewUser() {
  fetch("addContacts.html")
    .then((response) => response.text())
    .then((data) => _injectPopupHtml(data));
}

/**
 * Blendet das Popup aus und leert dessen Inhalt.
 */
function closePopup() {
  fetch("addContacts.html").then((response) => response.text());
  document.getElementById("popup-body").innerHTML = "";
  document.getElementById("popup").style.display = "none";
}

/**
 * Befüllt die Eingabefelder des Edit-Popups mit den Daten des aktuellen Users.
 */
function _fillEditPopupFields() {
  document.getElementById("name").value = users[currentUser].name;
  document.getElementById("email").value = users[currentUser].email;
  document.getElementById("phone").value = (users[currentUser].phone || "").replace(/[^0-9]/g, "");
}

/**
 * Öffnet das "editContacts.html"-Popup und befüllt es mit dem aktuellen User.
 */
function editUserPopup() {
  fetch("editContacts.html")
    .then((response) => response.text())
    .then((data) => {
      _injectPopupHtml(data);
      _fillEditPopupFields();
      renderEditPopupAvatar();
    });
}

/**
 * Setzt Initialen und Farbe des Avatars im Edit-Popup passend zum aktuellen Kontakt.
 */
function renderEditPopupAvatar() {
  const popUpImg = document.querySelector(".popUpImg");
  if (!popUpImg || currentUser == null || !users[currentUser]) return;
  const listAvatarEl = document.getElementById(`userColor${currentUser}`);
  popUpImg.innerHTML = getUserInitials(users[currentUser].name);
  if (!listAvatarEl) return;
  const colorClass = Array.from(listAvatarEl.classList).find(c => c.startsWith("initialsColor"));
  if (colorClass) popUpImg.classList.add(colorClass);
  popUpImg.style.backgroundColor = window.getComputedStyle(listAvatarEl).backgroundColor;
}

/**
 * Legt einen neuen User an und schließt das Popup nach dem Speichern.
 *
 * @returns {Promise<void>} Aufgelöst, sobald der User angelegt und das Popup geschlossen ist.
 */
async function addUserButton() {
  await addUser();
  closePopup();
}
