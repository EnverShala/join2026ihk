const CONTACTS_MOBILE_MAX = 800;

/**
 * Prüft, ob die Contacts-Seite gerade im Mobile-Layout dargestellt wird —
 * per Breite (≤800px) oder erzwungen auf Portrait-Touch-Geräten bis 1280px
 * (gleiche Bedingung wie die Media Queries in contactsResponsive.css).
 *
 * @returns {boolean} True im Mobile-Layout.
 */
function isContactsMobileLayout() {
  if (window.innerWidth <= CONTACTS_MOBILE_MAX) return true;
  return window.matchMedia("(orientation: portrait) and (pointer: coarse) and (max-width: 1280px)").matches;
}

/* User-CRUD (deleteUser, editUser, Task-Propagation) liegt in firebaseUserCrud.js */

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
  if (isContactsMobileLayout()) {
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
  if (!isContactsMobileLayout()) {
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
  if (isContactsMobileLayout()) {
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
