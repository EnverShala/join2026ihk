let popupIdString = "";
let taskLevel = "To do";

/**
 * Reads all task-form fields into a plain object.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {Object} Object with title, description, date, category, prio, subtasks and assigned.
 */
function readTaskFormValues(id) {
  return {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    date: document.getElementById("due-date-input").value,
    category: document.getElementById("category-displayed").textContent.trim(),
    prio: getTaskPrio(id),
    subtasks: subtaskListToString(document.getElementById("subtaskList" + id).children),
    assigned: getAssignedUsers(id),
  };
}

/**
 * Creates a new task from the form fields and saves it to Firebase.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {Promise<void>} Resolved after the task has been saved.
 */
async function createTask(id = "") {
  const ctx = id === "Popup" ? "popup" : "";
  const attachment = typeof getAttachmentJson === "function" ? getAttachmentJson(ctx) : "";
  const f = readTaskFormValues(id);
  const newTask = createTaskArray(f.title, f.description, f.date, f.category, f.prio, taskLevel, f.subtasks, f.assigned, "", attachment);
  await saveTasks("/tasks", newTask);
  showSuccessMessage(id);
  clearForm(id);
  if (typeof clearAttachmentState === "function") clearAttachmentState(ctx);
}

/**
 * Joins the text of an ul's children with "|" separators.
 *
 * @param {HTMLCollection} listChildren - The child elements of a subtask list.
 * @returns {string} Pipe-separated subtask string.
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
 * Builds a plain task object from the given field values.
 *
 * @param {string} newTitle - The task title.
 * @param {string} newDescription - The task description.
 * @param {string} newDate - The due date (YYYY-MM-DD).
 * @param {string} oldCategory - The category label.
 * @param {string} newPrio - The priority ("Urgent" | "Medium" | "Low" | "None").
 * @param {string} oldLevel - The board column ("To do" | "In progress" | ...).
 * @param {string} newSubtasks - The pipe-separated subtask string.
 * @param {string} newAssigned - The comma-separated assigned users.
 * @param {string} [subtasksDone=""] - Pipe-separated completed subtasks.
 * @param {string} [attachments=""] - Attachments as JSON string or empty.
 * @returns {Object} The composed task object.
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
 * Returns the currently selected task priority.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {string} One of "Urgent", "Medium", "Low" or "None".
 */
function getTaskPrio(id = "") {
  if (document.getElementById("urgent" + id).className.includes("btn-bg-change-urgent-onclick")) return "Urgent";
  if (document.getElementById("medium" + id).className.includes("btn-bg-change-medium-onclick")) return "Medium";
  if (document.getElementById("low" + id).className.includes("btn-bg-change-low-onclick")) return "Low";
  return "None";
}

/**
 * Resets a single priority button (urgent/medium/low) to its default styling.
 *
 * @param {string} name - The priority name ("urgent", "medium" or "low").
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function resetPrioButton(name, id) {
  document.getElementById(name + id).className = "btn-prio";
  document.getElementById(name + "-whiteID" + id).className = "d-none";
  document.getElementById(name + "ID" + id).className = "";
  document.getElementById(name + id).style.boxShadow = "";
}

/**
 * Resets all priority buttons to their default styling.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clearPrioButtons(id = "") {
  resetPrioButton("urgent", id);
  resetPrioButton("medium", id);
  resetPrioButton("low", id);
}

/**
 * Activates a single priority button visually.
 *
 * @param {string} name - The priority name ("urgent", "medium" or "low").
 * @param {string} activeClass - The active CSS class ("btn-bg-change-urgent-onclick" ...).
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function _setPrioButtonActive(name, activeClass, id) {
  const btn = document.getElementById(name + id);
  if (!btn) return;
  btn.className = "btn-prio " + activeClass + " prio-txt-color-set-white";
  btn.style.boxShadow = "none";
  document.getElementById(name + "ID" + id).className = "d-none";
  document.getElementById(name + "-whiteID" + id).className = "";
}

/**
 * Toggles the "Urgent" priority button.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clickOnUrgent(id = "") {
  if (getTaskPrio(id) == "Urgent") { clearPrioButtons(id); return; }
  clearPrioButtons(id);
  _setPrioButtonActive("urgent", "btn-bg-change-urgent-onclick", id);
}

/**
 * Toggles the "Medium" priority button.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clickOnMedium(id = "") {
  if (getTaskPrio(id) == "Medium") { clearPrioButtons(id); return; }
  clearPrioButtons(id);
  _setPrioButtonActive("medium", "btn-bg-change-medium-onclick", id);
}

/**
 * Toggles the "Low" priority button.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clickOnLow(id = "") {
  if (getTaskPrio(id) == "Low") { clearPrioButtons(id); return; }
  clearPrioButtons(id);
  _setPrioButtonActive("low", "btn-bg-change-low-onclick", id);
}

/**
 * Adds a one-shot capture-phase outside-click listener to close a dropdown.
 *
 * @param {HTMLElement} dropdown - The dropdown element that should close on outside click.
 * @param {HTMLElement} container - The container element wrapping the dropdown trigger.
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
 * Toggles the assigned-to dropdown open/closed.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
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
 *
 * @param {string} [id=""] - Context suffix (unused).
 */
function closeAssignedto(id = "") {}

/**
 * Kept for backward compatibility with inline onclick handlers.
 */
function closeCategory() {}

