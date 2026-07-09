let popupIdString = "";
let taskLevel = "To do";
/**
 * Asynchronously creates a new task. Retrieves task details from the form,
 * including title, description, due date, category, priority, subtasks, and
 * assigned users.  Saves the new task to the Firebase database using the
 * `saveTasks` function, displays a success message, and clears the form.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms (e.g., in a modal or popup).
 * @returns {Promise<void>}
 */
async function createTask(id = "") {
  let taskTitle = document.getElementById("title").value;
  let taskDescription = document.getElementById("description").value;
  let taskDate = document.getElementById("due-date-input").value;
  let taskCategory = document.getElementById("category-displayed").textContent.trim();

  let taskPrio = getTaskPrio(id);

  let subtaskItems = document.getElementById("subtaskList" + id).children;

  let taskSubtasks = subtaskListToString(subtaskItems);
  let assignedTo = getAssignedUsers(id);

  let attachmentCtx = id === "Popup" ? "popup" : "";
  let attachment = typeof getAttachmentJson === "function" ? getAttachmentJson(attachmentCtx) : "";

  let newTask = createTaskArray(taskTitle, taskDescription, taskDate, taskCategory, taskPrio, taskLevel, taskSubtasks, assignedTo, "", attachment);

  await saveTasks("/tasks", newTask);

  showSuccessMessage();
  clearForm(id);
  if (typeof clearAttachmentState === "function") clearAttachmentState(attachmentCtx);
}

/**
 * returns the children of an ul list as a string, seperated via the "|"
 */
function subtaskListToString(listChildren = []) {
  let taskSubtasks = "";

  if (listChildren.length > 0) {
    for (let i = 0; i < listChildren.length; i++) {
      taskSubtasks += listChildren[i].textContent.trim() + "|";
    }
    taskSubtasks = taskSubtasks.slice(0, -1);
  }
  return taskSubtasks;
}

/**
 * Creates a new task object with the provided details.
 * @param {string} newTitle The title of the new task.
 * @param {string} newDescription The description of the new task.
 * @param {string} newDate The due date of the new task.
 * @param {string} oldCategory The category of the new task.
 * @param {string} newPrio The priority of the new task.
 * @param {string} oldLevel The level of the new task.
 * @param {string} newSubtasks The subtasks of the new task (e.g., comma-separated).
 * @param {string} newAssigned The users assigned to the task (e.g., comma-separated).
 * @returns {object} A new task object.
 */
function createTaskArray(newTitle, newDescription, newDate, oldCategory, newPrio, oldLevel, newSubtasks, newAssigned, subtasksDone = "", attachments = "") {
  return {
    title: newTitle,
    description: newDescription,
    date: newDate,
    category: oldCategory,
    priority: newPrio,
    level: oldLevel,
    subtasks: newSubtasks,
    assigned: newAssigned,
    subtasksDone: subtasksDone,
    attachments: attachments,
  };
}

/**
 * Determines the priority of a task based on the active priority button.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms.
 * @returns {string} The priority of the task ("Urgent", "Medium", "Low", or "None").
 */
function getTaskPrio(id = "") {
  if (document.getElementById("urgent" + id).className.includes("btn-bg-change-urgent-onclick")) {
    return "Urgent";
  }
  if (document.getElementById("medium" + id).className.includes("btn-bg-change-medium-onclick")) {
    return "Medium";
  }
  if (document.getElementById("low" + id).className.includes("btn-bg-change-low-onclick")) {
    return "Low";
  }
  return "None";
}

