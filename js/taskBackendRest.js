document.addEventListener("DOMContentLoaded", () => {
  const subtaskInput = document.getElementById("addNewSubtaskInput");
  const subtaskBtnAdd = document.querySelector(".btn-subtask.add");
  const subtaskBtnCheckCancel = document.querySelector(".btn-subtask.check-cancel");
  const subtaskCancelBtn = document.querySelector(".cancel-subtask");
  const subtaskCheckBtn = document.querySelector(".check-subtask");

  let subtasks = [];

  function showSubtaskInputMode() {
    subtaskBtnAdd.style.display = "none";
    subtaskBtnCheckCancel.style.display = "flex";
  }

  function styleSubtaskInput() {
    subtaskBtnAdd.addEventListener("click", () => { showSubtaskInputMode(); subtaskInput.focus(); });
    subtaskInput.addEventListener("focus", showSubtaskInputMode);
    subtaskCancelBtn.addEventListener("click", () => {
      subtaskBtnAdd.style.display = "flex";
      subtaskBtnCheckCancel.style.display = "none";
      subtaskInput.value = "";
    });
  }

  /** Wires delete-buttons on subtask list items to remove + re-render. */
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

  function _switchSubtaskItemToInput(item) {
    if (item.querySelector(".edit-subtask-input")) return;
    const text = item.querySelector(".li-text").textContent.trim();
    item.innerHTML = createListItemTextContentTemplate(text);
    item.classList.add("subtask-list-item-edit");
    deleteSubtask();
    confirmSubtaskEdit();
  }

  /** Wires edit/dblclick on subtask items to switch them into an input. */
  function editSubTask() {
    document.querySelectorAll(".subtask-list-item").forEach((item) => {
      const handleEdit = () => _switchSubtaskItemToInput(item);
      item.querySelector(".edit-subtask-btn").addEventListener("click", handleEdit);
      item.addEventListener("dblclick", handleEdit);
    });
  }

  /** Wires confirm-buttons on subtask edit inputs to save + re-render. */
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

  /** Adds the current input value as a new subtask and re-renders. */
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


  function renderSubtasks() {
    const subtasksList = document.querySelector(".list-subtasks");
    subtasksList.innerHTML = "";
    subtasks.forEach((item, index) => {
      subtasksList.innerHTML += createSubtaskListItemAddTaskTemplate(index, item);
    });
    editSubTask();
    deleteSubtask();
  }

  window.__resetAddTaskSubtasks = () => {
    subtasks.length = 0;
    renderSubtasks();
  };

  styleSubtaskInput();
});

document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("due-date-input");

  const today = new Date().toISOString().split("T")[0];

  dateInput.setAttribute("min", today);
});

/** Sets the displayed category to "Technical Task". */
function selectTechnicalStack() {
  let categoryTechnicalStack = document.getElementById(
    "categoryTechnicalStack"
  ).innerHTML;

  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryTechnicalStack;
}

/** Sets the displayed category to "User Story". */
function selectUserStory() {
  let categoryselectUserStory =
    document.getElementById("categoryUserStory").innerHTML;

  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryselectUserStory;
}

/** Validates the task title (non-empty); toggles required message. @return {boolean} */
function validateTitle() {
  const title = document.getElementById("title");
  const titleRequired = document.getElementById("title-required");
  if (title.value.trim() === "") {
    titleRequired.style.display = "block";
    return false;
  } else {
    titleRequired.style.display = "none";
    return true;
  }
}

/** Validates the due date (non-empty); toggles required message. @return {boolean} */
function validateDueDate() {
  const dueDate = document.getElementById("due-date-input");
  const dateRequired = document.getElementById("date-required");
  if (dueDate.value.trim() === "") {
    dateRequired.style.display = "block";
    return false;
  } else {
    dateRequired.style.display = "none";
    return true;
  }
}

/** Validates that a task category has been chosen. @return {boolean} */
function validateCategory() {
  const categoryContainer = document.getElementById("category-container");
  const categoryRequired = document.getElementById("category-required");
  if (categoryContainer.textContent.trim() === "Select task category") {
    categoryRequired.style.display = "block";
    return false;
  } else {
    categoryRequired.style.display = "none";
    return true;
  }
}

/** Validates the description (non-empty); toggles required message. @return {boolean} */
function validateDescription() {
  const description = document.getElementById("description").value.trim();
  const descriptionError = document.getElementById("description-required");
  if (description === "") {
    descriptionError.style.display = "block";
    return false;
  } else {
    descriptionError.style.display = "none";
    return true;
  }
}

/** Validates that at least one user is assigned. @param {string} id @return {boolean} */
function validateAssignedTo(id) {
  const assignedToError = document.getElementById("assigned-to-required");
  const assignedUsers = getAssignedUsers(id);
  if (assignedUsers === "") {
    assignedToError.style.display = "block";
    return false;
  } else {
    assignedToError.style.display = "none";
    return true;
  }
}

/** Validates that a priority (not "None") has been chosen. @param {string} id @return {boolean} */
function validatePriority(id) {
  const priority = getTaskPrio(id);
  const priorityError = document.getElementById("prio-required");
  if (priority === "None") {
    priorityError.style.display = "block";
    return false;
  } else {
    priorityError.style.display = "none";
    return true;
  }
}

/** Validates all task fields; calls createTask if everything is valid. @param {Event} event @param {string} id */
function validateAndCreateTask(event, id = "") {
  event.preventDefault();

  if (
    validateTitle() &&
    validateDueDate() &&
    validateCategory() &&
    validateDescription() &&
    validateAssignedTo(id) &&
    validatePriority(id)
  ) {
    createTask(id);
  }
}
