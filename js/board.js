let subtasksArray;
let subtasksArrayPopup = [];
let pos;

/**
 * Wires drag/drop on all task cards and drop zones.
 *
 * @returns {void}
 */
function addDragAndDropEvents() {
  const draggedCards = document.querySelectorAll(".taskCard");
  const dropZones = document.querySelectorAll(
    "#cardContainertoDo, #cardContainerinProgress, #cardContainerawaitingFeedback, #cardContainerdone"
  );
  draggedCards.forEach((card) => bindDragStart(card));
  dropZones.forEach((zone) => bindDropZone(zone));
}

/**
 * Wires the dragstart event on a task card so it sets its own id as payload.
 *
 * @param {HTMLElement} card - The task card element to make draggable.
 * @returns {void}
 */
function bindDragStart(card) {
  card.ondragstart = (event) => {
    event.dataTransfer.setData("text", event.target.id);
  };
}

/**
 * Wires dragover/dragleave/drop handlers on a single drop zone.
 *
 * @param {HTMLElement} zone - The drop zone element to configure.
 * @returns {void}
 */
function bindDropZone(zone) {
  zone.ondragover = (event) => {
    event.preventDefault();
    event.currentTarget.style.border = "dotted 2px grey";
  };
  zone.ondragleave = (event) => {
    event.currentTarget.style.backgroundColor = "";
    event.currentTarget.style.border = "none";
  };
  zone.ondrop = handleDropZoneDrop;
}

/**
 * Handles a drop: appends the card, resets styles, updates the task level.
 *
 * @param {DragEvent} event - The drop event fired by the drop zone.
 * @returns {void}
 */
function handleDropZoneDrop(event) {
  event.preventDefault();
  event.currentTarget.style.backgroundColor = "";
  const data = event.dataTransfer.getData("text");
  const card = document.getElementById(data);
  event.currentTarget.appendChild(card);
  event.currentTarget.style.border = "none";
  dragAndDropOnDrop(event.currentTarget.id, data);
}

/**
 * Sets data of the dropped card for drag and drop.
 *
 * @param {string} targetId - The id of the container the card was dropped on.
 * @param {string} data - The id of the dropped card element.
 * @returns {void}
 */
function dragAndDropOnDrop(targetId, data) {
  let newLevel = getNewDragAndDropContainerName(targetId);
  let taskNr = data.split("-")[1];
  tasks[taskNr].level = newLevel;
  editTask(tasks[taskNr].id, tasks[taskNr]);
  checkTaskLevels();
}

/**
 * Moves task at index `i` one level up in the workflow.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Promise<void>} Resolves when the task is persisted and rerendered.
 */
