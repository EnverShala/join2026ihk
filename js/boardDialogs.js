const CARD_CONTAINER_MAP = {
  "To do": { container: "cardContainertoDo", empty: "emptyTaskTodo" },
  "In Progress": { container: "cardContainerinProgress", empty: "emptyTaskInProgress" },
  "Awaiting Feedback": { container: "cardContainerawaitingFeedback", empty: "emptyTaskAwait" },
  "Done": { container: "cardContainerdone", empty: "emptyTaskDone" },
};

/**
 * Returns the index of the task whose id matches `currentId`.
 *
 * @returns {number|undefined} The tasks-array index of the current task.
 */
function getTaskNrFromCurrentId() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) return i;
  }
}

/**
 * Pipe-joins all subtask <li> texts (optional id suffix).
 *
 * @param {string} [id=""] - Optional suffix identifying the subtask list.
 * @returns {string} Pipe-joined subtask labels, or an empty string.
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
 * Toggles a required-message element of the edit popup on or off.
 *
 * @param {string} id - The DOM id of the message element.
 * @param {boolean} show - Whether the message should be visible.
 * @returns {void}
 */
function toggleEditRequired(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? "block" : "none";
}

/**
 * Hides all required-messages of the edit popup.
 *
 * @returns {void}
 */
function hideEditRequiredHints() {
  ["editTitleRequired", "editDescriptionRequired", "editDateRequired", "editPrioRequired", "editAssignedRequired"]
    .forEach(id => toggleEditRequired(id, false));
}

/**
 * Validates the edit-popup due date and toggles its error message.
 *
 * @param {string} dateValue - The date input value (YYYY-MM-DD).
 * @returns {boolean} True if the date is today or in the future.
 */
function validateEditDueDate(dateValue) {
  const msg = document.getElementById("editDateRequired");
  const ok = dateValue !== "" && (typeof isDueDateInRange !== "function" || isDueDateInRange(dateValue));
  if (msg) msg.textContent = dateValue === "" ? "This field is required" : "Please select today or a future date";
  toggleEditRequired("editDateRequired", !ok);
  return ok;
}

/**
 * Validates all required fields of the edit popup and toggles their messages.
 *
 * @returns {boolean} True if every required field is filled in correctly.
 */
function validateEditForm() {
  const titleOk = document.getElementById("inputEdit").value.trim() !== "";
  const descOk = document.getElementById("inputDescription").value.trim() !== "";
  const prioOk = getTaskPrio() !== "None";
  const assignedOk = getAssignedUsers() !== "";
  toggleEditRequired("editTitleRequired", !titleOk);
  toggleEditRequired("editDescriptionRequired", !descOk);
  toggleEditRequired("editPrioRequired", !prioOk);
  toggleEditRequired("editAssignedRequired", !assignedOk);
  const dateOk = validateEditDueDate(document.getElementById("inputDueDate").value);
  return titleOk && descOk && prioOk && assignedOk && dateOk;
}

/**
 * Persists the edit form values back onto the currently selected task.
 *
 * @returns {Promise<void>} Resolves after the task is saved and the board is rerendered.
 */
async function editCurrentTask() {
  if (!validateEditForm()) return;
  const dateValue = document.getElementById("inputDueDate").value;
  const t = tasks[getTaskNrFromCurrentId()];
  const attachment = typeof getAttachmentJson === "function" ? getAttachmentJson("edit") : "";
  const newTask = createTaskArray(
    document.getElementById("inputEdit").value.trim(),
    document.getElementById("inputDescription").value.trim(),
    dateValue,
    t.category, getTaskPrio(), t.level,
    getSubtaskItems(), getAssignedUsers(), t.subtasksDone, attachment
  );
  await editTask(currentId, newTask);
  await renderTaskCards();
  closeDialog();
}

/**
 * Opens the task-selection popup dialog.
 *
 * @returns {void}
 */
function openDialog() {
  document.getElementById("htmlID").style.overflow = "hidden";
  setTimeout(() => {
    document.getElementById("popupOnTaskSelectionID").style.visibility = "visible";
  }, 100);
}

/**
 * Closes the task-selection popup dialog and resets container state.
 *
 * @returns {void}
 */
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
 *
 * @param {number} taskNr - The index of the task in the tasks array.
 * @param {string} contactEllipse - The prebuilt assigned-user badge HTML.
 * @returns {void}
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
 *
 * @param {number} taskNr - The index of the task in the tasks array.
 * @returns {Promise<void>} Resolves once all popup sections have been rendered.
 */
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

