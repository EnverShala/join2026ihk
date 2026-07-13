/** Tracks blurred signup fields so required errors only show after blur. */
const touchedSignupFields = new Set();

/** Marks a signup field as touched and re-runs validation. */
function markSignupFieldTouched(fieldId) {
  touchedSignupFields.add(fieldId);
  checkSignUpButton();
}

/** Toggles the disabled state of the register button. */
function toggleSignUpButton() {
  document.getElementById("registerButton").disabled =
    document.getElementById("registerButton").disabled == true ? false : true;
}

/** Returns true if privacy checkbox is checked; else marks text red. */
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

/** Enables/disables the register button based on signup conditions. */
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

/** Submit handler: validates all fields, calls registerUser if valid. */
function handleSignUpSubmit(event) {
  event.preventDefault();
  ["fullName", "userEmail", "userPassword", "confirmPassword"].forEach(function (id) {
    touchedSignupFields.add(id);
  });
  if (checkSignUpButton()) registerUser();
  return false;
}

/** Returns true if name, email, password and privacy are all valid. */
function checkSignUpConditions() {
  return checkName() && checkEmail() && checkPassword() &&
    clearPasswordMismatchMessage() && checkPrivacyPolicy();
}

/** Applies the shared show/hide-error pattern to a signup field. */
function _applySignupFieldState(boxId, msgId, fieldId, isValid, isEmpty) {
  const box = document.getElementById(boxId);
  const msg = document.getElementById(msgId);
  const showError = !isValid && !isEmpty && touchedSignupFields.has(fieldId);
  msg.classList.toggle("d-none", !showError);
  box.classList.toggle("margin-bottom24px", !showError);
}

/** Validates the signup email and toggles its required message. */
function checkEmail() {
  const email = document.getElementById("userEmail").value.trim();
  const valid = isEmailValid(email);
  _applySignupFieldState("emailBox", "requiredEmail", "userEmail", valid, email == "");
  return valid;
}

/** Returns true if password and confirmation match (or confirm empty). */
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

/** Validates the signup password (min. 6 chars) and toggles error. */
function checkPassword() {
  const password = document.getElementById("userPassword").value;
  const valid = password.length >= 6;
  _applySignupFieldState("passwordBox", "requiredPassword", "userPassword", valid, password == "");
  clearPasswordMismatchMessage();
  return valid;
}

/** Validates the signup name (>=5 chars, contains space). */
function checkName() {
  const name = document.getElementById("fullName").value.trim();
  const valid = name.length >= 5 && name.split(" ").length > 1;
  _applySignupFieldState("nameBox", "requiredName", "fullName", valid, name == "");
  return valid;
}

/** Toggles password visibility and its lock/unlock icon. */
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

/** Toggles a checkbox's data-checked state and visual style. */
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

/** Shows a signup toast; redirects to login on success after 3s. */
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