async function moveTaskUp(i) {
  const nextLevel = _levelUp(tasks[i].level);
  if (!nextLevel) return;
  tasks[i].level = nextLevel;
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/**
 * Returns the workflow level directly above the given level.
 *
 * @param {string} level - The current level of the task.
 * @returns {string|null} The next level up, or null when already at the top.
 */
function _levelUp(level) {
  if (level == "In Progress") return "To do";
  if (level == "Awaiting Feedback") return "In Progress";
  if (level == "Done") return "Awaiting Feedback";
  return null;
}

/**
 * Moves task at index `i` one level down in the workflow.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Promise<void>} Resolves when the task is persisted and rerendered.
 */
async function moveTaskDown(i) {
  const nextLevel = _levelDown(tasks[i].level);
  if (!nextLevel) return;
  tasks[i].level = nextLevel;
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/**
 * Returns the workflow level directly below the given level.
 *
 * @param {string} level - The current level of the task.
 * @returns {string|null} The next level down, or null when already at the bottom.
 */
function _levelDown(level) {
  if (level == "Awaiting Feedback") return "Done";
  if (level == "In Progress") return "Awaiting Feedback";
  if (level == "To do") return "In Progress";
  return null;
}

/**
 * Returns the level name for a drop container id.
 *
 * @param {string} targetId - The id of the drop container element.
 * @returns {string|undefined} The workflow level string, or undefined when unknown.
 */
function getNewDragAndDropContainerName(targetId) {
  if (targetId.includes("cardContainertoDo")) return "To do";
  if (targetId.includes("cardContainerinProgress")) return "In Progress";
  if (targetId.includes("cardContainerawaitingFeedback")) return "Awaiting Feedback";
  if (targetId.includes("cardContainerdone")) return "Done";
}

/**
 * Toggles empty-state hints for all four task-level containers.
 *
 * @returns {void}
 */
function checkTaskLevels() {
  toggleEmptyState("cardContainertoDo", "emptyTaskTodo");
  toggleEmptyState("cardContainerinProgress", "emptyTaskInProgress");
  toggleEmptyState("cardContainerawaitingFeedback", "emptyTaskAwait");
  toggleEmptyState("cardContainerdone", "emptyTaskDone");
}

/**
 * Shows the empty-state hint if the container has no child cards, hides otherwise.
 *
 * @param {string} containerId - The id of the card container element.
 * @param {string} emptyHintId - The id of the empty-state hint element.
 * @returns {void}
 */
function toggleEmptyState(containerId, emptyHintId) {
  const isEmpty = document.getElementById(containerId).childElementCount == 0;
  document.getElementById(emptyHintId).classList.toggle("d-none", !isEmpty);
}

/**
 * Appends the current input value as a new subtask.
 *
 * @returns {void}
 */
function addNewSubtask() {
  let newSubtask = document.getElementById("addNewSubtaskInput").value.trim();
  if (newSubtask != "") {
    subtasksArray.push(newSubtask);
    renderSubtasks();
    document.getElementById("addNewSubtaskInput").value = "";
  }
}

/**
 * Removes the subtask at `position` and re-renders the list.
 *
 * @param {number} position - The index of the subtask to delete.
 * @returns {void}
 */
function deleteSubtask(position) {
  subtasksArray.splice(position, 1);
  renderSubtasks();
}

/**
 * Reverts subtask input at `position` back to its display element.
 *
 * @param {number} position - The index of the subtask being edited.
 * @returns {void}
 */
function cancelSubtaskEdit(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/**
 * Saves the edited subtask at `position`; cancels if input is empty.
 *
 * @param {number} position - The index of the subtask being confirmed.
 * @returns {void}
 */
function confirmSubtaskEdit(position) {
  const value = document.getElementById(`editSubtaskInput${position}`).value.trim();
  if (value == "") { cancelSubtaskEdit(position); return; }
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  subtasksArray[position] = value;
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/**
 * Replaces the subtask display at `position` with an edit input.
 *
 * @param {number} position - The index of the subtask to edit.
 * @returns {void}
 */
function editSubtask(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskContentToInputForEditTemplate(
    position,
    listItem.textContent.trim()
  );
}

/**
 * Renders the subtask list from `subtasksArray`.
 *
 * @returns {void}
 */
function renderSubtasks() {
  let subtasksList = document.getElementById("subtaskList");
  subtasksList.innerHTML = "";
  if (subtasksArray == "") return;
  for (let j = 0; j < subtasksArray.length; j++) {
    subtasksList.innerHTML += createSubtaskListItemTemplate(j, subtasksArray[j]);
  }
}

/**
 * Toggles a subtask done-flag on task `taskNr` and persists it.
 *
 * @param {number} taskNr - The index of the task in the tasks array.
 * @param {string} subtaskName - The subtask label to toggle.
 * @param {number} checkBoxNr - The index of the associated checkbox element.
 * @returns {Promise<void>} Resolves when the change is persisted and rerendered.
 */
async function toggleSubtaskDone(taskNr, subtaskName, checkBoxNr) {
  const box = document.getElementById(`subtaskCheckbox${checkBoxNr}`);
  if (box.hasAttribute("checked")) _uncheckSubtask(taskNr, subtaskName, box);
  else _checkSubtask(taskNr, subtaskName, box);
  await editTask(currentId, tasks[taskNr]);
  await renderTaskCards();
}

/**
 * Marks a subtask as not done and removes it from the done-string.
 *
 * @param {number} taskNr - The index of the task in the tasks array.
 * @param {string} subtaskName - The subtask label to clear.
 * @param {HTMLElement} box - The checkbox element to uncheck.
 * @returns {void}
 */
function _uncheckSubtask(taskNr, subtaskName, box) {
  if (tasks[taskNr].subtasksDone.includes(subtaskName)) {
    tasks[taskNr].subtasksDone = tasks[taskNr].subtasksDone.replace(subtaskName, "");
    tasks[taskNr].subtasksDone = cleanSubtasksDoneString(tasks[taskNr].subtasksDone);
  }
  box.removeAttribute("checked");
}

/**
 * Marks a subtask as done and appends it to the done-string.
 *
 * @param {number} taskNr - The index of the task in the tasks array.
 * @param {string} subtaskName - The subtask label to add.
 * @param {HTMLElement} box - The checkbox element to check.
 * @returns {void}
 */
function _checkSubtask(taskNr, subtaskName, box) {
  tasks[taskNr].subtasksDone += `${subtaskName}|`;
  box.setAttribute("checked", true);
}

/**
 * Normalizes the "subtasksDone" pipe-separated string.
 *
 * @param {string} str - The raw pipe-separated done-string.
 * @returns {string} The normalized done-string without double or trailing pipes.
 */
function cleanSubtasksDoneString(str) {
  let result = str;
  result = result.replace("||", "|");
  if (result.endsWith("|")) result = result.slice(0, -1);
  if (result[0] == "|") result = result.slice(1);
  return result;
}

/**
 * Checks the assigned-user checkboxes matching `assignedUsers`.
 *
 * @param {string[]} assignedUsers - Names of users to mark as assigned.
 * @param {string} [id=""] - Optional suffix identifying the form context.
 * @returns {void}
 */
function toggleAssignedUsers(assignedUsers, id = "") {
  for (let c = 0; c < users.length; c++) {
    for (let a = 0; a < assignedUsers.length; a++) {
      if (users[c].name == assignedUsers[a]) {
        toggleCheckbox(`AssignedContact${id}${c}`);
      }
    }
  }
}

/**
 * Handles Escape/Enter for subtask edit/add (position -1 = add).
 *
 * @param {number} position - The subtask index, or -1 for the add-input.
 * @returns {void}
 */
function subtaskOnKeyDown(position) {
  if (position != -1) {
    if (event.key == "Escape") cancelSubtaskEdit(position);
    if (event.key == "Enter") confirmSubtaskEdit(position);
    return;
  }
  if (event.key == "Escape") document.getElementById("addNewSubtaskInput").value = "";
  if (event.key == "Enter") addNewSubtask();
}

/**
 * Same as subtaskOnKeyDown but for the popup context.
 *
 * @param {number} position - The subtask index, or -1 for the add-input.
 * @returns {void}
 */
function subtaskOnKeyDownPopup(position) {
  if (position != -1) {
    if (event.key == "Escape") cancelSubtaskEditPopup(position);
    if (event.key == "Enter") confirmSubtaskEditPopup(position);
    return;
  }
  if (event.key == "Escape") document.getElementById("addSubtaskInputPopup").value = "";
  if (event.key == "Enter") addSubtaskPopup();
}

/**
 * Fills the edit popup with the currently selected task's data.
 *
 * @returns {void}
 */
function editPopupTask() {
  clearForm();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) applyTaskToEditForm(tasks[i]);
  }
  document.getElementById("popupOnTaskSelectionMainContainerID").classList.add("d-none");
  document.getElementById("editPopUpID").classList.remove("d-none");
  if (typeof applyDueDateBounds === "function") {
    applyDueDateBounds(document.getElementById("inputDueDate"));
  }
}

/**
 * Fills the edit-popup form fields and controls from a task record.
 *
 * @param {Object} task - The task whose values are copied into the form.
 * @returns {void}
 */
function applyTaskToEditForm(task) {
  document.getElementById("inputEdit").value = task.title;
  document.getElementById("inputDescription").value = task.description;
  document.getElementById("inputDueDate").value = task.date;
  subtasksArray = task.subtasks.split("|");
  clearPrioButtons();
  activatePrioButton(task.priority);
  renderSubtasks();
  toggleAssignedUsers(task.assigned.split(","));
  if (typeof loadAttachmentForEdit === "function") {
    loadAttachmentForEdit(task.attachments || "");
  }
}

