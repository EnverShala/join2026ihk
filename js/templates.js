/**
 * Generates the HTML template for a task card.
 *
 * @param {string} uniqueId The unique ID of the task card.
 * @param {number} i The index of the task in the tasks array.
 * @param {string[]} subTasksArray An array of subtask descriptions.
 * @param {string} assignedUsersHTML HTML for the assigned user badges.
 * @returns {string} The HTML template for the task card.
 */
function taskCardTemplate(uniqueId, i, subTasksArray, assignedUsersHTML) {
  let subtasksDone = tasks[i].subtasksDone;

  if (subtasksDone.endsWith("|")) {
    subtasksDone = subtasksDone.slice(0, -1);
  }

  subtasksDone = subtasksDone == "" ? [] : subtasksDone.split("|");

  let widthPercent = (100 / subTasksArray.length) * subtasksDone.length;
  let zeroSubtasks = subTasksArray.length > 0 ? "" : "d-none";

  return `
                <div draggable="true" id="${uniqueId}" class="taskCard">
                <div class="taskCardTop">
                  <label class="categoryGreen">${tasks[i].category}</label>
                  <div class="ResponsiveMenuOnTaskCards">
                    <img onclick="moveTaskUp(${i})" src="./img/board/arrow_up.svg" class=arrowUp></img>
                    <img onclick="moveTaskDown(${i})" src="./img/board/arrow_down.svg" class=arrowDown></img>
                  </div>
                  <div class="dropdownCard">
                    <button onclick="toggleDropdown('dropdown-content')" class="dropdown-btn">
                      <div class="dropdownBtnContainer">
                        <img src="" alt="Dropdown Arrow">
                      </div>
                    </button>
                    <div id="dropdown-content" class="dropdown-content">
                      <p onclick="">In Progress</p>
                      <p onclick="">Done</p>
                      <p onclick="">Awaiting Feedback</p>
                    </div>
                  </div>
                </div>
                <div class="cardBody" onclick="openDialog(); popupValueImplementFromTask(${i})">
                  <p id="titelCardID" class="titleCard">${tasks[i].title}</p>
                  <p id="descriptionCardID" class="descriptionCard">${
                    tasks[i].description
                  }</p>
                  <div>
                    <div class="progress  ${zeroSubtasks}">
                      <div class="progressBarContainer">
                        <div id="" class="progressBar" style="width: ${widthPercent}%;"></div>
                      </div>
                      <p class="amountSubtasks">${subtasksDone.length} / ${subTasksArray.length} subtask(s)</p>
                    </div>
                    <div class="footerCard">
                      <div id="profileBadges${i}" class="profileBadges">
                        ${assignedUsersHTML}
                      </div>
                      <div class="prioImg">
                        <img src="./img/${tasks[
                          i
                        ].priority.toLowerCase()}.svg" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
                  `;
}

/**
 * Generates the HTML template for a contact list item.
 *
 * @param {number} i The index of the user in the users array.
 * @param {number} j The color index for the user.
 * @param {number} x A unique identifier for the contact container.
 * @returns {string} The HTML template for the contact list item.
 */
function contactTemplate(i, j, x) {
  return `<div id="user-container${i}">
            <div id="contact-containerID${x}" class="contact-container" onclick="loadUserInformation(${i}); hideContactsListInResponsiveMode()">
            <div class="contact-list-ellipse">
               <div id="userColor${i}" class="ellipse-list initialsColor${j}">${getUserInitials(
    users[i].name
  )}</div>
            </div>
            <div class="contact">
                <div class="contact-list-name" id="contactName">${
                  users[i].name
                }</div>
                <div class="contact-list-email" id="contactEmail">${
                  users[i].email
                }</div>
            </div>
            </div>
            </div>
            `;
}

/**
 * Generates the HTML template for a contact list item.
 *
 * @param {number} i The index of the user in the users array.
 * @param {number} j The color index for the user.
 * @param {number} x A unique identifier for the contact container.
 * @returns {string} The HTML template for the contact list item, or an empty string if the user is not found.
 */
function createRenderAssignedToUserTemplate(
  i,
  j,
  userInitials,
  userName,
  id = ""
) {
  return `
        <label onclick="event.stopPropagation()"><li class="list-item assigned-to"></label>
            <div class="list-item-name" onclick="toggleCheckbox('AssignedContact${id}${i}', '${id}')">
                <label><div class="circle initialsColor${j}">${userInitials}</div></label>
                <label>${userName}</label>
            </div>
            <input type="checkbox" onclick="toggleBackground(this)" id="AssignedContact${id}${i}" name="AssignedContact">
        </li>
    `;
}

/**
 * Generates the HTML template for a subtask list item in the "add task" context.
 *
 * @param {number} index The index of the subtask.
 * @param {string} item The subtask description.
 * @returns {string} The HTML template for the subtask list item, or an empty string if the item is empty.
 */
