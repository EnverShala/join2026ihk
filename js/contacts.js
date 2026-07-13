const CONTACT_PHONE_REGEX = /^[0-9]{6,16}$/;

/** Strips any non-digit characters from a phone input so only 0-9 remain. @param {HTMLInputElement} input */
function filterPhoneInput(input) {
  const cleaned = input.value.replace(/[^0-9]/g, "");
  if (input.value !== cleaned) input.value = cleaned;
}

/** Validates a contact-form field and toggles its inline error. @param {string} field @return {boolean} */
function validateContactField(field) {
  const input = document.getElementById(field);
  const errorEl = document.getElementById(field + "-error");
  if (!input || !errorEl) return true;
  const value = input.value.trim();
  let valid = true;
  if (field === "name") valid = value.length > 0;
  else if (field === "email") valid = isEmailValid(value);
  else if (field === "phone") valid = CONTACT_PHONE_REGEX.test(value);
  errorEl.style.visibility = valid ? "hidden" : "visible";
  return valid;
}

/** Runs all three contact field validators. @return {boolean} */
function validateContactForm() {
  const nameOk = validateContactField("name");
  const emailOk = validateContactField("email");
  const phoneOk = validateContactField("phone");
  return nameOk && emailOk && phoneOk;
}

/** Form submit handler for Add Contact: validate, save, then close popup. @return {boolean} */
function handleAddContact() {
  if (!validateContactForm()) return false;
  addUser().then(() => closePopup());
  return false;
}

/** Form submit handler for Edit Contact: validate, then save. @return {boolean} */
function handleEditContact() {
  if (!validateContactForm()) return false;
  editUser(users[currentUser].id, users[currentUser]);
  return false;
}

/** Fetches "addContacts.html" and shows it as a popup. */
function addNewUser() {
  fetch("addContacts.html")
    .then((response) => response.text())
    .then((data) => {
      const doc = new DOMParser().parseFromString(data, "text/html");
      document.getElementById("popup-body").innerHTML = doc.body.innerHTML;
      document.getElementById("popup").style.display = "block";
    });
}

/** Hides the popup and clears its body content. */
function closePopup() {
  fetch("addContacts.html").then((response) => response.text());
  document.getElementById("popup-body").innerHTML = "";
  document.getElementById("popup").style.display = "none";
}

/** Opens "editContacts.html" popup and pre-fills the current user. */
function editUserPopup() {
  fetch("editContacts.html")
    .then((response) => response.text())
    .then((data) => {
      const doc = new DOMParser().parseFromString(data, "text/html");
      document.getElementById("popup-body").innerHTML = doc.body.innerHTML;
      document.getElementById("popup").style.display = "block";

      document.getElementById("name").value = users[currentUser].name;
      document.getElementById("email").value = users[currentUser].email;
      document.getElementById("phone").value = (users[currentUser].phone || "").replace(/[^0-9]/g, "");

      renderEditPopupAvatar();
    });
}

/** Sets the edit-popup avatar to the current contact's initials/color. */
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

/** Adds a new user and closes the popup. */
async function addUserButton() {
  await addUser();
  closePopup();
}
