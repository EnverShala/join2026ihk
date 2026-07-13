let subtasksArray;
let subtasksArrayPopup = [];
let pos;

/** Wires drag/drop on all task cards and drop zones. */
function addDragAndDropEvents() {
  const draggedCards = document.querySelectorAll(".taskCard");
  const dropZones = document.querySelectorAll(
    "#cardContainertoDo, #cardContainerinProgress, #cardContainerawaitingFeedback, #cardContainerdone"
  );
  draggedCards.forEach((card) => bindDragStart(card));
  dropZones.forEach((zone) => bindDropZone(zone));
}

/** Wires the dragstart event on a task card so it sets its own id as payload. @param {HTMLElement} card */
function bindDragStart(card) {
  card.ondragstart = (event) => {
    event.dataTransfer.setData("text", event.target.id);
  };
}

/** Wires dragover/dragleave/drop handlers on a single drop zone. @param {HTMLElement} zone */
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

/** Handles a drop: appends the card, resets styles, updates the task level. @param {DragEvent} event */
function handleDropZoneDrop(event) {
  event.preventDefault();
  event.currentTarget.style.backgroundColor = "";
  const data = event.dataTransfer.getData("text");
  const card = document.getElementById(data);
  event.currentTarget.appendChild(card);
  event.currentTarget.style.border = "none";
  dragAndDropOnDrop(event.currentTarget.id, data);
}

/** Sets data of the dropped card for drag and drop. @param {string} targetId @param {string} data */
function dragAndDropOnDrop(targetId, data) {
  let newLevel = getNewDragAndDropContainerName(targetId);

  let taskNr = data.split("-")[1];

  tasks[taskNr].level = newLevel;

  editTask(tasks[taskNr].id, tasks[taskNr]);

  checkTaskLevels();
}