function createSubtaskListItemAddTaskTemplate(index, item) {
  if (item == "") {
    return "";
  }
  return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img id="editTask${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img id="deleteSubtask${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
            </li>
        `;
}

/**
 * Generates the HTML template for a subtask list item.
 *
 * @param {number} index The index of the subtask.
 * @param {string} item The subtask description.
 * @returns {string} The HTML template for the subtask list item, or an empty string if the item is empty.
 */
function createSubtaskListItemTemplate(index, item) {
  if (item == "") {
    return "";
  }
  return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtask(${index})" id="editTask${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtask(${index})" id="deleteSubtask${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
            </li>
        `;
}

/**
 * Creates an HTML list item for a subtask in a popup, including edit/delete icons
 * that call popup-specific functions.  Icon IDs include "Popup".
 * @param {number} index Subtask index (used for unique icon IDs).
 * @param {string} item Subtask text.
 * @returns {string} HTML list item string.
 */
function createSubtaskListItemPopupTemplate(index, item) {
  return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtaskPopup('${item}')" id="editTaskPopup${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtaskPopup('${item}')" id="deleteSubtaskPopup${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
            </li>
        `;
}

/**
 * Generates the HTML for a subtask list item, reverting from an input field
 * back to a display element with edit and delete icons.
 *
 * @param {number} index The index of the subtask. Used for generating unique
 *                       IDs for the edit and delete icons.
 * @param {string} item The text content of the subtask.
 * @returns {string} The HTML string representing the list item content.
 */
function changeSubtaskInputFieldBackToListElement(index, item) {
  return `
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtask(${index})" id="editTask${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtask(${index})" id="deleteSubtask${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
        `;
}

/**
 * Generates HTML for a subtask list item in a popup, reverting from an input
 * field back to a display element with popup-specific edit/delete icons.
 * Icon IDs include "Popup".
 * @param {number} index Subtask index (used for unique icon IDs).
 * @param {string} item Subtask text.
 * @returns {string} HTML string representing the list item content.
 */
function changeSubtaskInputFieldBackToListElementPopup(index, item) {
  return `
                <div class="li-text">${item}</div>
                <div class="subtask-edit-icon-div">
                    <img onclick="editSubtaskPopup('${item}')" id="editTaskPopup${index}" class="edit-subtask-btn" src="./img/edit.png" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtaskPopup('${item}')" id="deleteSubtaskPopup${index}"class="delete-subtask-btn" src="./img/delete.png" alt="">
                </div>
        `;
}

/**
 * Generates HTML for an input field to edit a subtask, replacing the display
 * element. Includes "cancel" and "confirm" buttons.
 * @param {number} position The subtask's position/index. Used for element IDs.
 * @param {string} actualContent The current text content of the subtask.
 * @returns {string} HTML string for the edit input field and buttons.
 */
function changeSubtaskContentToInputForEditTemplate(position, actualContent) {
  return `
    <input id="editSubtaskInput${position}" class="edit-subtask-input" type="text" value="${actualContent}" onkeydown = "subtaskOnKeyDown(${position})">
    <div class="edit-subtask-button-div">
    <span onclick="cancelSubtaskEdit(${position})" id="cancelSubtaskEdit${position}" class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
    <div class="subtask-divider"></div>
    <span onclick="confirmSubtaskEdit(${position})" id="confirmSubtaskEdit${position}" class="confirm-subtask-edit-btn edit"><img src="./img/check.png"></span>
    </div>
`;
}

/**
 * Generates HTML for an input field to edit a subtask *within a popup*,
 * replacing the display element. Includes popup-specific "cancel" and "confirm"
 * buttons. Input ID and button IDs include "Popup".
 * @param {number} position The subtask's position/index. Used for element IDs.
 * @param {string} actualContent The current text content of the subtask.
 * @returns {string} HTML string for the edit input field and buttons.
 */
function changeSubtaskContentToInputForEditPopupTemplate(
  position,
  actualContent
) {
  return `
    <input id="editSubtaskInputPopup${position}" class="edit-subtask-input" type="text" value="${actualContent}" onkeydown = "subtaskOnKeyDownPopup(${position})">
    <div class="edit-subtask-button-div">
    <span onclick="cancelSubtaskEditPopup(${position})" id="cancelSubtaskEditPopup${position}" class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
    <div class="subtask-divider"></div>
    <span onclick="confirmSubtaskEditPopup(${position})" id="confirmSubtaskEditPopup${position}" class="confirm-subtask-edit-btn edit"><img src="./img/check.png"></span>
    </div>
`;
}

/**
 * Generates HTML for an input field with "cancel" and "confirm" buttons,
 * intended for editing the text content of a list item.  Note: This template
 * lacks specific event handlers (onclick, etc.) which should be added
 * dynamically after the HTML is inserted into the DOM.
 * @param {string} textContent The initial text content to display in the input field.
 * @returns {string} HTML string for the input field and buttons.
 */
function createListItemTextContentTemplate(textContent) {
  return `
                    <input class="edit-subtask-input" type="text" value="${textContent}">
                    <div class="edit-subtask-button-div">
                        <span class="delete-subtask-btn edit"><img src="./img/delete.png"></span>
                        <div class="subtask-divider"></div>
                        <span class="confirm-subtask-edit-btn"><img src="./img/check.png"></span>
                    </div>
                `;
}

/**
 * Generates HTML for the Username Container with the first Letter
 */
function contactsFirstLetterTemplate(firstLetter) {
  return `<div class="contacts-first-letter-container"><span id="firstLetterOfContactName" class="contacts-first-letter">${firstLetter}</span></div>
                <div class="border-container"> <div class="border"></div></div>`;
}