/**
 * Clears the styling of all priority buttons, resetting them to their default state.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clearPrioButtons(id = "")
{
  document.getElementById('urgent' + id).className = "btn-prio";
  document.getElementById('urgent-whiteID' + id).className ="d-none";
  document.getElementById('urgentID' + id).className ="";
  document.getElementById('urgent' + id).style.boxShadow = "";

  document.getElementById('medium' + id).className = "btn-prio";
  document.getElementById('medium-whiteID' + id).className ="d-none";
  document.getElementById('mediumID' + id).className ="";
  document.getElementById('medium' + id).style.boxShadow = "";

  document.getElementById('low' + id).className = "btn-prio";
  document.getElementById('low-whiteID' + id).className ="d-none";
  document.getElementById('lowID' + id).className ="";
  document.getElementById('low' + id).style.boxShadow = "";
}

/**
 * Handles a click event on the "Urgent" priority button. If "Urgent" is already
 * selected, deselects it. Otherwise, deselects all other priority buttons and
 * selects "Urgent".
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clickOnUrgent(id = "") {
  if (getTaskPrio(id) == "Urgent") {
    clearPrioButtons(id);
    return;
  }

  clearPrioButtons(id);

  document.getElementById("urgent" + id).className = "btn-prio btn-bg-change-urgent-onclick prio-txt-color-set-white";
  document.getElementById("urgent" + id).style.boxShadow = "none";
  document.getElementById("urgentID" + id).className = "d-none";
  document.getElementById("urgent-whiteID" + id).className = "";
}

/**
 * Handles a click event on the "Medium" priority button. If "Medium" is already
 * selected, deselects it. Otherwise, deselects all other priority buttons and
 * selects "Medium".
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clickOnMedium(id = "") {
  if (getTaskPrio(id) == "Medium") {
    clearPrioButtons(id);
    return;
  }

  clearPrioButtons(id);

  document.getElementById("medium" + id).className = "btn-prio btn-bg-change-medium-onclick prio-txt-color-set-white";
  document.getElementById("medium" + id).style.boxShadow = "none";
  document.getElementById("mediumID" + id).className = "d-none";
  document.getElementById("medium-whiteID" + id).className = "";
}

/**
 * Handles a click event on the "Low" priority button. If "Low" is already
 * selected, deselects it. Otherwise, deselects all other priority buttons and
 * selects "Low".
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of priority buttons.
 */
function clickOnLow(id = "") {
  if (getTaskPrio(id) == "Low") {
    clearPrioButtons(id);
    return;
  }

  clearPrioButtons(id);

  document.getElementById("low" + id).className = "btn-prio btn-bg-change-low-onclick prio-txt-color-set-white";
  document.getElementById("low" + id).style.boxShadow = "none";
  document.getElementById("lowID" + id).className = "d-none";
  document.getElementById("low-whiteID" + id).className = "";
}

/**
 * Binds a one-shot capture-phase click listener that closes the dropdown when
 * the click lands outside both the trigger container and the dropdown itself.
 * Capture-phase ensures the listener fires even when an ancestor (e.g. the
 * edit popup) calls `event.stopPropagation()` in the bubble phase.
 */
function bindDropdownOutsideClose(dropdown, container) {
  const handler = (event) => {
    if (container && container.contains(event.target)) return;
    if (dropdown.contains(event.target)) return;
    dropdown.classList.remove("show");
    if (container) container.classList.remove("dropdown-open");
    document.removeEventListener("click", handler, true);
  };
  setTimeout(() => document.addEventListener("click", handler, true), 0);
}

/**
 * Toggles the visibility of a dropdown menu.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different dropdown menus.
 */
function toggleDropdown(id = "") {
  const dropdown = document.getElementById("myDropdown" + id);
  const container = document.getElementById("contacts-list" + id);
  if (!dropdown) return;
  const willOpen = !dropdown.classList.contains("show");
  dropdown.classList.toggle("show", willOpen);
  if (container) container.classList.toggle("dropdown-open", willOpen);
  if (willOpen) bindDropdownOutsideClose(dropdown, container);
}

/**
 * Kept for backward compatibility with inline onclick handlers.
 * The outside-close logic now lives inside `toggleDropdown` itself.
 */
function closeAssignedto(id = "") {}

/**
 * Kept for backward compatibility with inline onclick handlers.
 * The outside-close logic now lives inside `toggleDropdownCategory` itself.
 */
function closeCategory() {}

/**
 * Toggles the visibility of the category dropdown menu.
 */
function toggleDropdownCategory() {
  const dropdown = document.getElementById("myDropdownCategory");
  const container = document.getElementById("category-container");
  if (!dropdown) return;
  const willOpen = !dropdown.classList.contains("show");
  dropdown.classList.toggle("show", willOpen);
  if (container) container.classList.toggle("dropdown-open", willOpen);
  if (willOpen) bindDropdownOutsideClose(dropdown, container);
}

/**
 * Retrieves a comma-separated string of names of assigned users.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different sets of assigned user checkboxes.
 * @returns {string} A comma-separated string of assigned user names, or an
 *                   empty string if no users are assigned.
 */
function getAssignedUsers(id = "") {
  let newAssigned = "";

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      let checkbox = document.getElementById(`AssignedContact${id}${i}`);

      if(checkbox.checked == true) {
        newAssigned += users[i].name + ",";
      }
    }
    newAssigned = newAssigned.slice(0, -1);
  }
  return newAssigned;
}

