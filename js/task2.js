document.addEventListener("DOMContentLoaded", () => {
  const subtaskInput = document.getElementById("addNewSubtaskInput");
  const subtaskBtnAdd = document.querySelector(".btn-subtask.add");
  const subtaskBtnCheckCancel = document.querySelector(".btn-subtask.check-cancel");
  const subtaskCancelBtn = document.querySelector(".cancel-subtask");
  const subtaskCheckBtn = document.querySelector(".check-subtask");

  let subtasks = [];

  /**
   * Switches the subtask input area into "typing" mode (hide add, show check/cancel).
   */
  function showSubtaskInputMode() {
    subtaskBtnAdd.style.display = "none";
    subtaskBtnCheckCancel.style.display = "flex";
  }

  /**
   * Wires the subtask input, add button, focus, and cancel button interactions.
   */
  function styleSubtaskInput() {
    subtaskBtnAdd.addEventListener("click", () => { showSubtaskInputMode(); subtaskInput.focus(); });
    subtaskInput.addEventListener("focus", showSubtaskInputMode);
    subtaskCancelBtn.addEventListener("click", () => {
      subtaskBtnAdd.style.display = "flex";
      subtaskBtnCheckCancel.style.display = "none";
      subtaskInput.value = "";
    });
  }

  /**
   * Wires delete-buttons on subtask list items to remove the item and re-render.
   */
  function deleteSubtask() {
    const subtaskListItems = document.querySelectorAll(".subtask-list-item");
    subtaskListItems.forEach((item, index) => {
      const deleteSubtaskBtn = item.querySelector(".delete-subtask-btn");
      deleteSubtaskBtn.addEventListener("click", () => {
        subtasks.splice(index, 1);
        renderSubtasks();
      });
    });
  }

  /**
   * Replaces a subtask list item's content with an inline edit input.
   *
   * @param {HTMLElement} item - The subtask list item to switch into edit mode.
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
   */
  function editSubTask() {
    document.querySelectorAll(".subtask-list-item").forEach((item) => {
      const handleEdit = () => _switchSubtaskItemToInput(item);
      item.querySelector(".edit-subtask-btn").addEventListener("click", handleEdit);
      item.addEventListener("dblclick", handleEdit);
    });
  }

  /**
   * Wires confirm-buttons on subtask edit inputs to save the new value and re-render.
   */
  function confirmSubtaskEdit() {
    document.querySelectorAll(".subtask-list-item-edit").forEach((item) => {
      item.querySelector(".confirm-subtask-edit-btn").addEventListener("click", () => {
        const input = item.querySelector(".edit-subtask-input");
        if (input.value === "") return;
        subtasks[item.getAttribute("data-index")] = input.value;
        renderSubtasks();
      });
    });
  }

  /**
   * Adds the current input value as a new subtask and re-renders the list.
   */
  function addSubtask() {
    if (subtaskInput.value.trim() !== "") {
      subtasks.push(subtaskInput.value.trim());
      renderSubtasks();
      subtaskInput.value = "";
      subtaskBtnAdd.style.display = "flex";
      subtaskBtnCheckCancel.style.display = "none";
    }
  }

  subtaskCheckBtn.addEventListener("click", addSubtask);

  subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addSubtask();
    }
  });

  /**
   * Renders every entry of the local subtasks array into the subtasks list.
   */
  function renderSubtasks() {
    const subtasksList = document.querySelector(".list-subtasks");
    subtasksList.innerHTML = "";
    subtasks.forEach((item, index) => {
      subtasksList.innerHTML += createSubtaskListItemAddTaskTemplate(index, item);
    });
    editSubTask();
    deleteSubtask();
  }

  styleSubtaskInput();
});

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("due-date-input");
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
});

/**
 * Sets the displayed category to "Technical Task".
 */
function selectTechnicalStack() {
  let categoryTechnicalStack = document.getElementById("categoryTechnicalStack").innerHTML;
  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryTechnicalStack;
}

/**
 * Sets the displayed category to "User Story".
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
  if (dueDate.value.trim() === "") {
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
 */
function validateAndCreateTask(event, id = "") {
  event.preventDefault();
  if (runAllTaskValidators(id)) {
    createTask(id);
  }
}
