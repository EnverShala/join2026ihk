let popupIdString = "";
let taskLevel = "To do";

/** Reads all task-form fields into a plain object. */
function readTaskFormValues(id) {
  return {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    date: document.getElementById("due-date-input").value,
    category: document.getElementById("category-displayed").textContent.trim(),
    prio: getTaskPrio(id),
    subtasks: subtaskListToString(document.getElementById("subtaskList" + id).children),
    assigned: getAssignedUsers(id),
  };
}

/** Creates a new task from the form fields and saves it to Firebase. */
async function createTask(id = "") {
  const ctx = id === "Popup" ? "popup" : "";
  const attachment = typeof getAttachmentJson === "function" ? getAttachmentJson(ctx) : "";
  const f = readTaskFormValues(id);
  const newTask = createTaskArray(f.title, f.description, f.date, f.category, f.prio, taskLevel, f.subtasks, f.assigned, "", attachment);
  await saveTasks("/tasks", newTask);
  showSuccessMessage();
  clearForm(id);
  if (typeof clearAttachmentState === "function") clearAttachmentState(ctx);
}

/** Joins the text of an <ul>'s children with "|" separators. */
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

/** Builds a plain task object from the given field values. */
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

/** Returns the currently selected task priority ("Urgent" / "Medium" / "Low" / "None"). */
function getTaskPrio(id = "") {
  if (document.getElementById("urgent" + id).className.includes("btn-bg-change-urgent-onclick")) return "Urgent";
  if (document.getElementById("medium" + id).className.includes("btn-bg-change-medium-onclick")) return "Medium";
  if (document.getElementById("low" + id).className.includes("btn-bg-change-low-onclick")) return "Low";
  return "None";
}

/** Resets all priority buttons to their default styling. */
function clearPrioButtons(id = "") {
  document.getElementById('urgent' + id).className = "btn-prio";
  document.getElementById('urgent-whiteID' + id).className = "d-none";
  document.getElementById('urgentID' + id).className = "";
  document.getElementById('urgent' + id).style.boxShadow = "";

  document.getElementById('medium' + id).className = "btn-prio";
  document.getElementById('medium-whiteID' + id).className = "d-none";
  document.getElementById('mediumID' + id).className = "";
  document.getElementById('medium' + id).style.boxShadow = "";

  document.getElementById('low' + id).className = "btn-prio";
  document.getElementById('low-whiteID' + id).className = "d-none";
  document.getElementById('lowID' + id).className = "";
  document.getElementById('low' + id).style.boxShadow = "";
}

/** Toggles the "Urgent" priority button. */
function clickOnUrgent(id = "") {
  if (getTaskPrio(id) == "Urgent") { clearPrioButtons(id); return; }
  clearPrioButtons(id);
  document.getElementById("urgent" + id).className = "btn-prio btn-bg-change-urgent-onclick prio-txt-color-set-white";
  document.getElementById("urgent" + id).style.boxShadow = "none";
  document.getElementById("urgentID" + id).className = "d-none";
  document.getElementById("urgent-whiteID" + id).className = "";
}

/** Toggles the "Medium" priority button. */
function clickOnMedium(id = "") {
  if (getTaskPrio(id) == "Medium") { clearPrioButtons(id); return; }
  clearPrioButtons(id);
  document.getElementById("medium" + id).className = "btn-prio btn-bg-change-medium-onclick prio-txt-color-set-white";
  document.getElementById("medium" + id).style.boxShadow = "none";
  document.getElementById("mediumID" + id).className = "d-none";
  document.getElementById("medium-whiteID" + id).className = "";
}

/** Toggles the "Low" priority button. */
function clickOnLow(id = "") {
  if (getTaskPrio(id) == "Low") { clearPrioButtons(id); return; }
  clearPrioButtons(id);
  document.getElementById("low" + id).className = "btn-prio btn-bg-change-low-onclick prio-txt-color-set-white";
  document.getElementById("low" + id).style.boxShadow = "none";
  document.getElementById("lowID" + id).className = "d-none";
  document.getElementById("low-whiteID" + id).className = "";
}