/**
 * Asynchronously renders the assigned-to user list in the dropdown menu.
 * Loads user data, removes duplicate users based on email, and generates the
 * HTML for the assigned-to user list using the `createRenderAssignedToUserTemplate`
 * function.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different dropdown menus.
 * @returns {Promise<void>}
 */
async function renderAssignedTo(id = "") {
  let assignedMenu = document.getElementById("myDropdown" + id);
  let j = 1;

  assignedMenu.innerHTML = "";

  await loadUsers("/users");

  let uniqueUsers = [];
  users.forEach(user => {
      if (!uniqueUsers.some(uniqueUser => uniqueUser.email == user.email)) {
          uniqueUsers.push(user.name.trim());
      }
  });

  let htmlContent = "";

  for (let i = 0; i < uniqueUsers.length; i++) {
      htmlContent += createRenderAssignedToUserTemplate(i, j, getUserInitials(uniqueUsers[i]), uniqueUsers[i], id);

      j++;
      if (j > 15) {
          j = 1;
      }
  }

  assignedMenu.innerHTML = htmlContent;
}

/**
 * Toggles the checked state of a checkbox and updates its background.
 * @param {string} checkboxId The ID of the checkbox element.
 */
function toggleCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
  toggleBackground(checkbox);
}

/**
 * Toggles the background color and text color of a list item and adds/removes
 * a cloned contact circle to/from the selected contacts container based on the
 * checked state of a checkbox.
 * @param {HTMLInputElement} checkbox The checkbox element that triggered the toggle.
 */
function toggleBackground(checkbox) {
  const listItem = checkbox.closest(".list-item");
  const contactCircle = listItem.querySelector(".circle").cloneNode(true);
  const selectedContactsContainer = document.getElementById("selected-contacts-container" + popupIdString);

  if (checkbox.checked) {
    listItem.style.backgroundColor = "#2a3647";
    listItem.style.color = "white";
    selectedContactsContainer.appendChild(contactCircle);
  } else {
    listItem.style.backgroundColor = "";
    listItem.style.color = "black";

    const circles = selectedContactsContainer.querySelectorAll(".circle");
    circles.forEach((circle) => {
      if (circle.textContent.trim() === contactCircle.textContent.trim()) {
        selectedContactsContainer.removeChild(circle);
      }
    });
  }
}

/**
 * Clears the almost all the Form Fields
 */

function clearFormFields(id) {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('due-date-input').value = '';

  document.getElementById('title-required').style.display = 'none';

  document.getElementById('date-required').style.display = 'none';

  document.getElementById('category-required').style.display = 'none';

  document.getElementById('description-required').style.display = 'none';

  document.getElementById('assigned-to-required').style.display = 'none';

  document.getElementById('prio-required').style.display = 'none';

  document.getElementById('subtaskList' + id).innerHTML = '';
}

/**
 * Clears the task input form, resetting all fields to their default values.
 * This includes clearing text inputs, resetting the displayed category, clearing
 * priority buttons, closing the assigned-to dropdown, hiding error messages,
 * clearing the subtask list, clearing the subtask input field (depending on
 * whether it's in a popup or not), clearing the selected contacts container,
 * and unchecking all assigned-to checkboxes.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms.
 */

function clearForm(id = "") {
  clearFormFields(id);

  document.getElementById('category-displayed').textContent = 'Select task category';

  clearPrioButtons(id);
  clickOnMedium(id);

  closeAssignedto(id);

  let isPopup = id == "Popup" ? "addSubtaskInputPopup" : "addNewSubtaskInput";
  document.getElementById(isPopup).value = '';

  document.getElementById('selected-contacts-container' + id).innerHTML = '';

  const checkboxes = document.querySelectorAll(`#myDropdown${id} input[type="checkbox"]`);
  checkboxes.forEach(checkbox => {
      checkbox.checked = false;
      const listItem = checkbox.closest(".list-item");
      listItem.style.backgroundColor = '';
      listItem.style.color = 'black';
  });

  const attachCtx = id === "Popup" ? "popup" : "";
  if (typeof removeAttachment === "function") removeAttachment(attachCtx);
}

/**
 * Displays a success message and redirects the user to the board page after 3 seconds.
 */
function showSuccessMessage() {
  const successMessage = document.querySelector('.msg-task-added');
  successMessage.style.display = 'flex';

  setTimeout(() => {
      successMessage.style.display = 'none';
      window.location.href = "board.html";
  }, 3000);
}