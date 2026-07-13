/** Returns the index of the task whose id matches `currentId`. @return {number} */
function getTaskNrFromCurrentId() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) return i;
  }
}

/** Pipe-joins all subtask <li> texts (optional id suffix). @param {string} id @return {string} */
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

/** Returns comma-joined names of checked assigned-user checkboxes. @param {string} id @return {string} */
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

/** Persists the edit form values back onto the currently selected task. */
async function editCurrentTask() {
  const t = tasks[getTaskNrFromCurrentId()];
  const attachment = typeof getAttachmentJson === "function" ? getAttachmentJson("edit") : "";
  const newTask = createTaskArray(
    document.getElementById("inputEdit").value.trim(),
    document.getElementById("inputDescription").value.trim(),
    document.getElementById("inputDueDate").value,
    t.category, getTaskPrio(), t.level,
    getSubtaskItems(), getAssignedUsers(), t.subtasksDone, attachment
  );
  await editTask(currentId, newTask);
  await renderTaskCards();
  closeDialog();
}

/**
 * Builds a task object from the given edit-form fields.
 * @param {string} newTitle @param {string} newDescription @param {string} newDate @param {string} oldCategory @param {string} newPrio @param {string} oldLevel @param {string} newSubtasks @param {string} newAssigned @return {Object}
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

/** Loads task data into the popup display elements. @param {number} taskNr @param {string} contactEllipse */
function loadPopupValueData(taskNr, contactEllipse) {
  document.getElementById("popUpUserStory").innerHTML = tasks[taskNr].category;
  document.getElementById("popupHeaderID").innerHTML = tasks[taskNr].title;
  document.getElementById("popupSpanID").innerHTML = tasks[taskNr].description;
  document.getElementById("dateId").textContent = tasks[taskNr].date;
  document.getElementById("prioId").textContent = tasks[taskNr].priority;
  document.getElementById("prioIdImg").src = `./img/${tasks[taskNr].priority.toLowerCase()}.svg`;
  document.getElementById("popupContactEllipseID").innerHTML = contactEllipse;
}

/** Populates the task-detail popup: fields, ellipses, subtasks, attachments. @param {number} taskNr */
async function popupValueImplementFromTask(taskNr) {
  await loadTasks();
  subtasksArray = tasks[taskNr].subtasks.split("|");
  const assignedNames = tasks[taskNr].assigned.split(",");
  currentId = tasks[taskNr].id;
  loadPopupValueData(taskNr, await buildContactEllipseHtml(assignedNames.slice()));
  renderValueFromNames(assignedNames);
  renderSubtasksDoneCheckboxes(subtasksArray, taskNr);
  if (typeof renderAttachmentsSection === "function") {
    renderAttachmentsSection(tasks[taskNr].attachments || "");
  }
}

/** Builds badge HTML for a list of assigned user names. @param {string[]} names @return {string} */
async function buildContactEllipseHtml(names) {
  let html = "";
  for (const n of names) {
    html += `<div class="badgeImg initialsColor${await getUserColor(n)}">${getUserInitials(n)}</div>`;
  }
  return html;
}

/** Renders the assigned-user names into their popup container. @param {string[]} assignedNames */
function renderValueFromNames(assignedNames = []) {
  let valueFromName = document.getElementById("popupContactNameID");
  valueFromName.innerHTML = "";
  for (let j = 0; j < assignedNames.length; j++) {
    valueFromName.innerHTML += `<div>${assignedNames[j]}</div>`;
  }
}

/** Renders subtasks with checkboxes; pre-checks items in `subtasksDone`. @param {string[]} subtasksArray @param {number} taskNr */
function renderSubtasksDoneCheckboxes(subtasksArray = [], taskNr) {
  const list = document.getElementById("showSubtasksContainer");
  list.innerHTML = "";
  if (tasks[taskNr].subtasks.trim() == "") return;
  for (let j = 0; j < subtasksArray.length; j++) {
    const done = tasks[taskNr].subtasksDone.includes(subtasksArray[j]) ? "checked" : "";
    list.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})" ${done}>${subtasksArray[j]}<p>`;
  }
}

/** Returns color index (1..15) for a user by name; 1 when not found. @param {string} userName @return {number} */
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

const CARD_CONTAINER_MAP = {
  "To do": { container: "cardContainertoDo", empty: "emptyTaskTodo" },
  "In Progress": { container: "cardContainerinProgress", empty: "emptyTaskInProgress" },
  "Awaiting Feedback": { container: "cardContainerawaitingFeedback", empty: "emptyTaskAwait" },
  "Done": { container: "cardContainerdone", empty: "emptyTaskDone" },
};

/** Returns card container id for a level and hides its empty-state. @param {string} cardContainerIdName @return {string} */
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
    const subs = tasks[i].subtasks.split("|") == "" ? [] : tasks[i].subtasks.split("|");
    const cardId = getCardContainerId(tasks[i].level);
    const html = await renderTaskCardUserCircles(tasks[i].assigned.split(","));
    const progress = computeTaskProgress(tasks[i].subtasksDone, subs);
    document.getElementById(cardId).innerHTML += taskCardTemplate(`taskCard-${i}`, i, html, progress);
  }
  addDragAndDropEvents();
}

/** Computes progress-bar values for a task card from its subtasks and done-marks. @param {string} subtasksDoneStr @param {string[]} subTasksArray @return {Object} */
function computeTaskProgress(subtasksDoneStr, subTasksArray) {
  let raw = subtasksDoneStr || "";
  if (raw.endsWith("|")) raw = raw.slice(0, -1);
  const doneCount = raw == "" ? 0 : raw.split("|").length;
  const totalCount = subTasksArray.length;
  return {
    doneCount: doneCount,
    totalCount: totalCount,
    widthPercent: totalCount > 0 ? (100 / totalCount) * doneCount : 0,
    emptyClass: totalCount > 0 ? "" : "d-none",
  };
}

/** Renders up to 4 user-circles for a card; overflow becomes a "+N" chip. @param {string[]} assignedUsersArray @return {string} */
async function renderTaskCardUserCircles(assignedUsersArray = []) {
  const total = assignedUsersArray.length;
  const shown = Math.min(total, 4);
  let html = "";
  for (let i = 0; i < shown; i++) {
    const n = assignedUsersArray[i];
    html += `<div class="badgeImg initialsColor${await getUserColor(n)}">${getUserInitials(n)}</div>`;
  }
  if (total > 4) html += `<div class="badgeImg initialsColor0">+${total - 4}</div>`;
  return html;
}

/** Clears the inner HTML of every card container column. */
function clearCardContainersInnerHtml() {
  document.getElementById("cardContainertoDo").innerHTML = "";
  document.getElementById("cardContainerinProgress").innerHTML = "";
  document.getElementById("cardContainerawaitingFeedback").innerHTML = "";
  document.getElementById("cardContainerdone").innerHTML = "";
}
