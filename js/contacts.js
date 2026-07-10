const CONTACT_PHONE_REGEX = /^[0-9\-+\s()]{6,16}$/;

/**
 * Validates a single contact-form field and shows/hides its error message.
 * Used for onblur/oninput on the name/email/phone inputs so the user gets
 * inline feedback without the browser's default HTML5 popup.
 * @param {"name"|"email"|"phone"} field
 * @returns {boolean} whether the field is currently valid
 */
function validateContactField(field) {
  const input = document.getElementById(field);
  const errorEl = document.getElementById(field + "-error");
  if (!input || !errorEl) return true;
  const value = input.value.trim();
  let valid = true;
  if (field === "name") valid = value.length > 0;
  else if (field === "email") valid = isEmailValid(value);
  else if (field === "phone") valid = CONTACT_PHONE_REGEX.test(value);
  errorEl.style.display = valid ? "none" : "block";
  return valid;
}

function validateContactForm() {
  const nameOk = validateContactField("name");
  const emailOk = validateContactField("email");
  const phoneOk = validateContactField("phone");
  return nameOk && emailOk && phoneOk;
}

function handleAddContact() {
  if (!validateContactForm()) return false;
  addUser().then(() => closePopup());
  return false;
}

function handleEditContact() {
  if (!validateContactForm()) return false;
  editUser(users[currentUser].id, users[currentUser]);
  return false;
}

/**
 * Loads the content of "addContacts.html" and displays it in a pop-up.
 *
 * The function fetches the HTML file, sets its content inside the element
 * with the ID "popup-body," and makes the pop-up with the ID "popup" visible.
 */
function addNewUser() {
  fetch("addContacts.html")
    .then((response) => response.text())
    .then((data) => {
      const doc = new DOMParser().parseFromString(data, "text/html");
      document.getElementById("popup-body").innerHTML = doc.body.innerHTML;
      document.getElementById("popup").style.display = "block";
    });
}

/**
 * Closes the pop-up and clears its content.
 *
 * The function sets the inner HTML of the element with the ID "popup-body"
 * to an empty string and hides the pop-up with the ID "popup."
 */
function closePopup() {
  fetch("addContacts.html").then((response) => response.text());
  document.getElementById("popup-body").innerHTML = "";
  document.getElementById("popup").style.display = "none";
}

/**
 * Loads "editContacts.html" into the pop-up and pre-fills user data.
 * Assumes `users[currentUser]` contains the selected user's details.
 */
function editUserPopup() {
  fetch("editContacts.html")
    .then((response) => response.text())
    .then((data) => {
      const doc = new DOMParser().parseFromString(data, "text/html");
      document.getElementById("popup-body").innerHTML = doc.body.innerHTML;
      document.getElementById("popup").style.display = "block";

      document.getElementById("name").value = users[currentUser].name;
      document.getElementById("email").value = users[currentUser].email;
      document.getElementById("phone").value = users[currentUser].phone;
    });
}

/**
 * Adds a new user and closes the pop-up.
 *
 * Calls the `addUser` function asynchronously, then hides the pop-up
 * by calling `closePopup()`.
 */
async function addUserButton() {
  await addUser();
  closePopup();
}
