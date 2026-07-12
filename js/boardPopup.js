/**
 * Adds a new subtask to the subtask list in the popup.
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
 * Turns a subtask list item in the popup into an input field for editing.
 * @param {string} item The current subtask text to match.
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
 * Deletes a subtask from the subtask list in the popup.
 * @param {string} item The subtask text to remove.
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
 * Confirms the editing of a subtask in the popup at the specified position.
 * @param {number} position The index of the subtask being edited.
 */
function confirmSubtaskEditPopup(position) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");
  let subtask = document.getElementById(`editSubtaskInputPopup${position}`).value.trim();

  subtasksListPopup.getElementsByTagName("li")[position].innerHTML =
    changeSubtaskInputFieldBackToListElementPopup(position, subtask);

  subtasksArrayPopup[position] = subtask;
}

/**
 * Cancels the editing of a subtask in the popup at the specified position.
 * @param {number} position The index of the subtask being edited.
 */
function cancelSubtaskEditPopup(position) {
  let subtasksListPopup = document.getElementById("subtaskListPopup");

  subtasksListPopup.getElementsByTagName("li")[position].innerHTML =
    changeSubtaskInputFieldBackToListElementPopup(position, subtasksArrayPopup[position]);
}

/**
 * AddTask popup modal open/close wiring.
 */
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("dialog[data-modal]");
  const openModalButton = document.getElementById("openModal");
  const closeModalButton = document.getElementById("closeModal");
  const alsoOpenButtons = document.querySelectorAll(".alsoOpenModal");

  if (modal && openModalButton && closeModalButton) {
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
  } else {
    console.error("Modal, Open Button, or Close Button not found in the DOM.");
  }
});

/**
 * Opens the modal and sets task-level based on which button triggered it.
 * @param {string} buttonid The id of the button that opened the modal.
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
 */
function closeModal() {
  document.getElementById("htmlID").style.overflow = "auto";
  popupIdString = "";
  taskLevel = "To do";
}

/**
 * Filters task cards by the current search bar value (min 3 chars).
 */
function searchTasks() {
  let searchBar = document.getElementById("searchBar").value;

  if (searchBar.trim().length > 2) {
    hideAllTaskCards();
    for (let i = 0; i < tasks.length; i++) {
      if (
        tasks[i].title.toLowerCase().includes(searchBar.toLowerCase()) ||
        tasks[i].description.toLowerCase().includes(searchBar.toLowerCase())
      ) {
        showTaskCard(i);
      }
    }
  } else {
    showAllTaskCards();
  }
}

/**
 * Hides the task card at the specified index.
 * @param {number} i The index of the task card to hide.
 */
function hideTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.add("d-none");
}

/**
 * Shows the task card at the specified index.
 * @param {number} i The index of the task card to show.
 */
function showTaskCard(i) {
  document.getElementById(`taskCard-${i}`).classList.remove("d-none");
}

/** Hides all task cards. */
function hideAllTaskCards() {
  for (let i = 0; i < tasks.length; i++) hideTaskCard(i);
}

/** Shows all task cards. */
function showAllTaskCards() {
  for (let i = 0; i < tasks.length; i++) showTaskCard(i);
}