/**
 * Toggles the category dropdown open/closed.
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
 * Returns a comma-separated string of names of assigned users.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {string} Comma-separated user names.
 */
function getAssignedUsers(id = "") {
  let newAssigned = "";
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      let checkbox = document.getElementById(`AssignedContact${id}${i}`);
      if (checkbox.checked == true) newAssigned += users[i].name + ",";
    }
    newAssigned = newAssigned.slice(0, -1);
  }
  return newAssigned;
}

/**
 * Builds the deduplicated list of unique assigned-user names.
 *
 * @returns {string[]} Array of unique trimmed user names.
 */
function getUniqueAssignedNames() {
  const seen = new Set();
  return users
    .filter(u => !seen.has(u.email) && seen.add(u.email))
    .map(u => u.name.trim());
}

/**
 * Renders the assigned-to user list in the dropdown, deduplicated by email.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {Promise<void>} Resolves after users are loaded and rendered.
 */
async function renderAssignedTo(id = "") {
  await loadUsers("/users");
  const uniqueNames = getUniqueAssignedNames();
  let html = "", j = 1;
  for (let i = 0; i < uniqueNames.length; i++) {
    html += createRenderAssignedToUserTemplate(i, j, getUserInitials(uniqueNames[i]), uniqueNames[i], id);
    j = j >= 15 ? 1 : j + 1;
  }
  document.getElementById("myDropdown" + id).innerHTML = html;
}

/**
 * Toggles a checkbox and updates its background/text styling.
 *
 * @param {string} checkboxId - The DOM id of the checkbox to toggle.
 */
function toggleCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
  toggleBackground(checkbox);
}

/**
 * Applies the visual "selected" state to the list item of a checkbox.
 *
 * @param {HTMLElement} listItem - The list item element.
 * @param {boolean} checked - Whether the checkbox is checked.
 */
function applyListItemSelectedStyle(listItem, checked) {
  listItem.style.backgroundColor = checked ? "#2a3647" : "";
  listItem.style.color = checked ? "white" : "black";
}

/**
 * Applies background/text color changes for the assigned-contact list item.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element that was toggled.
 */
function toggleBackground(checkbox) {
  const listItem = checkbox.closest(".list-item");
  const circle = listItem.querySelector(".circle").cloneNode(true);
  const container = document.getElementById("selected-contacts-container" + popupIdString);
  applyListItemSelectedStyle(listItem, checkbox.checked);
  syncSelectedContactChip(container, circle, checkbox.checked);
  applySelectedContactsOverflow(container);
}

/**
 * Hides all "required" hint messages of the task form.
 */
function hideRequiredHints() {
  document.getElementById('title-required').style.display = 'none';
  document.getElementById('date-required').style.display = 'none';
  document.getElementById('category-required').style.display = 'none';
  document.getElementById('description-required').style.display = 'none';
  document.getElementById('assigned-to-required').style.display = 'none';
  document.getElementById('prio-required').style.display = 'none';
}

/**
 * Clears the primary form field values and hides all "required" hints.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clearFormFields(id) {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('due-date-input').value = '';
  hideRequiredHints();
  document.getElementById('subtaskList' + id).innerHTML = '';
}

/**
 * Clears the entire task input form, resetting all fields and states.
 *
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clearForm(id = "") {
  clearFormFields(id);
  document.getElementById('category-displayed').textContent = 'Select task category';
  clearPrioButtons(id);
  clickOnMedium(id);
  closeAssignedto(id);
  clearSubtaskInputAndState(id);
  document.getElementById('selected-contacts-container' + id).innerHTML = '';
  resetAssignedCheckboxes(id);
  const attachCtx = id === "Popup" ? "popup" : "";
  if (typeof removeAttachment === "function") removeAttachment(attachCtx);
}

/**
 * Clears the subtask input field and any subtask-array state for the form.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function clearSubtaskInputAndState(id) {
  const inputId = id == "Popup" ? "addSubtaskInputPopup" : "addNewSubtaskInput";
  document.getElementById(inputId).value = '';
  if (id === "" && typeof window.__resetAddTaskSubtasks === "function") {
    window.__resetAddTaskSubtasks();
  }
  if (id === "Popup" && typeof subtasksArrayPopup !== "undefined") {
    subtasksArrayPopup.length = 0;
  }
}

/**
 * Unchecks every assigned-user checkbox in the given form and resets item styling.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 */
function resetAssignedCheckboxes(id) {
  const checkboxes = document.querySelectorAll(`#myDropdown${id} input[type="checkbox"]`);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    const listItem = checkbox.closest(".list-item");
    listItem.style.backgroundColor = '';
    listItem.style.color = 'black';
  });
}

/**
 * Shows the "task added" toast. On the board popup, closes the modal and
 * re-renders the board cards in place; on the standalone task page, redirects
 * to the board.
 *
 * @param {string} [id=""] - Context suffix ("" = standalone task page, "Popup" = board modal).
 */
function showSuccessMessage(id = "") {
  const successMessage = document.querySelector('.msg-task-added');
  successMessage.style.display = 'flex';
  setTimeout(() => {
    successMessage.style.display = 'none';
    if (id === "Popup") {
      const modal = document.getElementById("myModal");
      if (modal && typeof modal.close === "function") modal.close();
      if (typeof closeModal === "function") closeModal();
      if (typeof renderTaskCards === "function") renderTaskCards();
    } else {
      window.location.href = "board.html";
    }
  }, 3000);
}
