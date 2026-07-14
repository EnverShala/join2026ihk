let _subtaskInput;
let _subtaskBtnAdd;
let _subtaskBtnCheckCancel;
let _subtaskCancelBtn;
let _subtaskCheckBtn;
let _subtasks = [];

/**
 * Caches the subtask input, buttons and container references from the DOM.
 *
 * @returns {void}
 */
function _cacheSubtaskRefs() {
  _subtaskInput = document.getElementById("addNewSubtaskInput");
  _subtaskBtnAdd = document.querySelector(".btn-subtask.add");
  _subtaskBtnCheckCancel = document.querySelector(".btn-subtask.check-cancel");
  _subtaskCancelBtn = document.querySelector(".cancel-subtask");
  _subtaskCheckBtn = document.querySelector(".check-subtask");
}

/**
 * Switches the subtask input area into "typing" mode (hide add, show check/cancel).
 *
 * @returns {void}
 */
function showSubtaskInputMode() {
  _subtaskBtnAdd.style.display = "none";
  _subtaskBtnCheckCancel.style.display = "flex";
}

/**
 * Switches the subtask input area back into "idle" mode (show add, hide check/cancel).
 *
 * @returns {void}
 */
function _resetSubtaskInputMode() {
  _subtaskBtnAdd.style.display = "flex";
  _subtaskBtnCheckCancel.style.display = "none";
  _subtaskInput.value = "";
}

/**
 * Wires the subtask input, add button, focus, and cancel button interactions.
 *
 * @returns {void}
 */
function styleSubtaskInput() {
  _subtaskBtnAdd.addEventListener("click", () => { showSubtaskInputMode(); _subtaskInput.focus(); });
  _subtaskInput.addEventListener("focus", showSubtaskInputMode);
  _subtaskCancelBtn.addEventListener("click", _resetSubtaskInputMode);
}

/**
 * Wires delete-buttons on subtask list items to remove the item and re-render.
 *
 * @returns {void}
 */
function deleteSubtask() {
  const subtaskListItems = document.querySelectorAll(".subtask-list-item");
  subtaskListItems.forEach((item, index) => {
    const deleteSubtaskBtn = item.querySelector(".delete-subtask-btn");
    deleteSubtaskBtn.addEventListener("click", () => {
      _subtasks.splice(index, 1);
      renderSubtasks();
    });
  });
}

/**
 * Replaces a subtask list item's content with an inline edit input.
 *
 * @param {HTMLElement} item - The subtask list item to switch into edit mode.
 * @returns {void}
 */
function _switchSubtaskItemToInput(item) {
  if (item.querySelector(".edit-subtask-input")) return;
  const text = item.querySelector(".li-text").textContent.trim();
  item.innerHTML = createListItemTextContentTemplate(text);
  item.classList.add("subtask-list-item-edit");
  deleteSubtask();
  confirmSubtaskEdit();
}

/**
 * Wires edit-button click and dblclick on subtask items to switch them into an input.
 *
 * @returns {void}
 */
function editSubTask() {
  document.querySelectorAll(".subtask-list-item").forEach((item) => {
    const handleEdit = () => _switchSubtaskItemToInput(item);
    item.querySelector(".edit-subtask-btn").addEventListener("click", handleEdit);
    item.addEventListener("dblclick", handleEdit);
  });
}

/**
 * Persists a single subtask-edit input into the local subtasks array.
 *
 * @param {HTMLElement} item - The list item currently being edited.
 * @returns {void}
 */
function _persistSubtaskEdit(item) {
  const input = item.querySelector(".edit-subtask-input");
  if (input.value.trim() === "") return;
  _subtasks[item.getAttribute("data-index")] = input.value.trim();
  renderSubtasks();
}

/**
 * Wires confirm-buttons on subtask edit inputs to save the new value and re-render.
 *
 * @returns {void}
 */
function confirmSubtaskEdit() {
  document.querySelectorAll(".subtask-list-item-edit").forEach((item) => {
    item.querySelector(".confirm-subtask-edit-btn").addEventListener("click", () => {
      _persistSubtaskEdit(item);
    });
  });
}

