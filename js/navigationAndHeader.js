/**
 * Entfernt Ziffern aus dem Wert eines Namens-Eingabefeldes.
 *
 * @param {HTMLInputElement} input - Das Namens-Eingabefeld.
 * @returns {void}
 */
function filterNameInput(input) {
  const cleaned = input.value.replace(/[0-9]/g, "");
  if (input.value !== cleaned) input.value = cleaned;
}

/**
 * Displays the logged-in user's initials (or "G" for guests) in header icons.
 *
 * @returns {void}
 */
function loadAccountInitials() {
  const icons = document.querySelectorAll("#header-profile-icon");
  if (!icons.length) return;
  const state = getAccountInitialsState();
  if (!state.isRealUser && !state.guestLoggedIn) return;
  showHeaderIcons();
  const initials = state.isRealUser
    ? getUserInitials(state.name && state.name !== "" ? state.name : "Guest")
    : "G";
  icons.forEach(icon => (icon.innerHTML = initials));
}

/**
 * Collects login state used to render header initials.
 *
 * @returns {{isRealUser: boolean, guestLoggedIn: boolean, name: string}} The account state snapshot.
 */
function getAccountInitialsState() {
  const loggedInAccount = localStorage.getItem("loggedInAccount");
  return {
    isRealUser: !!(loggedInAccount && loggedInAccount !== ""),
    guestLoggedIn: sessionStorage.getItem("guestLoggedIn") === "true",
    name: localStorage.getItem("username") || "",
  };
}

/**
 * Makes header icons visible in both desktop and mobile layouts.
 *
 * @returns {void}
 */
function showHeaderIcons() {
  document.querySelectorAll(".desktop-header .header-icons").forEach(el => (el.style.display = "flex"));
  document.querySelectorAll(".mobile-header .profile-icon").forEach(el => (el.style.display = "flex"));
}

/**
 * Shrinks the contact-detail name font-size until the text fits its container.
 *
 * @returns {void}
 */
function fitNameToContainer() {
  const span = document.getElementById("contact-name");
  if (!span) return;
  const container = span.closest(".contact-name");
  if (!container || container.clientWidth === 0) return;
  span.style.fontSize = "";
  const maxSize = parseInt(getComputedStyle(span).fontSize) || 40;
  for (let size = maxSize; size >= 16; size--) {
    span.style.fontSize = size + "px";
    if (span.scrollWidth <= container.clientWidth) break;
  }
}

/**
 * Marks the sidebar/nav link matching the current URL as active.
 *
 * @param {string} selector - The CSS selector for candidate anchor elements.
 * @param {string} currentPage - The current page filename to match against.
 * @returns {void}
 */
function markActiveNavLink(selector, currentPage) {
  document.querySelectorAll(selector).forEach(a => {
    let href = (a.getAttribute("href") || "").toLowerCase();
    if (!href) return;
    href = href.replace(/^\.\//, "");
    if (href === currentPage || currentPage.endsWith("/" + href)) {
      a.classList.add("active");
    }
  });
}

/**
 * Injects a Log-In link into the desktop sidebar for guest visitors.
 *
 * @returns {void}
 */
function injectGuestLoginLink() {
  const sidebar = document.querySelector(".desktop-sidebar");
  if (!sidebar || sidebar.querySelector(".login-sidebar-link")) return;
  const loginLink = buildGuestLoginLink();
  const logo = sidebar.querySelector(".logo-sidebar");
  if (logo && logo.parentNode) {
    logo.insertAdjacentElement("afterend", loginLink);
  } else {
    sidebar.prepend(loginLink);
  }
}

/**
 * Builds the anchor element used as the guest sidebar login link.
 *
 * @returns {HTMLAnchorElement} The freshly created login link element.
 */
function buildGuestLoginLink() {
  const loginLink = document.createElement("a");
  loginLink.href = "./login.html";
  loginLink.className = "login-sidebar-link";
  loginLink.innerHTML =
    '<svg class="login-sidebar-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' +
    '<span>Log In</span>';
  return loginLink;
}

/**
 * Restructures nav for guest visitors on privacy/legal/help pages.
 *
 * @returns {void}
 */
function hideNavIfNotLoggedIn() {
  const currentPage = (window.location.pathname.split("/").pop() || "").toLowerCase();
  markAllNavLinksActive(currentPage);
  if (isCurrentlyLoggedIn()) {
    document.body.classList.add("logged-in");
    return;
  }
  applyGuestNavLayout(currentPage);
}

/**
 * Marks all known nav-link groups as active for the given page.
 *
 * @param {string} currentPage - The current page filename to match against.
 * @returns {void}
 */
function markAllNavLinksActive(currentPage) {
  [
    ".nav-links-footer a",
    ".menu-sidebar .nav-links",
    ".mobile-nav .container-nav-links > a",
    ".sub-menu a",
  ].forEach(sel => markActiveNavLink(sel, currentPage));
}

/**
 * Checks whether a real user or a guest is currently logged in.
 *
 * @returns {boolean} True if either a real user or a guest session is active.
 */
function isCurrentlyLoggedIn() {
  return (localStorage.getItem("loggedInAccount") || "") !== "" ||
    sessionStorage.getItem("guestLoggedIn") === "true";
}

/**
 * Applies the guest-view DOM tweaks for privacy/legal/help pages.
 *
 * @param {string} currentPage - The current page filename (lowercase).
 * @returns {void}
 */
function applyGuestNavLayout(currentPage) {
  document.body.classList.add("guest-view");
  document.querySelectorAll(".desktop-sidebar .menu-sidebar").forEach(el => el.remove());
  injectGuestLoginLink();
  document.querySelectorAll(".desktop-header .header-icons").forEach(el => (el.style.display = "none"));
  document.querySelectorAll(".mobile-header .profile-icon").forEach(el => (el.style.display = "none"));
  buildGuestMobileNav(currentPage);
}

/**
 * Replaces the mobile bottom nav with the guest menu (Log In, Privacy
 * Policy, Legal notice) using the same colors and active/hover styling
 * as the desktop sidebar.
 *
 * @param {string} currentPage - The current page filename (lowercase).
 * @returns {void}
 */
function buildGuestMobileNav(currentPage) {
  const nav = document.querySelector(".mobile-nav");
  if (!nav) return;
  const loginIcon = buildGuestLoginLink().querySelector("svg").outerHTML;
  nav.innerHTML = `
    <ul class="container-nav-links">
      <a href="./login.html"><div class="nav-links">${loginIcon}<li>Log In</li></div></a>
      <span class="guest-nav-spacer"></span>
      <a href="./privacy.html"><div class="nav-links"><li>Privacy Policy</li></div></a>
      <a href="./legalNotice.html"><div class="nav-links"><li>Legal notice</li></div></a>
    </ul>`;
  markActiveNavLink(".mobile-nav .container-nav-links > a", currentPage);
}
