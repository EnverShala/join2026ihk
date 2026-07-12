let popupIdString = "";
let taskLevel = "To do";

/** Creates a new task from the form fields and saves it to Firebase. */
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

/**
 * Binds a one-shot capture-phase click listener that closes the dropdown when
 * the click lands outside both the trigger container and the dropdown itself.
 * Capture-phase fires even when ancestors call stopPropagation() in the bubble phase.
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
    if (j > 15) j = 1;
  }
  assignedMenu.innerHTML = htmlContent;
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
  const contactCircle = listItem.querySelector(".circle").cloneNode(true);
  const selectedContactsContainer = document.getElementById("selected-contacts-container" + popupIdString);
  if (checkbox.checked) {
    listItem.style.backgroundColor = "#2a3647";
    listItem.style.color = "white";
    selectedContactsContainer.appendChild(contactCircle);
  } else {
    listItem.style.backgroundColor = "";
    listItem.style.color = "black";
    const circles = selectedContactsContainer.querySelectorAll(".circle:not(.overflow-chip)");
    circles.forEach((circle) => {
      if (circle.textContent.trim() === contactCircle.textContent.trim()) {
        selectedContactsContainer.removeChild(circle);
      }
    });
  }
  applySelectedContactsOverflow(selectedContactsContainer);
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
  let isPopup = id == "Popup" ? "addSubtaskInputPopup" : "addNewSubtaskInput";
  document.getElementById(isPopup).value = '';
  if (id === "" && typeof window.__resetAddTaskSubtasks === "function") {
    window.__resetAddTaskSubtasks();
  }
  if (id === "Popup" && typeof subtasksArrayPopup !== "undefined") {
    subtasksArrayPopup.length = 0;
  }
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

/** Shows the "task added" toast and redirects to the board after 3s. */
function showSuccessMessage() {
  const successMessage = document.querySelector('.msg-task-added');
  successMessage.style.display = 'flex';
  setTimeout(() => {
    successMessage.style.display = 'none';
    window.location.href = "board.html";
  }, 3000);
}
