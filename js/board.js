let subtasksArray;
let subtasksArrayPopup = [];
let pos;

/**
 * Adds drag-and-drop functionality to task cards and drop zones.
 *
 * - Makes elements with the class "taskCard" draggable.
 * - Sets up drop zones to allow dropping and provide visual feedback.
 * - Updates task levels and triggers necessary updates on drop.
 */
function addDragAndDropEvents() {
  const draggedCards = document.querySelectorAll(".taskCard");
  const dropZones = document.querySelectorAll("#cardContainertoDo, #cardContainerinProgress, #cardContainerawaitingFeedback, #cardContainerdone");

  draggedCards.forEach((card) => { card.ondragstart = (event) => { event.dataTransfer.setData("text", event.target.id); }; });

  dropZones.forEach((zone) => {
    zone.ondragover = (event) => { event.preventDefault(); event.currentTarget.style.border = "dotted 2px grey";  };

    zone.ondragleave = (event) => {
      event.currentTarget.style.backgroundColor = ""; event.currentTarget.style.border = "none";
    };

    zone.ondrop = (event) => {
      event.preventDefault();
      event.currentTarget.style.backgroundColor = "";
      const data = event.dataTransfer.getData("text"), card = document.getElementById(data);
      event.currentTarget.appendChild(card);
      event.currentTarget.style.border = "none";
      dragAndDropOnDrop(event.currentTarget.id, data)
    };
  });
}

/**
 * sets the Data of the dropped Card for the drag and drop function
 */
function dragAndDropOnDrop(targetId, data) {
  let newLevel = getNewDragAndDropContainerName(targetId);

  let taskNr = data.split("-")[1];

  tasks[taskNr].level = newLevel;

  editTask(tasks[taskNr].id, tasks[taskNr]);

  checkTaskLevels();
}

/**
 * Moves a task up one level in the workflow and updates the UI.
 *
 * @async
 * @param {number} i - Index of the task in the tasks array.
 * @returns {Promise<void>}
 */
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

/**
 * Moves a task down one level in the workflow and updates the UI.
 *
 * @async
 * @param {number} i - Index of the task in the tasks array.
 * @returns {Promise<void>}
 */
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

/**
 * Returns a user-friendly name for a drag-and-drop container based on its ID.
 *
 * @param {string} targetId The ID of the drag-and-drop container.
 * @returns {string} The user-friendly name of the container (e.g., "To do", "In Progress").
 */
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

/**
 * Checks the number of child elements in each task container (To Do, In Progress, Awaiting Feedback, Done)
 * and shows or hides corresponding "empty task" messages based on whether the containers are empty.
 */
function checkTaskLevels() {
  if (document.getElementById("cardContainertoDo").childElementCount == 0) {
    document.getElementById("emptyTaskTodo").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskTodo").classList.add("d-none");
  }

  if (document.getElementById("cardContainerinProgress").childElementCount == 0) {
    document.getElementById("emptyTaskInProgress").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskInProgress").classList.add("d-none");
  }

  if (document.getElementById("cardContainerawaitingFeedback").childElementCount == 0) {
    document.getElementById("emptyTaskAwait").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskAwait").classList.add("d-none");
  }

  if (document.getElementById("cardContainerdone").childElementCount == 0) {
    document.getElementById("emptyTaskDone").classList.remove("d-none");
  } else {
    document.getElementById("emptyTaskDone").classList.add("d-none");
  }
}

/**
 * Adds a new subtask to the subtasks array and updates the displayed subtask list.
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
 * Deletes a subtask from the subtasks array at the specified position and re-renders the subtask list.
 *
 * @param {number} position The index of the subtask to delete in the subtasksArray.
 */
function deleteSubtask(position) {
  subtasksArray.splice(position, 1);

  renderSubtasks();
}

/**
 * Cancels the editing of a subtask at the specified position and reverts the list item back to its original display.
 *
 * @param {number} position The index of the subtask being edited.
 */
function cancelSubtaskEdit(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskInputFieldBackToListElement(
    position,
    subtasksArray[position]
  );
}

