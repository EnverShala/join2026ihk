/** Mobile breakpoint kept in sync with the sidebar/contacts CSS. */
const CONTACTS_MOBILE_MAX = 800;

/** Deletes a user and removes them from every task's assigned list. @param {string} id */
async function deleteUser(id) {
  await loadTasks("/tasks");
  const user = users.find((u) => u.id == id);
  if (user) await removeUserFromAssignedTasks(user.name);
  await fetch(FIREBASE_URL + `/users/${id}` + ".json", { method: "DELETE" });
  await renderContacts();
  loadUserInformation(-1);
  if (typeof closePopup === "function") closePopup();
}

/** Strips the given name from every task's `assigned` field and persists. @param {string} userName */
async function removeUserFromAssignedTasks(userName) {
  for (let j = 0; j < tasks.length; j++) {
    if (!tasks[j].assigned.includes(userName)) continue;
    tasks[j].assigned = normalizeAssignedString(tasks[j].assigned.replace(userName, ""));
    await editTask(tasks[j].id, tasks[j]);
  }
}

/** Cleans double/leading/trailing commas from an assigned-users string. @param {string} str @return {string} */
function normalizeAssignedString(str) {
  let out = str.replace(",,", ",");
  if (out[out.length - 1] == ",") out = out.slice(0, -1);
  if (out[0] == ",") out = out.slice(1);
  return out;
}

/** Updates user `id` from the edit form and persists to Firebase. @param {string} id @param {Object} data */
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

/** Returns the id of the user with `email`, or -1 if not found. @param {string} email @return {string|number} */
function getUserId(email) {
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) return users[i].id;
    }
  } else {
    return -1;
  }
}

/** Renders the contact list grouped by first letter of the name. */
async function renderContacts() {
  await loadUsers("/users");
  let html = "", firstLetter = "0", j = 1;
  for (let i = 0; i < users.length; i++) {
    const initial = users[i].name[0].toUpperCase();
    if (initial != firstLetter) { html += contactsFirstLetterTemplate(initial); firstLetter = initial; }
    html += contactTemplate(i, j);
    j = j >= 15 ? 1 : j + 1;
  }
  const list = document.getElementById("contact-list");
  if (!list) return;
  list.innerHTML = html;
  removeHover();
}

/** Returns 1-2 character initials from a full name. @param {string} username @return {string} */
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

/** Loads user info into the contact detail UI (id=-1 clears). @param {number} id */
async function loadUserInformation(id) {
  if (!document.getElementById("contact-name")) return;
  document.getElementById("contact-name").innerHTML = id == -1 ? "" : users[id].name;
  document.getElementById("contact-email").innerHTML = id == -1 ? "" : users[id].email;
  document.getElementById("contact-phone").innerHTML = id == -1 ? "" : users[id].phone;
  document.getElementById("ellipse").innerHTML = id == -1 ? "" : getUserInitials(users[id].name);
  document.getElementById("display-contactID").classList.toggle("d-none", id == -1);
  if (id != -1) {
    const color = document.getElementById(`userColor${id}`).className.split(" ")[1];
    document.getElementById("ellipse").className = `ellipse ${color}`;
    highlightUser(id);
    fitNameToContainer();
  }
  currentUser = id;
}

/** Hides the list and shows the back-arrow when opening a contact on mobile. */
function hideContactsListInResponsiveMode() {
  if (window.innerWidth <= CONTACTS_MOBILE_MAX) {
    document.getElementById("contact-list").classList.add("d-none");
    document.getElementById("add-contact-containerID").style.display = "none";
    document.getElementById("back-arrow-on-responsiveID").classList.remove("d-none");
    showContactsInDetailInResponsiveMode();
  }
}

/** Applies contacts layout for the current viewport and selection. */
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

/** Collects the DOM elements needed by `applyContactsLayoutForWidth`. */
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

/** Desktop layout: everything visible; refit the name if a contact is selected. @param {Object} els @param {boolean} hasSelection */
function applyDesktopContactsLayout(els, hasSelection) {
  els.header.style.display = "";
  els.detail.style.display = "";
  els.addBtn.style.display = "";
  els.list.classList.remove("d-none");
  els.backArrow.classList.add("d-none");
  if (hasSelection) fitNameToContainer();
}

/** Mobile with selection: detail visible, list hidden, back-arrow shown. @param {Object} els */
function applyMobileContactsDetailLayout(els) {
  els.header.style.display = "flex";
  els.detail.style.display = "flex";
  els.addBtn.style.display = "none";
  els.list.classList.add("d-none");
  els.backArrow.classList.remove("d-none");
  fitNameToContainer();
}

/** Mobile without selection: list visible, detail hidden. @param {Object} els */
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

/** Highlights the given contact container as selected. @param {number} id */
function changeBgOnSelectedUser(id) {
  document.getElementById("contact-containerID").classList.add("selected-user-color");
}

/** Renders the contacts and clears the detail view. */
async function initContacts() {
  await renderContacts();
  loadUserInformation(-1);
}

/** Highlights a single user in the list. @param {number} userIndex */
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