/**
 * Builds badge HTML for a list of assigned user names.
 *
 * @param {string[]} names - Assigned user names to render as badges.
 * @returns {Promise<string>} Resolves with the concatenated badge HTML.
 */
async function buildContactEllipseHtml(names) {
  let html = "";
  for (const n of names) {
    html += `<div class="badgeImg initialsColor${await getUserColor(n)}">${getUserInitials(n)}</div>`;
  }
  return html;
}

/**
 * Renders the assigned-user names into their popup container.
 *
 * @param {string[]} [assignedNames=[]] - Assigned user names to render.
 * @returns {void}
 */
function renderValueFromNames(assignedNames = []) {
  let valueFromName = document.getElementById("popupContactNameID");
  valueFromName.innerHTML = "";
  for (let j = 0; j < assignedNames.length; j++) {
    valueFromName.innerHTML += `<div>${assignedNames[j]}</div>`;
  }
}

/**
 * Renders subtasks with checkboxes; pre-checks items in `subtasksDone`.
 *
 * @param {string[]} [subtasksArray=[]] - The subtask labels to render.
 * @param {number} taskNr - The index of the task in the tasks array.
 * @returns {void}
 */
function renderSubtasksDoneCheckboxes(subtasksArray = [], taskNr) {
  const list = document.getElementById("showSubtasksContainer");
  list.innerHTML = "";
  if (tasks[taskNr].subtasks.trim() == "") return;
  for (let j = 0; j < subtasksArray.length; j++) {
    const done = tasks[taskNr].subtasksDone.includes(subtasksArray[j]) ? "checked" : "";
    list.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})" ${done}>${subtasksArray[j]}<p>`;
  }
}

/**
 * Returns color index (1..15) for a user by name; 1 when not found.
 *
 * @param {string} userName - The user name whose color index is looked up.
 * @returns {Promise<number>} Resolves with the color index between 1 and 15.
 */
async function getUserColor(userName) {
  if (users.length === 0) await loadUsers("/users");
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
 * Returns card container id for a level.
 *
 * @param {string} cardContainerIdName - The workflow level name.
 * @returns {string} The card container id, or an empty string when unknown.
 */
function getCardContainerId(cardContainerIdName) {
  const entry = CARD_CONTAINER_MAP[cardContainerIdName];
  return entry ? entry.container : "";
}

/**
 * Renders all task cards from the loaded tasks list, then refreshes the
 * empty-state hints and drag/drop wiring.
 *
 * @returns {Promise<void>} Resolves once every task card has been rendered.
 */
async function renderTaskCards() {
  await loadTasks("/tasks");
  await loadUsers("/users");
  clearCardContainersInnerHtml();
  for (let i = 0; i < tasks.length; i++) {
    const subs = tasks[i].subtasks.split("|") == "" ? [] : tasks[i].subtasks.split("|");
    const cardId = getCardContainerId(tasks[i].level);
    if (!cardId) continue;
    const html = await renderTaskCardUserCircles(tasks[i].assigned.split(","));
    const progress = computeTaskProgress(tasks[i].subtasksDone, subs);
    document.getElementById(cardId).innerHTML += taskCardTemplate(`taskCard-${i}`, i, html, progress);
  }
  checkTaskLevels();
  addDragAndDropEvents();
}

/**
 * Computes progress-bar values for a task card from its subtasks and done-marks.
 *
 * @param {string} subtasksDoneStr - The pipe-separated done-string of the task.
 * @param {string[]} subTasksArray - The full list of subtasks on the task.
 * @returns {Object} Progress info with doneCount, totalCount, widthPercent, and emptyClass.
 */
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

/**
 * Renders up to 4 user-circles for a card; overflow becomes a "+N" chip.
 *
 * @param {string[]} [assignedUsersArray=[]] - Assigned user names for the card.
 * @returns {Promise<string>} Resolves with the concatenated badge HTML.
 */
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

/**
 * Clears the inner HTML of every card container column.
 *
 * @returns {void}
 */
function clearCardContainersInnerHtml() {
  document.getElementById("cardContainertoDo").innerHTML = "";
  document.getElementById("cardContainerinProgress").innerHTML = "";
  document.getElementById("cardContainerawaitingFeedback").innerHTML = "";
  document.getElementById("cardContainerdone").innerHTML = "";
}
