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
      document.getElementById("popup-body").innerHTML = data;
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
      document.getElementById("popup-body").innerHTML = data;
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
