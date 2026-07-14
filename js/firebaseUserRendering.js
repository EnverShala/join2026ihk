const CONTACTS_MOBILE_MAX = 800;

/**
 * Deletes a user and removes them from every task's assigned list.
 *
 * @param {string} id - The Firebase id of the user to delete.
 * @returns {Promise<void>}
 */
async function deleteUser(id) {
  await loadTasks("/tasks");
  const user = users.find((u) => u.id == id);
  if (user) await removeUserFromAssignedTasks(user.name);
  await fetch(FIREBASE_URL + `/users/${id}` + ".json", { method: "DELETE" });
  await renderContacts();
  loadUserInformation(-1);
  if (typeof closePopup === "function") closePopup();
}

/**
 * Strips the given name from every task's `assigned` field and persists.
 *
 * @param {string} userName - The name to remove from all assigned lists.
 * @returns {Promise<void>}
 */
async function removeUserFromAssignedTasks(userName) {
  for (let j = 0; j < tasks.length; j++) {
    if (!tasks[j].assigned.includes(userName)) continue;
    tasks[j].assigned = normalizeAssignedString(tasks[j].assigned.replace(userName, ""));
    await editTask(tasks[j].id, tasks[j]);
  }
}

/**
 * Cleans double, leading and trailing commas from an assigned-users string.
 *
 * @param {string} str - The raw assigned-users string.
 * @returns {string} The normalized assigned-users string.
 */
function normalizeAssignedString(str) {
  let out = str.replace(",,", ",");
  if (out[out.length - 1] == ",") out = out.slice(0, -1);
  if (out[0] == ",") out = out.slice(1);
  return out;
}

/**
 * Updates user `id` from the edit form and persists to Firebase.
 *
 * @param {string} id - The Firebase id of the user to update.
 * @param {Object} [data={}] - The user payload to update, mutated with form values.
 * @returns {Promise<void>}
 */
