document.addEventListener("DOMContentLoaded", () => {
  const subtaskInput = document.getElementById("addNewSubtaskInput");
  const subtaskBtnAdd = document.querySelector(".btn-subtask.add");
  const subtaskBtnCheckCancel = document.querySelector(".btn-subtask.check-cancel");
  const subtaskCancelBtn = document.querySelector(".cancel-subtask");
  const subtaskCheckBtn = document.querySelector(".check-subtask");

  let subtasks = [];

  function styleSubtaskInput() {
    subtaskBtnAdd.addEventListener("click", () => {
      subtaskBtnAdd.style.display = "none";
      subtaskBtnCheckCancel.style.display = "flex";
      subtaskInput.focus();
    });

    subtaskInput.addEventListener("focus", () => {
      subtaskBtnAdd.style.display = "none";
      subtaskBtnCheckCancel.style.display = "flex";
    });

    subtaskCancelBtn.addEventListener("click", () => {
      subtaskBtnAdd.style.display = "flex";
      subtaskBtnCheckCancel.style.display = "none";
      subtaskInput.value = "";
    });
  }

  /**
   * Attaches click event listeners to the delete buttons of subtask list items.
   * When a delete button is clicked, the corresponding subtask is removed from the
   * `subtasks` array, and the subtask list is re-rendered.  This function should
   * be called *after* the subtask list items have been added to the DOM.  It
   * assumes that the `subtasks` array and `renderSubtasks` function are defined
   * elsewhere.
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
   * Attaches click and double-click event listeners to the edit buttons and list
   * items of subtasks. When an edit button or a list item is clicked/double-clicked,
   * the subtask item's content is replaced with an input field for editing.
   * The `createListItemTextContentTemplate`, `deleteSubtask`, and
   * `confirmSubtaskEdit` functions are assumed to be defined elsewhere. This
   * function should be called *after* the subtask list items have been added
   * to the DOM.
   */
  function editSubTask() {
    const subtaskListItems = document.querySelectorAll(".subtask-list-item");

    subtaskListItems.forEach((item) => {
      const editSubtaskBtn = item.querySelector(".edit-subtask-btn");

      const handleEdit = () => {
        let input = item.querySelector(".edit-subtask-input");
        if (!input) {
          let liText = item.querySelector(".li-text");
          item.innerHTML = createListItemTextContentTemplate(
            liText.textContent.trim()
          );
          item.classList.add("subtask-list-item-edit");
          deleteSubtask();
          confirmSubtaskEdit();
        }
      };

      editSubtaskBtn.addEventListener("click", handleEdit);
      item.addEventListener("dblclick", handleEdit);
    });
  }

  /**
   * Attaches click event listeners to the confirm buttons of subtask edit input
   * fields. When a confirm button is clicked, the edited subtask text is retrieved
   * from the input field, and if it's not empty, the `subtasks` array is updated,
   * and the subtask list is re-rendered. This function should be called *after*
   * the subtask edit input fields have been added to the DOM. It assumes that
   * the `subtasks` array and `renderSubtasks` function are defined elsewhere.
   */
  function confirmSubtaskEdit() {
    const subtaskListItemsEdit = document.querySelectorAll(
      ".subtask-list-item-edit"
    );

    subtaskListItemsEdit.forEach((item) => {
      const confirmSubtaskEditBtn = item.querySelector(
        ".confirm-subtask-edit-btn"
      );
      confirmSubtaskEditBtn.addEventListener("click", () => {
        const index = item.getAttribute("data-index");
        const input = item.querySelector(".edit-subtask-input");
        if (input.value !== "") {
          subtasks[index] = input.value;
          renderSubtasks();
        }
      });
    });
  }

  /**
   * Adds a new subtask to the `subtasks` array and re-renders the subtask list.
   * The subtask text is retrieved from the `subtaskInput` element, and if it's
   * not empty or just whitespace, it's added to the array. The input field is
   * then cleared, and the appropriate buttons are shown/hidden.  Event listeners
   * are attached to the `subtaskCheckBtn` (click) and `subtaskInput` (Enter key)
   * to trigger the `addSubtask` function. It is assumed that the `subtaskInput`,
   * `subtaskCheckBtn`, `subtaskBtnAdd`, `subtaskBtnCheckCancel`, `subtasks` array,
   * and `renderSubtasks` function are defined elsewhere.
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

  function renderSubtasks() {
    const subtasksList = document.querySelector(".list-subtasks");
    subtasksList.innerHTML = "";
    subtasks.forEach((item, index) => {
      subtasksList.innerHTML += createSubtaskListItemAddTaskTemplate(
        index,
        item
      );
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
 * Selects the technical stack category and updates the displayed category.
 * Retrieves the technical stack category from the element with the ID
 * 'categoryTechnicalStack' and sets it as the content of the element with the
 * ID 'category-displayed'.
 */
function selectTechnicalStack() {
  let categoryTechnicalStack = document.getElementById(
    "categoryTechnicalStack"
  ).innerHTML;

  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryTechnicalStack;
}

/**
 * Selects the user story category and updates the displayed category.
 * Retrieves the user story category from the element with the ID 'categoryUserStory'
 * and sets it as the content of the element with the ID 'category-displayed'.
 */
function selectUserStory() {
  let categoryselectUserStory =
    document.getElementById("categoryUserStory").innerHTML;

  let selectCategory = document.getElementById("category-displayed");
  selectCategory.innerHTML = "";
  selectCategory.innerHTML = categoryselectUserStory;
}

/**
 * Validates the task title input field.
 *
 * @returns {boolean} - Returns `true` if the title is valid (not empty), otherwise `false`.
 *
 * The function checks if the input field with the ID 'title' has a non-empty value.
 * If empty, it displays an error message by setting 'title-required' to `block`.
 * If valid, it hides the error message.
 */
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

/**
 * Validates the due date input field.
 *
 * @returns {boolean} - Returns `true` if the due date is valid (not empty), otherwise `false`.
 *
 * The function checks whether the input field with the ID 'due-date-input' has a non-empty value.
 * If empty, it displays an error message by setting 'date-required' to `block`.
 * If valid, it hides the error message.
 */
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

/**
 * Validates the task category selection.
 *
 * @returns {boolean} - Returns `true` if a valid category is selected, otherwise `false`.
 *
 * The function checks if the text content of the element with the ID 'category-container'
 * is still set to the default placeholder ('Select task category').
 * If so, it displays an error message by setting 'category-required' to `block`.
 * If a valid category is selected, it hides the error message.
 */
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

/**
 * Validates the task description input field.
 *
 * @returns {boolean} - Returns `true` if the description is valid (not empty), otherwise `false`.
 *
 * The function retrieves the trimmed value of the input field with the ID 'description'.
 * If empty, it displays an error message by setting 'description-required' to `block`.
 * If valid, it hides the error message.
 */
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

/**
 * Validates the assigned users for a task.
 *
 * @param {string} id - The ID of the element containing assigned users.
 * @returns {boolean} - Returns `true` if at least one user is assigned, otherwise `false`.
 *
 * The function retrieves assigned users using `getAssignedUsers(id)`.
 * If no users are assigned (empty string), it displays an error message by setting
 * 'assigned-to-required' to `block`. If valid, it hides the error message.
 */
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

/**
 * Validates the priority selection for a task.
 *
 * @param {string} id - The ID used to retrieve the selected priority.
 * @returns {boolean} - Returns `true` if a valid priority is selected, otherwise `false`.
 *
 * The function retrieves the priority value using `getTaskPrio(id)`.
 * If the priority is set to "None", it displays an error message by setting
 * 'prio-required' to `block`. If valid, it hides the error message.
 */
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

/**
 * Validates the task input form and creates a new task if the input is valid.
 * Prevents the default form submission behavior, performs validation checks
 * for title, due date, category, description, assigned users, and priority.
 * Displays error messages for invalid fields. If all fields are valid, calls
 * the `createTask` function to create the new task.
 * @param {Event} event The form submit event.
 * @param {string} [id=""] An optional ID, likely used for distinguishing between
 *                          different task forms.
 */
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
