/**
 * Deletes a user and removes them from every task's assigned list.
 * @param {string} id The Firebase id of the user to delete.
 * @returns {Promise<void>}
 */
async function deleteUser(id) {
  await loadTasks("/tasks");

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].assigned.includes(users[i].name)) {
          tasks[j].assigned = tasks[j].assigned.replace(users[i].name, "");
          tasks[j].assigned = tasks[j].assigned.replace(",,", ",");
          if (tasks[j].assigned[tasks[j].assigned.length - 1] == ",") {
            tasks[j].assigned = tasks[j].assigned.slice(0, -1);
          }
          if (tasks[j].assigned[0] == ",") {
            tasks[j].assigned = tasks[j].assigned.slice(1);
          }
          await editTask(tasks[j].id, tasks[j]);
        }
      }
    }
  }

  await fetch(FIREBASE_URL + `/users/${id}` + ".json", { method: "DELETE" });

  await renderContacts();
  loadUserInformation(-1);
  if (typeof closePopup === "function") closePopup();
}

/**
 * Edits an existing user with values from the edit form and updates Firebase.
 * @param {string} id The user id.
 * @param {object} [data={}] The user data object (will be mutated).
 * @returns {Promise<void>}
 */
async function editUser(id, data = {}) {
  data.name = document.getElementById("name").value;
  data.email = document.getElementById("email").value;
  data.phone = document.getElementById("phone").value;

  await fetch(FIREBASE_URL + `/users/${id}` + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  await renderContacts();
  loadUserInformation(currentUser);
  closePopup();
}

/**
 * Returns the id of a user matching the given email, or -1 if not found.
 * @param {string} email The email to search for.
 * @returns {string|number} User id, or -1 when not found.
 */
function getUserId(email) {
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) return users[i].id;
    }
  } else {
    return -1;
  }
}

/**
 * Renders the contact list grouped by first letter of the name.
 * @returns {Promise<void>}
 */
async function renderContacts() {
  let html = "";
  let firstLetter = "0";
  let j = 1;

  await loadUsers("/users");

  for (let i = 0; i < users.length; i++) {
    if (users[i].name[0].toUpperCase() != firstLetter.toUpperCase()) {
      html += contactsFirstLetterTemplate(users[i].name[0].toUpperCase());
      firstLetter = users[i].name[0].toUpperCase();
    }

    html += contactTemplate(i, j);

    j++;
    if (j > 15) j = 1;
  }

  const contactList = document.getElementById("contact-list");
  if (!contactList) return;
  contactList.innerHTML = html;
  removeHover();
}

/**
 * Generates 1-2 character initials from a full name.
 * @param {string} username The name to derive initials from.
 * @returns {string} The initials (empty when name is empty).
 */
function getUserInitials(username) {
  if (username.trim() == "") return "";

  let result = username.trim().split(" ").map((wort) => wort[0].toUpperCase());

  if (username.split(" ").length > 1) {
    result = result[0] + result[result.length - 1];
  } else {
    result = result[0];
  }
  return result;
}

/**
 * Loads user info into the contact detail UI. Pass id=-1 to clear.
 * @param {number} id User index in `users`, or -1 to clear.
 */
async function loadUserInformation(id) {
  if (!document.getElementById("contact-name")) return;
  document.getElementById("contact-name").innerHTML = id == -1 ? "" : users[id].name;
  document.getElementById("contact-email").innerHTML = id == -1 ? "" : users[id].email;
  document.getElementById("contact-phone").innerHTML = id == -1 ? "" : users[id].phone;
  document.getElementById("ellipse").innerHTML = id == -1 ? "" : getUserInitials(users[id].name);

  if (id == -1) {
    document.getElementById("display-contactID").classList.add("d-none");
  } else {
    document.getElementById("display-contactID").classList.remove("d-none");
    let userEllipseColor = document.getElementById(`userColor${id}`).className.split(" ")[1];
    document.getElementById("ellipse").className = `ellipse ${userEllipseColor}`;
    highlightUser(id);
    fitNameToContainer();
  }
  currentUser = id;
}