/**
 * Adds the current input value as a new subtask and re-renders the list.
 *
 * @returns {void}
 */
function addSubtask() {
  const value = _subtaskInput.value.trim();
  if (value === "") return;
  _subtasks.push(value);
  renderSubtasks();
  _resetSubtaskInputMode();
}

/**
 * Handles Enter keydown on the subtask input by adding a new subtask.
 *
 * @param {KeyboardEvent} event - The keydown event on the subtask input.
 * @returns {void}
 */
function _onSubtaskInputKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtask();
  }
}

/**
 * Renders every entry of the local subtasks array into the subtasks list.
 *
 * @returns {void}
 */
function renderSubtasks() {
  const subtasksList = document.querySelector(".list-subtasks");
  subtasksList.innerHTML = "";
  _subtasks.forEach((item, index) => {
    subtasksList.innerHTML += createSubtaskListItemAddTaskTemplate(index, item);
  });
  editSubTask();
  deleteSubtask();
}

/**
 * Wires the check button and Enter key of the subtask input to addSubtask.
 *
 * @returns {void}
 */
function _wireSubtaskConfirmTriggers() {
  _subtaskCheckBtn.addEventListener("click", addSubtask);
  _subtaskInput.addEventListener("keydown", _onSubtaskInputKeydown);
}

/**
 * Exposes a global reset for the Add-Task subtasks state (used from clearForm).
 *
 * @returns {void}
 */
function _installSubtasksResetHook() {
  window.__resetAddTaskSubtasks = () => {
    _subtasks.length = 0;
    renderSubtasks();
  };
}

/**
 * Initialises the subtask UI on Add-Task: caches refs and wires all handlers.
 *
 * @returns {void}
 */
function initSubtaskUI() {
  _cacheSubtaskRefs();
  if (!_subtaskInput) return;
  styleSubtaskInput();
  _wireSubtaskConfirmTriggers();
  _installSubtasksResetHook();
}

/**
 * Setzt sinnvolle min/max-Grenzen für ein Datumsfeld (heute bis +100 Jahre).
 *
 * @param {HTMLInputElement|null} el - Das Datumsfeld.
 * @returns {void}
 */
function applyDueDateBounds(el) {
  if (!el) return;
  const today = new Date();
  const min = today.toISOString().split("T")[0];
  const maxDate = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate());
  const max = maxDate.toISOString().split("T")[0];
  el.setAttribute("min", min);
  el.setAttribute("max", max);
  blockManualDateEntry(el);
}

/**
 * Verhindert manuelle Tastatur-Eingaben; Datum darf nur per Kalender gewählt werden.
 *
 * @param {HTMLInputElement} el - Das Datumsfeld.
 * @returns {void}
 */
function blockManualDateEntry(el) {
  if (!el || el.dataset.calendarOnly === "true") return;
  el.dataset.calendarOnly = "true";
  el.addEventListener("keydown", (e) => e.preventDefault());
  el.addEventListener("paste", (e) => e.preventDefault());
  el.addEventListener("drop", (e) => e.preventDefault());
}

/**
 * Setzt min/max-Grenzen auf allen bekannten Datums-Feldern der Task-Formulare.
 *
 * @returns {void}
 */
function initDueDateMin() {
  ["due-date-input", "inputDueDate"].forEach(id => applyDueDateBounds(document.getElementById(id)));
}

/**
 * Prüft, ob ein Datumsstring (YYYY-MM-DD) im gültigen Bereich (heute .. +100 Jahre) liegt.
 *
 * @param {string} value - Das eingegebene Datum.
 * @returns {boolean} True wenn plausibel und nicht in der Vergangenheit.
 */
function isDueDateInRange(value) {
  if (!value) return false;
  const d = new Date(value);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today.getFullYear() + 100, today.getMonth(), today.getDate());
  return d >= today && d <= maxDate;
}

document.addEventListener("DOMContentLoaded", initSubtaskUI);
document.addEventListener("DOMContentLoaded", initDueDateMin);