/** Adds a one-shot capture-phase outside-click listener to close a dropdown. */
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

/** Toggles the assigned-to dropdown. */
function toggleDropdown(id = "") {
  const dropdown = document.getElementById("myDropdown" + id);
  const container = document.getElementById("contacts-list" + id);
  if (!dropdown) return;
  const willOpen = !dropdown.classList.contains("show");
  dropdown.classList.toggle("show", willOpen);
  if (container) container.classList.toggle("dropdown-open", willOpen);
  if (willOpen) bindDropdownOutsideClose(dropdown, container);
}

/** Kept for backward compatibility with inline onclick handlers. */
function closeAssignedto(id = "") {}

/** Kept for backward compatibility with inline onclick handlers. */
function closeCategory() {}

/** Toggles the category dropdown. */
function toggleDropdownCategory() {
  const dropdown = document.getElementById("myDropdownCategory");
  const container = document.getElementById("category-container");
  if (!dropdown) return;
  const willOpen = !dropdown.classList.contains("show");
  dropdown.classList.toggle("show", willOpen);
  if (container) container.classList.toggle("dropdown-open", willOpen);
  if (willOpen) bindDropdownOutsideClose(dropdown, container);
}

/** Returns a comma-separated string of names of assigned users. */
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

/** Renders the assigned-to user list in the dropdown. Deduplicates by email. */
async function renderAssignedTo(id = "") {
  await loadUsers("/users");
  const seen = new Set();
  const uniqueNames = users.filter(u => !seen.has(u.email) && seen.add(u.email)).map(u => u.name.trim());
  let html = "", j = 1;
  for (let i = 0; i < uniqueNames.length; i++) {
    html += createRenderAssignedToUserTemplate(i, j, getUserInitials(uniqueNames[i]), uniqueNames[i], id);
    j = j >= 15 ? 1 : j + 1;
  }
  document.getElementById("myDropdown" + id).innerHTML = html;
}

/** Toggles a checkbox and updates its background/text styling. */
function toggleCheckbox(checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
  toggleBackground(checkbox);
}

/** Applies background/text color changes for the assigned-contact list item. */
function toggleBackground(checkbox) {
  const listItem = checkbox.closest(".list-item");
  const circle = listItem.querySelector(".circle").cloneNode(true);
  const container = document.getElementById("selected-contacts-container" + popupIdString);
  listItem.style.backgroundColor = checkbox.checked ? "#2a3647" : "";
  listItem.style.color = checkbox.checked ? "white" : "black";
  if (checkbox.checked) {
    container.appendChild(circle);
  } else {
    container.querySelectorAll(".circle:not(.overflow-chip)").forEach(c => {
      if (c.textContent.trim() === circle.textContent.trim()) container.removeChild(c);
    });
  }
  applySelectedContactsOverflow(container);
}

/** Shows max 5 contact circles + a "+N" overflow chip. */
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

/** Clears the primary form field values and hides all "required" hints. */
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

/** Clears the entire task input form, resetting all fields and states. */
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

/** Clears the subtask input field and any subtask-array state for the form. */
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

/** Unchecks every assigned-user checkbox in the given form and resets item styling. */
function resetAssignedCheckboxes(id) {
  const checkboxes = document.querySelectorAll(`#myDropdown${id} input[type="checkbox"]`);
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
    const listItem = checkbox.closest(".list-item");
    listItem.style.backgroundColor = '';
    listItem.style.color = 'black';
  });
}

/** Shows the "task added" toast and redirects to the board after 3s. */
function showSuccessMessage() {
  const successMessage = document.querySelector('.msg-task-added');
  successMessage.style.display = 'flex';
  setTimeout(() => {
    successMessage.style.display = 'none';
    window.location.href = "board.html";
  }, 3000);
}