/** Moves task at index `i` one level up in the workflow. @param {number} i */
async function moveTaskUp(i) {
  if (tasks[i].level == "In Progress") {
    tasks[i].level = "To do";
  } else if (tasks[i].level == "Awaiting Feedback") {
    tasks[i].level = "In Progress";
  } else if (tasks[i].level == "Done") {
    tasks[i].level = "Awaiting Feedback";
  } else {
    return;
  }
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/** Moves task at index `i` one level down in the workflow. @param {number} i */
async function moveTaskDown(i) {
  if (tasks[i].level == "Awaiting Feedback") {
    tasks[i].level = "Done";
  } else if (tasks[i].level == "In Progress") {
    tasks[i].level = "Awaiting Feedback";
  } else if (tasks[i].level == "To do") {
    tasks[i].level = "In Progress";
  } else {
    return;
  }
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/** Returns the level name for a drop container id. @param {string} targetId @return {string} */
function getNewDragAndDropContainerName(targetId) {
  if (targetId.includes("cardContainertoDo")) {
    return "To do";
  } else if (targetId.includes("cardContainerinProgress")) {
    return "In Progress";
  } else if (targetId.includes("cardContainerawaitingFeedback")) {
    return "Awaiting Feedback";
  } else if (targetId.includes("cardContainerdone")) {
    return "Done";
  }
}

/** Toggles empty-state hints for all four task-level containers. */
function checkTaskLevels() {
  toggleEmptyState("cardContainertoDo", "emptyTaskTodo");
  toggleEmptyState("cardContainerinProgress", "emptyTaskInProgress");
  toggleEmptyState("cardContainerawaitingFeedback", "emptyTaskAwait");
  toggleEmptyState("cardContainerdone", "emptyTaskDone");
}

/** Shows the empty-state hint if the container has no child cards, hides otherwise. @param {string} containerId @param {string} emptyHintId */
function toggleEmptyState(containerId, emptyHintId) {
  const isEmpty = document.getElementById(containerId).childElementCount == 0;
  document.getElementById(emptyHintId).classList.toggle("d-none", !isEmpty);
}

/** Appends the current input value as a new subtask. */
function addNewSubtask() {
  let newSubtask = document.getElementById("addNewSubtaskInput").value.trim();

  if (newSubtask != "") {
    subtasksArray.push(newSubtask);
    renderSubtasks();
    document.getElementById("addNewSubtaskInput").value = "";
  }
}

/** Removes the subtask at `position` and re-renders the list. @param {number} position */
function deleteSubtask(position) {
  subtasksArray.splice(position, 1);

  renderSubtasks();
}

/** Reverts subtask input at `position` back to its display element. @param {number} position */
function cancelSubtaskEdit(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/** Saves the edited subtask at `position`; cancels if input is empty. @param {number} position */
function confirmSubtaskEdit(position) {
  if (document.getElementById(`editSubtaskInput${position}`).value.trim() == "") {
    cancelSubtaskEdit(position);
    return;
  }

  let listItem = document.querySelector(`ul li[data-index="${position}"]`);

  subtasksArray[position] = document
    .getElementById(`editSubtaskInput${position}`)
    .value.trim();
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/** Replaces the subtask display at `position` with an edit input. @param {number} position */
function editSubtask(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskContentToInputForEditTemplate(
    position,
    listItem.textContent.trim()
  );
}

/** Renders the subtask list from `subtasksArray`. */
function renderSubtasks() {
  let subtasksList = document.getElementById("subtaskList");
  subtasksList.innerHTML = "";
  if (subtasksArray == "") return;
  for (let j = 0; j < subtasksArray.length; j++) {
    subtasksList.innerHTML += createSubtaskListItemTemplate(j, subtasksArray[j]);
  }
}

/** Toggles a subtask done-flag on task `taskNr` and persists it. @param {number} taskNr @param {string} subtaskName @param {number} checkBoxNr */
async function toggleSubtaskDone(taskNr, subtaskName, checkBoxNr) {
  if (document.getElementById(`subtaskCheckbox${checkBoxNr}`).hasAttribute("checked")) {
    if (tasks[taskNr].subtasksDone.includes(subtaskName)) {
      tasks[taskNr].subtasksDone = tasks[taskNr].subtasksDone.replace(subtaskName, "");

      tasks[taskNr].subtasksDone = cleanSubtasksDoneString(tasks[taskNr].subtasksDone);
    }
    document.getElementById(`subtaskCheckbox${checkBoxNr}`).removeAttribute("checked");
  } else {
    tasks[taskNr].subtasksDone += `${subtaskName}|`;
    document.getElementById(`subtaskCheckbox${checkBoxNr}`).setAttribute("checked", true);
  }
  await editTask(currentId, tasks[taskNr]);
  await renderTaskCards();
}

/** Normalizes the "subtasksDone" pipe-separated string. @param {string} str @return {string} */
function cleanSubtasksDoneString(str) {
  let result = str;

  result = result.replace("||", "|");

  if (result.endsWith("|")) {
    result = result.slice(0, -1);
  }
  if (result[0] == "|") {
    result = result.slice(1);
  }

  return result;
}

/** Checks the assigned-user checkboxes matching `assignedUsers`. @param {string[]} assignedUsers @param {string} id */
function toggleAssignedUsers(assignedUsers, id = "") {
  for (let c = 0; c < users.length; c++) {
    for (let a = 0; a < assignedUsers.length; a++) {
      if (users[c].name == assignedUsers[a]) {
        toggleCheckbox(`AssignedContact${id}${c}`);
      }
    }
  }
}

/** Handles Escape/Enter for subtask edit/add (position -1 = add). @param {number} position */
function subtaskOnKeyDown(position) {
  if (position != -1) {
    if (event.key == "Escape") cancelSubtaskEdit(position);
    if (event.key == "Enter") confirmSubtaskEdit(position);
    return;
  }
  if (event.key == "Escape") document.getElementById("addNewSubtaskInput").value = "";
  if (event.key == "Enter") addNewSubtask();
}

/** Same as subtaskOnKeyDown but for the popup context. @param {number} position */
function subtaskOnKeyDownPopup(position) {
  if (position != -1) {
    if (event.key == "Escape") cancelSubtaskEditPopup(position);
    if (event.key == "Enter") confirmSubtaskEditPopup(position);
    return;
  }
  if (event.key == "Escape") document.getElementById("addSubtaskInputPopup").value = "";
  if (event.key == "Enter") addSubtaskPopup();
}

/** Fills the edit popup with the currently selected task's data. */
function editPopupTask() {
  clearForm();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) applyTaskToEditForm(tasks[i]);
  }
  document.getElementById("popupOnTaskSelectionMainContainerID").classList.add("d-none");
  document.getElementById("editPopUpID").classList.remove("d-none");
}

/** Fills the edit-popup form fields and controls from a task record. @param {Object} task */
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

/** Activates the priority button matching `prioName`. @param {string} prioName @param {string} id */
function activatePrioButton(prioName, id = "") {
  if (prioName == "Urgent") {
    clickOnUrgent(id);
  }
  if (prioName == "Medium") {
    clickOnMedium(id);
  }
  if (prioName == "Low") {
    clickOnLow(id);
  }
}
