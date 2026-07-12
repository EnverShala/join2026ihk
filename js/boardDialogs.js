/**
 * Returns the index of the task whose id matches `currentId`.
 * @returns {number|undefined} Index of the task, or undefined when not found.
 */
function getTaskNrFromCurrentId() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) return i;
  }
}

/**
 * Concatenates the innerText of all subtask <li> children, "|" separated.
 * @param {string} [id=""] Optional id suffix on the subtask list element.
 * @returns {string} Joined subtask text, or "" when there are no items.
 */
function getSubtaskItems(id = "") {
  let subtaskItems = document.getElementById("subtaskList" + id).getElementsByTagName("li");
  let newSubtasks = "";

  if (subtaskItems.length > 0) {
    for (let j = 0; j < subtaskItems.length; j++) {
      newSubtasks += subtaskItems[j].innerText + "|";
    }
  }

  newSubtasks = newSubtasks.slice(0, -1);
  return newSubtasks;
}

/**
 * Returns a comma-joined string of names for all checked assigned-user checkboxes.
 * @param {string} [id=""] Optional id suffix on the checkbox ids.
 * @returns {string} Comma-joined names, or "" when nothing is checked.
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
 * Persists the edit form values back onto the currently selected task.
 * @returns {Promise<void>}
 */
async function editCurrentTask() {
  let newTitle = document.getElementById("inputEdit").value.trim();
  let newDescription = document.getElementById("inputDescription").value.trim();
  let newDate = document.getElementById("inputDueDate").value;
  let newPrio = getTaskPrio();
  let currentTask = getTaskNrFromCurrentId();

  let oldLevel = tasks[currentTask].level;
  let oldCategory = tasks[currentTask].category;
  let subtasksDone = tasks[currentTask].subtasksDone;

  let newSubtasks = getSubtaskItems();
  let newAssigned = getAssignedUsers();

  let attachment = typeof getAttachmentJson === "function" ? getAttachmentJson("edit") : "";

  let newTask = createTaskArray(
    newTitle, newDescription, newDate, oldCategory, newPrio,
    oldLevel, newSubtasks, newAssigned, subtasksDone, attachment
  );

  await editTask(currentId, newTask);
  await renderTaskCards();
  closeDialog();
}

/**
 * Builds a task object from the given fields. Used by the edit flow.
 * @returns {object} A new task object.
 */
function createTaskArray(newTitle, newDescription, newDate, oldCategory, newPrio, oldLevel, newSubtasks, newAssigned) {
  return {
    title: newTitle,
    description: newDescription,
    date: newDate,
    category: oldCategory,
    priority: newPrio,
    level: oldLevel,
    subtasks: newSubtasks,
    assigned: newAssigned,
  };
}

/** Opens the task-selection popup dialog. */
function openDialog() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("htmlID").style.overflow = "hidden";
  setTimeout(() => {
    document.getElementById("popupOnTaskSelectionID").style.visibility = "visible";
  }, 100);
}

/** Closes the task-selection popup dialog and resets container state. */
function closeDialog() {
  document.getElementById("popupOnTaskSelectionID").style.visibility = "hidden";
  document.getElementById("editPopUpID").classList.add("d-none");
  document.getElementById("htmlID").style.overflow = "auto";
  if (typeof clearAttachmentState === "function") clearAttachmentState("edit");
  if (typeof closeImageViewer === "function") closeImageViewer();
  setTimeout(() => {
    document.getElementById("popupOnTaskSelectionMainContainerID").classList.remove("d-none");
  }, 250);
}

/**
 * Loads task data into the popup display elements.
 * @param {number} taskNr Task index in `tasks`.
 * @param {string} contactEllipse Prebuilt HTML for the contact ellipse row.
 */
function loadPopupValueData(taskNr, contactEllipse) {
  document.getElementById("popUpUserStory").innerHTML = tasks[taskNr].category;
  document.getElementById("popupHeaderID").innerHTML = tasks[taskNr].title;
  document.getElementById("popupSpanID").innerHTML = tasks[taskNr].description;
  document.getElementById("dateId").textContent = tasks[taskNr].date;
  document.getElementById("prioId").textContent = tasks[taskNr].priority;
  document.getElementById("prioIdImg").src = `./img/${tasks[taskNr].priority.toLowerCase()}.svg`;
  document.getElementById("popupContactEllipseID").innerHTML = contactEllipse;
}

/**
 * Populates the task-detail popup: fields, ellipses, subtasks, attachments.
 * @param {number} taskNr Task index in `tasks`.
 */
async function popupValueImplementFromTask(taskNr) {
  await loadTasks();
  subtasksArray = tasks[taskNr].subtasks.split("|");

  let contactEllipse = "";
  let assignedUsers = tasks[taskNr].assigned.split(",");
  while (assignedUsers.length > 0) {
    contactEllipse += `<div class="badgeImg initialsColor${await getUserColor(assignedUsers[0])}">${getUserInitials(assignedUsers[0])}</div>`;
    assignedUsers.splice(0, 1);
  }

  loadPopupValueData(taskNr, contactEllipse);

  let assignedNames = tasks[taskNr].assigned.split(",");
  currentId = tasks[taskNr].id;

  renderValueFromNames(assignedNames);
  renderSubtasksDoneCheckboxes(subtasksArray, taskNr);
  if (typeof renderAttachmentsSection === "function") {
    renderAttachmentsSection(tasks[taskNr].attachments || "");
  }
}

