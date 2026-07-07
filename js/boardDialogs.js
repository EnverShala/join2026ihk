/**
 * Returns the index (task number) of the task with the current ID in the tasks array.
 *
 * @returns {number} The index of the task, or undefined if the task is not found.
 */
function getTaskNrFromCurrentId() {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id == currentId) {
        return i;
      }
    }
  }
  
  /**
   * Retrieves the text content of all subtask list items and concatenates them into a string, separated by "|".
   *
   * @param {string} [id=""] An optional ID to append to the subtask list ID.
   * @returns {string} A string containing the text content of all subtask list items, separated by "|",
   *                   or an empty string if there are no list items.
   */
  function getSubtaskItems(id = "") {
    let subtaskItems = document
      .getElementById("subtaskList" + id)
      .getElementsByTagName("li");
    let newSubtasks = "";
  
    if (subtaskItems.length > 0) {
      for (j = 0; j < subtaskItems.length; j++) {
        newSubtasks += subtaskItems[j].innerText + "|";
      }
    }
  
    newSubtasks = newSubtasks.slice(0, -1);
  
    return newSubtasks;
  }
  
  /**
   * Retrieves the names of the assigned users based on the checked checkboxes.
   *
   * @param {string} [id=""] An optional ID to include in the checkbox ID.
   * @returns {string} A string containing the names of the assigned users, separated by commas,
   *                   or an empty string if no users are assigned.
   */
  function getAssignedUsers(id = "") {
    let newAssigned = "";
  
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        let checkbox = document.getElementById(`AssignedContact${id}${i}`);
  
        if (checkbox.checked == true) {
          newAssigned += users[i].name + ",";
        }
      }
      newAssigned = newAssigned.slice(0, -1);
    }
  
    return newAssigned;
  }
  
  /**
   * Edits the currently selected task with the values from the edit form.
   */
  async function editCurrentTask() {
    let newTitle = document.getElementById("inputEdit").value.trim();
    let newDescription = document.getElementById("inputDescription").value.trim();
    let newDate = document.getElementById("inputDueDate").value;
    let newPrio = getTaskPrio();
    let newAssigned = "", newSubtasks = "", currentTask = -1;
  
    currentTask = getTaskNrFromCurrentId();
  
    let oldLevel = tasks[currentTask].level, oldCategory = tasks[currentTask].category, subtasksDone = tasks[currentTask].subtasksDone;
  
    newSubtasks = getSubtaskItems();
    newAssigned = getAssignedUsers();

    let attachment = typeof getAttachmentJson === "function" ? getAttachmentJson("edit") : "";

    let newTask = createTaskArray(newTitle, newDescription, newDate, oldCategory, newPrio, oldLevel, newSubtasks, newAssigned, subtasksDone, attachment);

    await editTask(currentId, newTask);
    await renderTaskCards();

    closeDialog();
  }
  
  /**
   * Creates a new task object.
   *
   * @param {string} newTitle The title of the task.
   * @param {string} newDescription The description of the task.
   * @param {string} newDate The due date of the task.
   * @param {string} oldCategory The category of the task.
   * @param {string} newPrio The priority of the task.
   * @param {string} oldLevel The level of the task.
   * @param {string} newSubtasks The subtasks of the task (as a string).
   * @param {string} newAssigned The assigned users of the task (as a string).
   * @param {string} [subtasksDone=""] The string of completed subtasks
   * @returns {object} A new task object.
   */
  function createTaskArray(newTitle, newDescription, newDate, oldCategory, newPrio, oldLevel, newSubtasks, newAssigned) {
    return {
      title: newTitle,
      description: newDescription,
      date: newDate,
      category: oldCategory,
      priority: newPrio,
      level: oldLevel,
      subtasks: newSubtasks,
      assigned: newAssigned,
    };
  }
  
  /**
   * Opens the task selection popup dialog.
   */
  function openDialog() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('htmlID').style.overflow="hidden";
    setTimeout(() => {
      document.getElementById("popupOnTaskSelectionID").style.visibility =
        "visible";
    }, 100);

  }
  
  /**
   * Closes the task selection popup dialog and resets the main container visibility.
   */
  function closeDialog() {
    document.getElementById("popupOnTaskSelectionID").style.visibility = "hidden";
    document.getElementById("editPopUpID").classList.add("d-none");
    document.getElementById('htmlID').style.overflow="scroll";
    if (typeof clearAttachmentState === "function") clearAttachmentState("edit");
    if (typeof closeImageViewer === "function") closeImageViewer();
    setTimeout(() => {
      document
        .getElementById("popupOnTaskSelectionMainContainerID")
        .classList.remove("d-none");
    }, 250);
  }
  
  /**
   * Loads task data into the popup display elements.
   *
   * @param {number} taskNr The index of the task in the tasks array.
   * @param {string} contactEllipse HTML for the contact ellipse display.
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
   * Populates the popup with task data, including subtasks and assigned user initials.
   *
   * @param {number} taskNr The index of the task in the tasks array.
   */
  async function popupValueImplementFromTask(taskNr) {
    await loadTasks();
  
    subtasksArray = tasks[taskNr].subtasks.split("|");
    let contactEllipse = "";
  
    let assignedUsers = tasks[taskNr].assigned.split(",");
  
    while (assignedUsers.length > 0) {
      contactEllipse += `<div class="badgeImg initialsColor${await getUserColor(assignedUsers[0])}">${getUserInitials(assignedUsers[0])}</div>`;
      assignedUsers.splice(0, 1);
    }
  
    loadPopupValueData(taskNr, contactEllipse);

    let assignedNames = tasks[taskNr].assigned.split(",");
    currentId = tasks[taskNr].id;

    renderValueFromNames(assignedNames);
    renderSubtasksDoneCheckboxes(subtasksArray, taskNr);
    if (typeof renderAttachmentsSection === "function") {
      renderAttachmentsSection(tasks[taskNr].attachments || "");
    }
  }

   /**
   * creates/renders the name Values into HTML Divs
   */
  function renderValueFromNames(assignedNames = []) {
    let valueFromName = document.getElementById("popupContactNameID");
    valueFromName.innerHTML = "";

    for (let j = 0; j < assignedNames.length; j++) {
      valueFromName.innerHTML += `<div>${assignedNames[j]}</div>`;
    }
  }

  /**
  * Renders a list of subtasks with checkboxes indicating their completion status.
  * 
  * @param {string[]} [subtasksArray=[]] - An array of subtasks to be displayed.
  * @param {number} taskNr - The index of the task in the tasks array.
  * 
  * The function clears the existing subtasks list and iterates over the provided subtasksArray.
  * If a subtask is marked as done in `tasks[taskNr].subtasksDone`, its checkbox is pre-checked.
  * Each checkbox has an `onclick` event that calls `toggleSubtaskDone` to update the status.
  */
  function renderSubtasksDoneCheckboxes(subtasksArray = [], taskNr) {
    let subtasksList = document.getElementById("showSubtasksContainer");
    subtasksList.innerHTML = "";

    if(tasks[taskNr].subtasks.trim() == "") { return; }
  
    for (let j = 0; j < subtasksArray.length; j++) {
      if (tasks[taskNr].subtasksDone.includes(subtasksArray[j])) {
        subtasksList.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})" checked>${subtasksArray[j]}<p>`;
      } else {
        subtasksList.innerHTML += `<p class="subtasksP"><input type="checkbox" id="subtaskCheckbox${j}" onclick="toggleSubtaskDone(${taskNr}, '${subtasksArray[j]}', ${j})">${subtasksArray[j]}<p>`;
      }
    }
  }
  
  /**
   * Retrieves a color index for a given user name.  Loads user data if necessary.
   * The color index is between 1 and 15 (inclusive).
   *
   * @param {string} userName The name of the user.
   * @returns {Promise<number>} A promise that resolves to the color index (1-15), or 1 if the user is not found.
   */
  async function getUserColor(userName) {
    await loadUsers("/users");
    let returnColor = 1;
  
    for (let i = 0; i < users.length; i++) {
      if (users[i].name == userName) {
        returnColor = i + 1;
        while (returnColor > 15) {
          returnColor -= 15;
        }
        return returnColor;
      }
    }
    return returnColor;
  }
  
  /**
   * Returns the ID of a card container element based on its name.  Hides the corresponding "empty task" message.
   *
   * @param {string} cardContainerIdName The name of the card container ("To do", "In Progress", "Awaiting Feedback", or "Done").
   * @returns {string} The ID of the card container element, or an empty string if the name is invalid.
   */
  function getCardContainerId(cardContainerIdName) {
    let result;
  
    switch (cardContainerIdName) {
      case "To do":
        result = "cardContainertoDo";
        document.getElementById("emptyTaskTodo").classList.add("d-none");
        break;
      case "In Progress":
        result = "cardContainerinProgress";
        document.getElementById("emptyTaskInProgress").classList.add("d-none");
        break;
      case "Awaiting Feedback":
        result = "cardContainerawaitingFeedback";
        document.getElementById("emptyTaskAwait").classList.add("d-none");
        break;
      case "Done":
        result = "cardContainerdone";
        document.getElementById("emptyTaskDone").classList.add("d-none");
        break;
      default:
        result = "";
        break;
    }
  
    return result;
  }
  
  /**
   * Renders the task cards based on the loaded tasks data.
   */
  async function renderTaskCards() {
    await loadTasks("/tasks");
  
    clearCardContainersInnerHtml();
  
    for (let i = 0; i < tasks.length; i++) {
      const uniqueId = `taskCard-${i}`;
      let assignedUsers = tasks[i].assigned.split(",");
      let subTasksArray =tasks[i].subtasks.split("|") == "" ? [] : tasks[i].subtasks.split("|");  
      let cardContainerIdName = getCardContainerId(tasks[i].level);  
      let assignedUsersHTML = "";
  
      assignedUsersHTML = await renderTaskCardUserCircles(assignedUsers);
  
      document.getElementById(cardContainerIdName).innerHTML += taskCardTemplate(uniqueId, i, subTasksArray, assignedUsersHTML);
    }
    addDragAndDropEvents();
  }

   /**
   * Renders the task cards user circles for the taskcards, if more than 4 Users assigned show circle with number of rest users
   */
  async function renderTaskCardUserCircles(assignedUsersArray = []) {
    let assignedUsersHTML = "", assignedUsers = assignedUsersArray;
    let counter = 0, taskUsers = assignedUsers.length;

    while (assignedUsers.length > 0) {
      assignedUsersHTML += `<div class="badgeImg initialsColor${await getUserColor(assignedUsers[0])}">${getUserInitials(assignedUsers[0])}</div>`;
      assignedUsers.splice(0, 1);
      counter++;

      if (counter == 4 && taskUsers > 4) {
        assignedUsersHTML += `<div class="badgeImg initialsColor0">+${taskUsers - counter}</div>`;
        return assignedUsersHTML;
      }
    }

    return assignedUsersHTML;
  }
  
  /**
   * Clears the inner HTML of all card container elements.
   */
  function clearCardContainersInnerHtml() {
    document.getElementById("cardContainertoDo").innerHTML = "";
    document.getElementById("cardContainerinProgress").innerHTML = "";
    document.getElementById("cardContainerawaitingFeedback").innerHTML = "";
    document.getElementById("cardContainerdone").innerHTML = "";
  }
