/**
 * Tracks which signup fields have been blurred at least once. Required
 * messages are only surfaced after the user has left a field, so the very
 * first keystroke does not trigger a red error.
 */
const touchedSignupFields = new Set();

/**
 * Marks a signup field as touched and re-runs validation so the appropriate
 * required message (if any) shows immediately on blur.
 * @param {string} fieldId The id of the input element (fullName, userEmail, ...).
 */
function markSignupFieldTouched(fieldId) {
  touchedSignupFields.add(fieldId);
  checkSignUpButton();
}

/**
 * Toggles the disabled state of the register button.
 */
function toggleSignUpButton() {
  document.getElementById("registerButton").disabled =
    document.getElementById("registerButton").disabled == true ? false : true;
}

/**
 * Checks if the privacy policy checkbox is checked.  Styles the agreement text and link in red if not checked.
 *
 * @returns {boolean} True if the checkbox is checked, false otherwise.
 */
function checkPrivacyPolicy() {
  let agreeCheckbox = document.getElementById("agreeCheckbox").checked;

  if (agreeCheckbox) {
    document.getElementById("agreementText").classList.remove("redFont");
    document.getElementById("agreementLink").classList.remove("redFont");
    return true;
  } else {
    document.getElementById("agreementText").classList.add("redFont");
    document.getElementById("agreementLink").classList.add("redFont");
  }

  return false;
}

/**
 * Checks the signup conditions and enables/disables the register button accordingly.
 *
 * @returns {boolean} True if the signup conditions are met, false otherwise.
 */
function checkSignUpButton() {
  let registerButton = document.getElementById("registerButton");

  if (checkSignUpConditions()) {
    registerButton.className = "submit__button";
    registerButton.disabled = false;
    return true;
  } else {
    registerButton.className = "submit__button__disabled";
    registerButton.disabled = true;
    return false;
  }
}

/**
 * Form submit handler for the signup form. Prevents native submission,
 * revalidates all fields, and calls registerUser when all custom conditions
 * are met. The custom required messages remain the sole validation feedback
 * (the form uses `novalidate` to suppress native browser validation).
 *
 * @param {Event} event The submit event.
 * @returns {boolean} Always false to fully cancel default submission.
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
 * Checks all signup conditions (name, email, password, privacy policy).
 *
 * @returns {boolean} True if all conditions are met, false otherwise.
 */
function checkSignUpConditions() {
  if (
    checkName() &&
    checkEmail() &&
    checkPassword() &&
    clearPasswordMismatchMessage() &&
    checkPrivacyPolicy()
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if the entered email is valid.
 *
 * @returns {boolean} True if the email is valid or empty, false otherwise.
 */
function checkEmail() {
  let email = document.getElementById("userEmail").value.trim();
  let messageContainer = document.getElementById("requiredEmail");
  let emailBox = document.getElementById("emailBox");

  if (isEmailValid(email)) {
    messageContainer.classList.add("d-none");
    emailBox.classList.add("margin-bottom24px");
    return true;
  }
  if (email == "" || !touchedSignupFields.has("userEmail")) {
    messageContainer.classList.add("d-none");
    emailBox.classList.add("margin-bottom24px");
  } else {
    messageContainer.classList.remove("d-none");
    emailBox.classList.remove("margin-bottom24px");
  }
  return false;
}

/**
 * Clears the password mismatch message and checks if the password and confirmation match.
 *
 * @returns {boolean} True if the passwords match or the confirmation field is empty, false otherwise.
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

/** Hides the confirm-password error and returns the given result flag. */
function hideConfirmError(messageContainer, confirmBox, result) {
  messageContainer.classList.add("d-none");
  confirmBox.classList.add("margin-bottom24px");
  return result;
}

/**
 * Checks if the entered password meets the minimum length requirement (6 characters).
 *
 * @returns {boolean} True if the password is at least 6 characters long or empty, false otherwise.
 */
function checkPassword() {
  let messageContainer = document.getElementById("requiredPassword");
  let passwordBox = document.getElementById("passwordBox");
  let password = document.getElementById("userPassword").value;

  if (password.length >= 6) {
    messageContainer.classList.add("d-none");
    passwordBox.classList.add("margin-bottom24px");
    clearPasswordMismatchMessage();
    return true;
  }
  if (password == "" || !touchedSignupFields.has("userPassword")) {
    messageContainer.classList.add("d-none");
    passwordBox.classList.add("margin-bottom24px");
  } else {
    passwordBox.classList.remove("margin-bottom24px");
    messageContainer.classList.remove("d-none");
  }

  clearPasswordMismatchMessage();

  return false;
}

/**
 * Checks if the entered name is valid (at least 5 characters and contains at least one space).
 *
 * @returns {boolean} True if the name is valid or empty, false otherwise.
 */
function checkName() {
  let messageContainer = document.getElementById("requiredName");
  let nameBox = document.getElementById("nameBox");
  let name = document.getElementById("fullName").value.trim();

  if (name.length >= 5 && name.split(" ").length > 1) {
    messageContainer.classList.add("d-none");
    nameBox.classList.add("margin-bottom24px");
    return true;
  }
  if (name == "" || !touchedSignupFields.has("fullName")) {
    messageContainer.classList.add("d-none");
    nameBox.classList.add("margin-bottom24px");
  } else {
    messageContainer.classList.remove("d-none");
    nameBox.classList.remove("margin-bottom24px");
  }

  return false;
}

/**
 * Toggles the visibility of the password in a password input field.
 *
 * @param {string} iconId The ID of the icon element.
 * @param {string} passwordInputfieldId The ID of the password input field.
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
 * Toggles a checkbox and updates its visual appearance.
 * Uses a data attribute to track the checked state.
 *
 * @param {string} checkboxId The ID of the checkbox element.
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
 * Displays a signup message to the user.
 *
 * @param {string} messageText The text of the message to display.
 */
function showSignupMessage(messageText, success) {
  const successMessage = document.querySelector(".msg-signup");
  successMessage.style.display = "flex";
  document.getElementById("signupMessage").textContent = messageText;

  setTimeout(() => {
    successMessage.style.display = "none";
    if (success) {
      window.location.href = "login.html";
    }
  }, 3000);
}