async function editUser(id, data = {}) {
  readEditUserForm(data);
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
 * Reads the edit-user form fields into the given data object.
 *
 * @param {Object} data - The user payload to be enriched with form values.
 * @returns {void}
 */
function readEditUserForm(data) {
  data.name = document.getElementById("name").value.trim();
  data.email = document.getElementById("email").value.trim();
  data.phone = document.getElementById("phone").value.trim();
}

/**
 * Returns the id of the user with `email`, or -1 if not found.
 *
 * @param {string} email - The email address to look up.
 * @returns {string|number} The user id, or -1 if there are no users.
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
 *
 * @returns {Promise<void>}
 */
async function renderContacts() {
  await loadUsers("/users");
  const html = buildContactsHtml();
  const list = document.getElementById("contact-list");
  if (!list) return;
  list.innerHTML = html;
  removeHover();
}

/**
 * Builds the HTML string for the grouped contact list.
 *
 * @returns {string} The concatenated HTML for all contacts.
 */
function buildContactsHtml() {
  let html = "", firstLetter = "0", j = 1;
  for (let i = 0; i < users.length; i++) {
    const initial = users[i].name[0].toUpperCase();
    if (initial != firstLetter) {
      html += contactsFirstLetterTemplate(initial);
      firstLetter = initial;
    }
    html += contactTemplate(i, j);
    j = j >= 15 ? 1 : j + 1;
  }
  return html;
}

/**
 * Returns 1-2 character initials from a full name.
 *
 * @param {string} username - The full name to derive initials from.
 * @returns {string} The uppercase initials, or an empty string for blank input.
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
 * Loads user info into the contact detail UI. Passing id === -1 clears the view.
 *
 * @param {number} id - The index of the user in `users`, or -1 to clear.
 * @returns {Promise<void>}
 */
async function loadUserInformation(id) {
  if (!document.getElementById("contact-name")) return;
  fillContactDetailFields(id);
  document.getElementById("display-contactID").classList.toggle("d-none", id == -1);
  if (id != -1) {
    applyContactDetailColor(id);
    highlightUser(id);
    fitNameToContainer();
  }
  currentUser = id;
}

/**
 * Fills the contact detail text fields for the user at `id`, or clears them for -1.
 *
 * @param {number} id - The index of the user in `users`, or -1 to clear.
 * @returns {void}
 */
function fillContactDetailFields(id) {
  document.getElementById("contact-name").innerHTML = id == -1 ? "" : users[id].name;
  document.getElementById("contact-email").innerHTML = id == -1 ? "" : users[id].email;
  document.getElementById("contact-phone").innerHTML = id == -1 ? "" : users[id].phone;
  document.getElementById("ellipse").innerHTML = id == -1 ? "" : getUserInitials(users[id].name);
}

/**
 * Applies the color class of the user's swatch to the detail ellipse.
 *
 * @param {number} id - The index of the user in `users`.
 * @returns {void}
 */
function applyContactDetailColor(id) {
  const color = document.getElementById(`userColor${id}`).className.split(" ")[1];
  document.getElementById("ellipse").className = `ellipse ${color}`;
}

/**
 * Hides the list and shows the back-arrow when opening a contact on mobile.
 *
 * @returns {void}
 */
function hideContactsListInResponsiveMode() {
  if (window.innerWidth <= CONTACTS_MOBILE_MAX) {
    document.getElementById("contact-list").classList.add("d-none");
    document.getElementById("add-contact-containerID").style.display = "none";
    document.getElementById("back-arrow-on-responsiveID").classList.remove("d-none");
    showContactsInDetailInResponsiveMode();
  }
}

/**
 * Applies contacts layout for the current viewport and selection.
 *
 * @returns {void}
 */
function applyContactsLayoutForWidth() {
  const els = getContactsLayoutElements();
  if (!els) return;
  const hasSelection = typeof currentUser !== "undefined" && currentUser !== null && currentUser !== -1;
  if (window.innerWidth > CONTACTS_MOBILE_MAX) {
    applyDesktopContactsLayout(els, hasSelection);
  } else if (hasSelection) {
    applyMobileContactsDetailLayout(els);
  } else {
    applyMobileContactsListLayout(els);
  }
}

/**
 * Collects the DOM elements needed by `applyContactsLayoutForWidth`.
 *
 * @returns {Object|null} An object with the referenced elements, or null if any is missing.
 */
function getContactsLayoutElements() {
  const els = {
    header: document.getElementById("display-contact-headerID"),
    detail: document.getElementById("display-contactID"),
    addBtn: document.getElementById("add-contact-containerID"),
    list: document.getElementById("contact-list"),
    backArrow: document.getElementById("back-arrow-on-responsiveID"),
  };
  if (!els.header || !els.detail || !els.addBtn || !els.list || !els.backArrow) return null;
  return els;
}

/**
 * Applies the desktop contacts layout, refitting the name if a contact is selected.
 *
 * @param {Object} els - The layout elements returned by `getContactsLayoutElements`.
 * @param {boolean} hasSelection - Whether a contact is currently selected.
 * @returns {void}
 */
function applyDesktopContactsLayout(els, hasSelection) {
  els.header.style.display = "";
  els.detail.style.display = "";
  els.addBtn.style.display = "";
  els.list.classList.remove("d-none");
  els.backArrow.classList.add("d-none");
  if (hasSelection) fitNameToContainer();
}

/**
 * Applies the mobile layout when a contact is selected (detail visible, list hidden).
 *
 * @param {Object} els - The layout elements returned by `getContactsLayoutElements`.
 * @returns {void}
 */
function applyMobileContactsDetailLayout(els) {
  els.header.style.display = "flex";
  els.detail.style.display = "flex";
  els.addBtn.style.display = "none";
  els.list.classList.add("d-none");
  els.backArrow.classList.remove("d-none");
  fitNameToContainer();
}

/**
 * Applies the mobile layout without a selection (list visible, detail hidden).
 *
 * @param {Object} els - The layout elements returned by `getContactsLayoutElements`.
 * @returns {void}
 */
function applyMobileContactsListLayout(els) {
  els.header.style.display = "flex";
  els.detail.style.display = "none";
  els.addBtn.style.display = "";
  els.list.classList.remove("d-none");
  els.backArrow.classList.add("d-none");
}

window.onresize = function showContactListOnExitResponsiveMode() {
  if (!window.location.href.includes("contacts.html")) return;
  applyContactsLayoutForWidth();
};

/**
 * Displays the contact detail section on mobile.
 *
 * @returns {void}
 */
function showContactsInDetailInResponsiveMode() {
  document.getElementById("display-contact-headerID").style.display = "flex";
  document.getElementById("display-contactID").style.display = "flex";
  fitNameToContainer();
}

/**
 * Back-arrow handler that returns to the contact list on mobile.
 *
 * @returns {void}
 */
function showContactListAgainInResponsiveMode() {
  if (window.innerWidth <= CONTACTS_MOBILE_MAX) {
    document.getElementById("display-contact-headerID").style.display = "flex";
    document.getElementById("display-contactID").style.display = "none";
    document.getElementById("contact-list").classList.remove("d-none");
    document.getElementById("add-contact-containerID").style.display = "flex";
    document.getElementById("back-arrow-on-responsiveID").classList.add("d-none");
  }
}

/**
 * Highlights the given contact container as selected.
 *
 * @param {number} id - The index of the selected contact (currently unused).
 * @returns {void}
 */
function changeBgOnSelectedUser(id) {
  document.getElementById("contact-containerID").classList.add("selected-user-color");
}

/**
 * Renders the contacts and clears the detail view.
 *
 * @returns {Promise<void>}
 */
async function initContacts() {
  await renderContacts();
  loadUserInformation(-1);
}

/**
 * Highlights a single user in the list.
 *
 * @param {number} userIndex - The index of the user to highlight.
 * @returns {void}
 */
function highlightUser(userIndex) {
  for (let i = 0; i < users.length; i++) {
    document.getElementById(`user-container${i}`).classList.remove("highlightUser");
  }
  document.getElementById(`user-container${userIndex}`).classList.add("highlightUser");
}

/**
 * Marks the last-clicked contact container so hover styles don't stick to it.
 *
 * @returns {void}
 */
function removeHover() {
  document.querySelectorAll(".contact-container").forEach((selContact) =>
    selContact.addEventListener("click", () => {
      document.querySelector(".contact-container-no-hover")?.classList.remove("contact-container-no-hover");
      selContact.classList.add("contact-container-no-hover");
    })
  );
}

/**
 * Adds or removes the contact-chip in the selected-contacts container.
 *
 * @param {HTMLElement} container - The selected-contacts container.
 * @param {HTMLElement} circle - The cloned circle element for the contact.
 * @param {boolean} checked - Whether the checkbox is checked.
 */
function syncSelectedContactChip(container, circle, checked) {
  if (checked) {
    container.appendChild(circle);
    return;
  }
  container.querySelectorAll(".circle:not(.overflow-chip)").forEach(c => {
    if (c.textContent.trim() === circle.textContent.trim()) container.removeChild(c);
  });
}

/**
 * Shows max 5 contact circles and hides the rest, then appends a "+N" overflow chip.
 *
 * @param {HTMLElement} container - The selected-contacts container.
 */
function applySelectedContactsOverflow(container) {
  if (!container) return;
  const MAX_VISIBLE = 5;
  container.querySelectorAll(".circle.overflow-chip").forEach(chip => chip.remove());
  const circles = Array.from(container.querySelectorAll(".circle"));
  circles.forEach((c, i) => { c.style.display = (i < MAX_VISIBLE) ? "" : "none"; });
  if (circles.length > MAX_VISIBLE) {
    const chip = document.createElement("div");
    chip.className = "circle overflow-chip";
    chip.textContent = "+" + (circles.length - MAX_VISIBLE);
    container.appendChild(chip);
  }
}
