
/**
 * Asynchronously deletes a user and updates associated tasks.
 * Loads all tasks, finds tasks assigned to the user to be deleted,
 * removes the user's name from the assigned list for those tasks,
 * updates the tasks in the database, and finally deletes the user.
 * Re-renders the contact list and updates user information display.
 * @param {string} id The ID of the user to delete.
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
            if(tasks[j].assigned[tasks[j].assigned.length - 1] == ",") { tasks[j].assigned = tasks[j].assigned.slice(0, -1); }
            if(tasks[j].assigned[0] == ",") { tasks[j].assigned = tasks[j].assigned.slice(1); }
            await editTask(tasks[j].id, tasks[j]);
          }
        }
      }
    }
  
    await fetch(FIREBASE_URL + `/users/${id}` + ".json", { method: "DELETE", });
  
    await renderContacts();
    loadUserInformation(-1);
  }
  
  /**
   * Asynchronously edits an existing user. Retrieves updated user data from the
   * form, updates the user data object, saves the changes to the Firebase database
   * using the PUT method, re-renders the contact list, updates the displayed user
   * information, and closes the edit popup.
   * @param {string} id The ID of the user to edit.
   * @param {object} [data={}] The current user data.  This object will be modified
   *                           by the function.
   * @returns {Promise<void>}
   */
  async function editUser(id, data = {}) {
    data.name = document.getElementById("name").value;
    data.email = document.getElementById("email").value;
    data.phone = document.getElementById("phone").value;
  
    await fetch(FIREBASE_URL + `/users/${id}` + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    await renderContacts();
    loadUserInformation(currentUser);
    closePopup();
  }
  
  /**
   * Retrieves the ID of a user based on their email address.
   * @param {string} email The email address of the user.
   * @returns {string|number} The ID of the user if found, or -1 if the user is not found.
   * Default Value -1 means User not found
   */
  function getUserId(email) {
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        if (users[i].email == email) {
          return users[i].id;
        }
      }
    } else {
      return -1;
    }
  }
  
  /**
   * Asynchronously renders the contact list. Loads user data, groups contacts
   * by the first letter of their name, and generates the HTML for the contact list.
   * The `contactTemplate` function is assumed to be defined elsewhere and generates
   * the HTML for individual contacts.  After rendering, calls `removeHover` to
   * presumably remove any hover effects from the previous rendering.
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
      if (j > 15) { j = 1; }
    }
  
    const contactList = document.getElementById("contact-list");
    if (!contactList) return;
    contactList.innerHTML = html;
    removeHover();
  }
  
  /**
   * Generates user initials from a username.
   * If the username contains multiple words, the initials are formed from the first
   * letter of the first and last words.  If the username contains only one word,
   * the initial is the first letter of that word.
   * @param {string} username The username to generate initials from.
   * @returns {string} The user initials.
   */
  function getUserInitials(username) {
    if(username.trim() == "") { return "";}
  
    let result = username.trim().split(" ").map((wort) => wort[0].toUpperCase());
  
    if (username.split(" ").length > 1) {
      result = result[0] + result[result.length - 1];
    } else {
      result = result[0];
    }
    return result;
  }
  
  /**
   * Loads user info into the UI or clears it if id is -1.
   * @async
   * @param {number} id - User ID (-1 to clear).
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
  
  /**
   * Mobile breakpoint — kept in sync with the sidebar/contacts CSS
   * `max-width: 800px` media queries so the layout switches cleanly.
   */
  const CONTACTS_MOBILE_MAX = 800;

  /**
   * Hides the contacts list and shows the back arrow when a contact is opened
   * in mobile view (viewport <= CONTACTS_MOBILE_MAX).
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
   * Reconciles the contacts layout for the current viewport width and
   * selection state. Called on resize and after user selection changes.
   * - Desktop (> CONTACTS_MOBILE_MAX): clear inline styles, list + detail visible via CSS.
   * - Mobile with a contact selected: show detail, hide list, show back arrow.
   * - Mobile without a contact selected: show list, hide detail (avoids the
   *   empty "Contacts / Better with a team" screen that the previous handler
   *   left behind when shrinking the browser).
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
      header.style.display = "none";
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


  /**
   * Displays the contact details section in mobile view when a contact is opened.
   */
  function showContactsInDetailInResponsiveMode() {
    document.getElementById("display-contact-headerID").style.display = "flex";
    document.getElementById("display-contactID").style.display = "flex";
    fitNameToContainer();
  }

  /**
   * Back-arrow handler: returns from a contact detail to the list in mobile view.
   */
  function showContactListAgainInResponsiveMode() {
    if (window.innerWidth <= CONTACTS_MOBILE_MAX) {
      document.getElementById("display-contact-headerID").style.display = "none";
      document.getElementById("display-contactID").style.display = "none";
      document.getElementById("contact-list").classList.remove("d-none");
      document.getElementById("add-contact-containerID").style.display = "flex";
      document.getElementById("back-arrow-on-responsiveID").classList.add("d-none");
    }
  }
  
  /**
   * Adds a background color class to highlight the selected user.
   * @param {number} id - The ID of the selected user (unused in the function).
   */
  function changeBgOnSelectedUser(id) {
    document.getElementById("contact-containerID").classList.add("selected-user-color");
  }
  
  /**
   * Initializes the contacts by rendering them and resetting the user information display.
   * @async
   */
  async function initContacts() {
    await renderContacts();
    loadUserInformation(-1);
  }
  
  /**
   * Highlights a user in the contact list. Removes the highlight from all other
   * users and adds the highlight to the specified user.
   * @param {number} userIndex The index of the user to highlight.
   */
  function highlightUser(userIndex) {
    for (let i = 0; i < users.length; i++) {
      document.getElementById(`user-container${i}`).classList.remove("highlightUser");
    }
    document.getElementById(`user-container${userIndex}`).classList.add("highlightUser");
  }
  
  /**
   * Adds a click event listener to each contact container element.
   * When a contact container is clicked, it removes the "contact-container-no-hover"
   * class from any other contact container that has it and then adds the class to
   * the clicked container. This effectively prevents hover effects on the
   * currently selected contact.
   */
  function removeHover() {
    document.querySelectorAll(".contact-container").forEach(selContact =>
      selContact.addEventListener("click", () => {
          document.querySelector(".contact-container-no-hover")?.classList.remove("contact-container-no-hover"); 
          selContact.classList.add("contact-container-no-hover");
      })
  );
  }
  