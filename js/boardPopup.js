/**
 * Adds a new subtask to the popup subtask list.
 *
 * @returns {void}
 */
function addSubtaskPopup() {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let subtask = document.getElementById("addSubtaskInputPopup").value.trim();
  let listIndex = subtasksListPopup.getElementsByTagName("li").length;
  if (subtask == "") return;
  subtasksListPopup.innerHTML += createSubtaskListItemPopupTemplate(listIndex, subtask);
  subtasksArrayPopup.push(subtask);
  document.getElementById("addSubtaskInputPopup").value = "";
}

/**
 * Turns a popup subtask item matching `item` into an edit input.
 *
 * @param {string} item - The subtask label to switch into edit mode.
 * @returns {void}
 */
function editSubtaskPopup(item) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let listLength = subtasksListPopup.getElementsByTagName("li").length;
  for (let i = 0; i < listLength; i++) {
    let listChild = subtasksListPopup.getElementsByTagName("li")[i];
    if (listChild.textContent.trim() == item) {
      listChild.innerHTML = changeSubtaskContentToInputForEditPopupTemplate(i, listChild.textContent.trim());
      break;
    }
  }
}

/**
 * Removes a subtask matching `item` from the popup list.
 *
 * @param {string} item - The subtask label to remove.
 * @returns {void}
 */
function deleteSubtaskPopup(item) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let listLength = subtasksListPopup.getElementsByTagName("li").length;
  for (let i = 0; i < listLength; i++) {
    let listChild = subtasksListPopup.getElementsByTagName("li")[i];
    if (listChild.textContent.trim() == item) {
      subtasksListPopup.removeChild(listChild);
      subtasksArrayPopup.splice(i, 1);
      break;
    }
  }
}

/**
 * Saves the popup subtask edit at `position`; cancels if input is empty.
 *
 * @param {number} position - The index of the subtask being confirmed.
 * @returns {void}
 */
function confirmSubtaskEditPopup(position) {
  let subtask = document.getElementById(`editSubtaskInputPopup${position}`).value.trim();
  if (subtask == "") { cancelSubtaskEditPopup(position); return; }
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  subtasksListPopup.getElementsByTagName("li")[position].innerHTML =
    changeSubtaskInputFieldBackToListElementPopup(position, subtask);
  subtasksArrayPopup[position] = subtask;
}

/**
 * Cancels the popup subtask edit at `position`.
 *
 * @param {number} position - The index of the subtask edit to cancel.
 * @returns {void}
 */
function cancelSubtaskEditPopup(position) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  subtasksListPopup.getElementsByTagName("li")[position].innerHTML =
    changeSubtaskInputFieldBackToListElementPopup(position, subtasksArrayPopup[position]);
}

/**
 * Initializes the AddTask popup modal open/close wiring on DOM load.
 *
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog[data-modal]");
  const openModalButton = document.getElementById("openModal");
  const closeModalButton = document.getElementById("closeModal");
  const alsoOpenButtons = document.querySelectorAll(".alsoOpenModal");
  if (modal && openModalButton && closeModalButton) {
    _wireModalOpenButtons(modal, openModalButton, alsoOpenButtons);
    _wireModalCloseButtons(modal, closeModalButton);
  } else {
    console.error("Modal, Open Button, or Close Button not found in the DOM.");
  }
});

/**
 * Wires the primary and secondary buttons that open the AddTask modal.
 *
 * @param {HTMLDialogElement} modal - The modal dialog element.
 * @param {HTMLElement} openModalButton - The primary open-modal button.
 * @param {NodeListOf<HTMLElement>} alsoOpenButtons - Additional buttons that open the modal.
 * @returns {void}
 */
function _wireModalOpenButtons(modal, openModalButton, alsoOpenButtons) {
  openModalButton.addEventListener("click", () => {
    modal.showModal();
    openModal(openModalButton.id);
  });
  alsoOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.showModal();
      openModal(button.id);
    });
  });
}

/**
 * Wires the close button and backdrop-click handler on the AddTask modal.
 *
 * @param {HTMLDialogElement} modal - The modal dialog element.
 * @param {HTMLElement} closeModalButton - The close-modal button.
 * @returns {void}
 */
function _wireModalCloseButtons(modal, closeModalButton) {
  closeModalButton.addEventListener("click", () => {
    modal.close();
    closeModal();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
      closeModal();
    }
  });
}

/**
 * Opens the modal and sets task-level from the triggering button id.
 *
 * @param {string} buttonid - The id of the button that opened the modal.
 * @returns {void}
 */
function openModal(buttonid) {
  if (buttonid == "alsoOpenModal2") taskLevel = "In Progress";
  else if (buttonid == "alsoOpenModal3") taskLevel = "Awaiting Feedback";
  else if (buttonid == "alsoOpenModal4") taskLevel = "Done";
  else taskLevel = "To do";
  document.getElementById("htmlID").style.overflow = "hidden";
  popupIdString = "Popup";
  renderAssignedTo("Popup");
  activatePrioButton("Medium", "Popup");
  clearForm("Popup");
}

/**
 * Closes the modal and resets popup state.
 *
 * @returns {void}
 */
function closeModal() {
  document.getElementById("htmlID").style.overflow = "auto";
  popupIdString = "";
  taskLevel = "To do";
}

/**
 * Filters task cards by the search bar value (min 3 chars).
 *
 * @returns {void}
 */
function searchTasks() {
  const q = document.getElementById("searchBar").value.trim().toLowerCase();
  if (q.length <= 2) { showAllTaskCards(); return; }
  hideAllTaskCards();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].title.toLowerCase().includes(q) || tasks[i].description.toLowerCase().includes(q)) {
      showTaskCard(i);
    }
  }
}

/**
 * Hides the task card at index `i`.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @returns {void}
 */
function hideTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.add("d-none");
}

/**
 * Shows the task card at index `i`.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @returns {void}
 */
function showTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.remove("d-none");
}

/**
 * Hides all task cards.
 *
 * @returns {void}
 */
function hideAllTaskCards() {
  for (let i = 0; i < tasks.length; i++) hideTaskCard(i);
}

/**
 * Shows all task cards.
 *
 * @returns {void}
 */
function showAllTaskCards() {
  for (let i = 0; i < tasks.length; i++) showTaskCard(i);
}