/**
 * Sets the displayed category to "Technical Task".
 *
 * @returns {void}
 */
function selectTechnicalStack() {
  let categoryTechnicalStack = document.getElementById("categoryTechnicalStack").innerHTML;
  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryTechnicalStack;
}

/**
 * Sets the displayed category to "User Story".
 *
 * @returns {void}
 */
function selectUserStory() {
  let categoryselectUserStory = document.getElementById("categoryUserStory").innerHTML;
  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryselectUserStory;
}

/**
 * Validates the task title (non-empty) and toggles its required message.
 *
 * @returns {boolean} True if the title is filled in, otherwise false.
 */
function validateTitle() {
  const title = document.getElementById("title");
  const titleRequired = document.getElementById("title-required");
  if (title.value.trim() === "") {
    titleRequired.style.display = "block";
    return false;
  }
  titleRequired.style.display = "none";
  return true;
}

/**
 * Validates the due date (non-empty) and toggles its required message.
 *
 * @returns {boolean} True if a due date is filled in, otherwise false.
 */
function validateDueDate() {
  const dueDate = document.getElementById("due-date-input");
  const dateRequired = document.getElementById("date-required");
  const value = dueDate.value.trim();
  if (value === "") {
    dateRequired.textContent = "This field is required";
    dateRequired.style.display = "block";
    return false;
  }
  if (!isDueDateInRange(value)) {
    dateRequired.textContent = "Bitte ein gültiges Datum wählen";
    dateRequired.style.display = "block";
    return false;
  }
  dateRequired.style.display = "none";
  return true;
}

/**
 * Validates that a task category has been chosen and toggles its required message.
 *
 * @returns {boolean} True if a category has been chosen, otherwise false.
 */
function validateCategory() {
  const categoryContainer = document.getElementById("category-container");
  const categoryRequired = document.getElementById("category-required");
  if (categoryContainer.textContent.trim() === "Select task category") {
    categoryRequired.style.display = "block";
    return false;
  }
  categoryRequired.style.display = "none";
  return true;
}

/**
 * Validates the description (non-empty) and toggles its required message.
 *
 * @returns {boolean} True if the description is filled in, otherwise false.
 */
function validateDescription() {
  const description = document.getElementById("description").value.trim();
  const descriptionError = document.getElementById("description-required");
  if (description === "") {
    descriptionError.style.display = "block";
    return false;
  }
  descriptionError.style.display = "none";
  return true;
}

/**
 * Validates that at least one user has been assigned and toggles the required message.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {boolean} True if at least one user is assigned, otherwise false.
 */
function validateAssignedTo(id) {
  const assignedToError = document.getElementById("assigned-to-required");
  const assignedUsers = getAssignedUsers(id);
  if (assignedUsers === "") {
    assignedToError.style.display = "block";
    return false;
  }
  assignedToError.style.display = "none";
  return true;
}

/**
 * Validates that a priority other than "None" has been chosen.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {boolean} True if a priority has been chosen, otherwise false.
 */
function validatePriority(id) {
  const priority = getTaskPrio(id);
  const priorityError = document.getElementById("prio-required");
  if (priority === "None") {
    priorityError.style.display = "block";
    return false;
  }
  priorityError.style.display = "none";
  return true;
}

/**
 * Runs all form validators and returns whether every one of them passes.
 *
 * @param {string} id - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {boolean} True if every validator passes.
 */
function runAllTaskValidators(id) {
  return (
    validateTitle() &&
    validateDueDate() &&
    validateCategory() &&
    validateDescription() &&
    validateAssignedTo(id) &&
    validatePriority(id)
  );
}

/**
 * Validates all task fields and creates the task if everything is valid.
 *
 * @param {Event} event - The form submit event.
 * @param {string} [id=""] - Context suffix ("" for the main page, "Popup" for the overlay).
 * @returns {void}
 */
function validateAndCreateTask(event, id = "") {
  event.preventDefault();
  if (runAllTaskValidators(id)) {
    createTask(id);
  }
}
