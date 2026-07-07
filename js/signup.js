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
    registerButton.onclick = registerUser;
    return true;
  } else {
    registerButton.className = "submit__button__disabled";
    registerButton.onclick = "";
    return false;
  }
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

  if (isEmailValid(email)) {
    messageContainer.classList.add("d-none");
    document.getElementById("emailBox").classList.add("margin-bottom24px");
    return true;
  } else if (email == "") {
    messageContainer.classList.add("d-none");
    document.getElementById("emailBox").classList.add("margin-bottom24px");
  } else {
    messageContainer.classList.remove("d-none");
    document.getElementById("emailBox").classList.remove("margin-bottom24px");
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

  if (document.getElementById("confirmPassword").value.trim() == "") {
    messageContainer.classList.add("d-none");
    document.getElementById("confirmPasswordBox").classList.add("margin-bottom24px");
    return false;
  }

  if (document.getElementById("userPassword").value.trim() == document.getElementById("confirmPassword").value.trim()) {
    messageContainer.classList.add("d-none");
    document.getElementById("confirmPasswordBox").classList.add("margin-bottom24px");
    return true;
  } else {
    messageContainer.classList.remove("d-none");
    document.getElementById("confirmPasswordBox").classList.remove("margin-bottom24px");
  }
  return false;
}

/**
 * Checks if the entered password meets the minimum length requirement (6 characters).
 *
 * @returns {boolean} True if the password is at least 6 characters long or empty, false otherwise.
 */
function checkPassword() {
  let messageContainer = document.getElementById("requiredPassword");

  let password = document.getElementById("userPassword").value;

  if (password.length >= 6) {
    messageContainer.classList.add("d-none");
    document.getElementById("passwordBox").classList.add("margin-bottom24px");
    return true;
  } else if (password == "") {
    messageContainer.classList.add("d-none");
    document.getElementById("passwordBox").classList.add("margin-bottom24px");
  } else {
    document.getElementById("passwordBox").classList.remove("margin-bottom24px");
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

  let name = document.getElementById("fullName").value.trim();

  if (name.length >= 5 && name.split(" ").length > 1) {
    messageContainer.classList.add("d-none");
    document.getElementById("nameBox").classList.add("margin-bottom24px");
    return true;
  } else if (name == "") {
    messageContainer.classList.add("d-none");
    document.getElementById("nameBox").classList.add("margin-bottom24px");
  } else {
    messageContainer.classList.remove("d-none");
    document.getElementById("nameBox").classList.remove("margin-bottom24px");
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