/** Renders the assigned-user names into their popup container. */
function renderValueFromNames(assignedNames = []) {
  let valueFromName = document.getElementById("popupContactNameID");
  valueFromName.innerHTML = "";
  for (let j = 0; j < assignedNames.length; j++) {
    valueFromName.innerHTML += `<div>${assignedNames[j]}</div>`;
  }
}

/**
 * Renders subtasks with checkboxes; pre-checks items that are in `subtasksDone`.
 * @param {string[]} [subtasksArray=[]] Subtasks to render.
 * @param {number} taskNr Task index in `tasks`.
 */
function renderSubtasksDoneCheckboxes(subtasksArray = [], taskNr) {
  let subtasksList = document.getElementById("showSubtasksContainer");
  subtasksList.innerHTML = "";
  if (tasks[taskNr].subtasks.trim() == "") return;

  for (let j = 0; j < subtasksArray.length; j++) {
    if (tasks[taskNr].subtasksDone.includes(subtasksArray[j])) {
      subtasksList.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})" checked>${subtasksArray[j]}<p>`;
    } else {
      subtasksList.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})">${subtasksArray[j]}<p>`;
    }
  }
}

/**
 * Returns a color index (1..15) for a user by name. Loads users first if needed.
 * @param {string} userName The user's name.
 * @returns {Promise<number>} Color index; 1 when user is not found.
 */
async function getUserColor(userName) {
  await loadUsers("/users");
  let returnColor = 1;
  for (let i = 0; i < users.length; i++) {
    if (users[i].name == userName) {
      returnColor = i + 1;
      while (returnColor > 15) returnColor -= 15;
      return returnColor;
    }
  }
  return returnColor;
}

/**
 * Returns the id of the card container matching the given task level and hides its empty-state.
 * @param {string} cardContainerIdName "To do" | "In Progress" | "Awaiting Feedback" | "Done".
 * @returns {string} The container element id, or "" when the name is invalid.
 */
const CARD_CONTAINER_MAP = {
  "To do": { container: "cardContainertoDo", empty: "emptyTaskTodo" },
  "In Progress": { container: "cardContainerinProgress", empty: "emptyTaskInProgress" },
  "Awaiting Feedback": { container: "cardContainerawaitingFeedback", empty: "emptyTaskAwait" },
  "Done": { container: "cardContainerdone", empty: "emptyTaskDone" },
};

function getCardContainerId(cardContainerIdName) {
  const entry = CARD_CONTAINER_MAP[cardContainerIdName];
  if (!entry) return "";
  document.getElementById(entry.empty).classList.add("d-none");
  return entry.container;
}

/** Renders all task cards from the loaded tasks list. */
async function renderTaskCards() {
  await loadTasks("/tasks");
  clearCardContainersInnerHtml();

  for (let i = 0; i < tasks.length; i++) {
    const uniqueId = `taskCard-${i}`;
    let assignedUsers = tasks[i].assigned.split(",");
    let subTasksArray = tasks[i].subtasks.split("|") == "" ? [] : tasks[i].subtasks.split("|");
    let cardContainerIdName = getCardContainerId(tasks[i].level);
    let assignedUsersHTML = await renderTaskCardUserCircles(assignedUsers);

    document.getElementById(cardContainerIdName).innerHTML += taskCardTemplate(
      uniqueId, i, subTasksArray, assignedUsersHTML
    );
  }
  addDragAndDropEvents();
}

/**
 * Renders up to 4 user-circles for a task card; overflow becomes a "+N" chip.
 * @param {string[]} [assignedUsersArray=[]] User names assigned to the task.
 * @returns {Promise<string>} The generated HTML.
 */
async function renderTaskCardUserCircles(assignedUsersArray = []) {
  let assignedUsersHTML = "";
  let assignedUsers = assignedUsersArray;
  let counter = 0;
  let taskUsers = assignedUsers.length;

  while (assignedUsers.length > 0) {
    assignedUsersHTML += `<div class="badgeImg initialsColor${await getUserColor(assignedUsers[0])}">${getUserInitials(assignedUsers[0])}</div>`;
    assignedUsers.splice(0, 1);
    counter++;

    if (counter == 4 && taskUsers > 4) {
      assignedUsersHTML += `<div class="badgeImg initialsColor0">+${taskUsers - counter}</div>`;
      return assignedUsersHTML;
    }
  }
  return assignedUsersHTML;
}

/** Clears the inner HTML of every card container column. */
function clearCardContainersInnerHtml() {
  document.getElementById("cardContainertoDo").innerHTML = "";
  document.getElementById("cardContainerinProgress").innerHTML = "";
  document.getElementById("cardContainerawaitingFeedback").innerHTML = "";
  document.getElementById("cardContainerdone").innerHTML = "";
}