/** Mobile breakpoint kept in sync with the sidebar/contacts CSS. */
const CONTACTS_MOBILE_MAX = 800;

/** Hides the list and shows the back-arrow when opening a contact on mobile. */
function hideContactsListInResponsiveMode() {
  if (window.innerWidth <= CONTACTS_MOBILE_MAX) {
    document.getElementById("contact-list").classList.add("d-none");
    document.getElementById("add-contact-containerID").style.display = "none";
    document.getElementById("back-arrow-on-responsiveID").classList.remove("d-none");
    showContactsInDetailInResponsiveMode();
  }
}

/**
 * Reconciles the contacts layout for the current viewport width and selection.
 * - Desktop: list + detail visible via CSS.
 * - Mobile with selection: detail visible, list + add-button hidden, back arrow shown.
 * - Mobile without selection: list visible, detail hidden.
 */
function applyContactsLayoutForWidth() {
  const header = document.getElementById("display-contact-headerID");
  const detail = document.getElementById("display-contactID");
  const addBtn = document.getElementById("add-contact-containerID");
  const list = document.getElementById("contact-list");
  const backArrow = document.getElementById("back-arrow-on-responsiveID");
  if (!header || !detail || !addBtn || !list || !backArrow) return;

  const hasSelection = typeof currentUser !== "undefined" && currentUser !== null && currentUser !== -1;

  if (window.innerWidth > CONTACTS_MOBILE_MAX) {
    header.style.display = "";
    detail.style.display = "";
    addBtn.style.display = "";
    list.classList.remove("d-none");
    backArrow.classList.add("d-none");
    if (hasSelection) fitNameToContainer();
    return;
  }

  if (hasSelection) {
    header.style.display = "flex";
    detail.style.display = "flex";
    addBtn.style.display = "none";
    list.classList.add("d-none");
    backArrow.classList.remove("d-none");
    fitNameToContainer();
  } else {
    header.style.display = "flex";
    detail.style.display = "none";
    addBtn.style.display = "";
    list.classList.remove("d-none");
    backArrow.classList.add("d-none");
  }
}

window.onresize = function showContactListOnExitResponsiveMode() {
  if (!window.location.href.includes("contacts.html")) return;
  applyContactsLayoutForWidth();
};

/** Displays the contact detail section on mobile. */
function showContactsInDetailInResponsiveMode() {
  document.getElementById("display-contact-headerID").style.display = "flex";
  document.getElementById("display-contactID").style.display = "flex";
  fitNameToContainer();
}

/** Back-arrow handler: returns to the contact list on mobile. */
function showContactListAgainInResponsiveMode() {
  if (window.innerWidth <= CONTACTS_MOBILE_MAX) {
    document.getElementById("display-contact-headerID").style.display = "flex";
    document.getElementById("display-contactID").style.display = "none";
    document.getElementById("contact-list").classList.remove("d-none");
    document.getElementById("add-contact-containerID").style.display = "flex";
    document.getElementById("back-arrow-on-responsiveID").classList.add("d-none");
  }
}

/** Highlights the given contact container as selected. */
function changeBgOnSelectedUser(id) {
  document.getElementById("contact-containerID").classList.add("selected-user-color");
}

/** Renders the contacts and clears the detail view. */
async function initContacts() {
  await renderContacts();
  loadUserInformation(-1);
}

/** Highlights a single user in the list. */
function highlightUser(userIndex) {
  for (let i = 0; i < users.length; i++) {
    document.getElementById(`user-container${i}`).classList.remove("highlightUser");
  }
  document.getElementById(`user-container${userIndex}`).classList.add("highlightUser");
}

/** Marks the last-clicked contact container so hover styles don't stick to it. */
function removeHover() {
  document.querySelectorAll(".contact-container").forEach((selContact) =>
    selContact.addEventListener("click", () => {
      document.querySelector(".contact-container-no-hover")?.classList.remove("contact-container-no-hover");
      selContact.classList.add("contact-container-no-hover");
    })
  );
}