/**
 * Confirms the editing of a subtask at the specified position, updating the subtasks array and the displayed list item.
 * If the input is empty after trimming, the edit is canceled.
 *
 * @param {number} position The index of the subtask being edited.
 */
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

/**
 * Turns a subtask list item into an input field for editing.
 *
 * @param {number} position The index of the subtask to be edited.
 */
function editSubtask(position) {
  let listItem = document.querySelector(`ul li[data-index="${position}"]`);
  listItem.innerHTML = changeSubtaskContentToInputForEditTemplate(
    position,
    listItem.textContent.trim()
  );
}

/**
 * Renders the subtask list based on the current subtasksArray.
 */
function renderSubtasks() {
  let subtasksList = document.getElementById("subtaskList");

  if (subtasksArray == "") {
    subtasksList.innerHTML = "";
    return;
  }

  subtasksList.innerHTML = "";

  for (let j = 0; j < subtasksArray.length; j++) {
    subtasksList.innerHTML += createSubtaskListItemTemplate(
      j,
      subtasksArray[j]
    );
  }
}

/**
 * Toggles the "done" status of a subtask and updates the task data.
 *
 * @param {number} taskNr The index of the task in the tasks array.
 * @param {string} subtaskName The name of the subtask.
 * @param {number} checkBoxNr The number of the checkbox associated with the subtask.
 */
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

/**
 * cleans the subtasksdone string from errors for saving on firebase
 */
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

/**
 * Toggles the checkboxes for assigned users based on the provided list.
 *
 * @param {string[]} assignedUsers An array of user names that are assigned to the task.
 * @param {string} [id=""] An optional ID to be included in the checkbox ID.
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
 * Handles keyboard events (Escape and Enter) for subtask editing and adding.
 *
 * @param {number} position The index of the subtask being edited, or -1 if adding a new subtask.
 */
function subtaskOnKeyDown(position) {
  if (position != -1) {
    if (event.key == "Escape") {
      cancelSubtaskEdit(position);
    }
    if (event.key == "Enter") {
      confirmSubtaskEdit(position);
    }
  } else {
    if (event.key == "Escape") {
      document.getElementById("addNewSubtaskInput").value = "";
    } 
    if (event.key == "Enter") {
      addNewSubtask();
    }
  }
}

/**
 * Handles keyboard events (Escape and Enter) for subtask editing and adding within a popup.
 *
 * @param {number} position The index of the subtask being edited, or -1 if adding a new subtask.
 */
function subtaskOnKeyDownPopup(position) {
  if (position != -1) {
    if (event.key == "Escape") {
      cancelSubtaskEditPopup(position);
    }
    if (event.key == "Enter") {
      confirmSubtaskEditPopup(position);
    }
  } else {
    if (event.key == "Escape") {
      document.getElementById("addSubtaskInputPopup").value = "";
    }
    if (event.key == "Enter") {
      addSubtaskPopup();
    }
  }
}

/**
 * Populates the edit task popup form with the data of the currently selected task.
 */
function editPopupTask() {
  clearForm();

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == currentId) {
      document.getElementById("inputEdit").value = tasks[i].title;
      document.getElementById("inputDescription").value = tasks[i].description;
      document.getElementById("inputDueDate").value = tasks[i].date;
      subtasksArray = tasks[i].subtasks.split("|");
      let assignedArray = tasks[i].assigned.split(",");

      clearPrioButtons();
      activatePrioButton(tasks[i].priority);
      renderSubtasks();
      toggleAssignedUsers(assignedArray);
      if (typeof loadAttachmentForEdit === "function") {
        loadAttachmentForEdit(tasks[i].attachments || "");
      }
    }
  }
  document.getElementById("popupOnTaskSelectionMainContainerID").classList.add("d-none");
  document.getElementById("editPopUpID").classList.remove("d-none");
}

/**
 * Activates the priority button corresponding to the given priority name.
 *
 * @param {string} prioName The name of the priority ("Urgent", "Medium", or "Low").
 * @param {string} [id=""] An optional ID to be included in the button ID.
 */
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
