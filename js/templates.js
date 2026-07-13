/** Returns HTML for a task card. `progress` is a computed object with doneCount, totalCount, widthPercent, emptyClass. */
function taskCardTemplate(uniqueId, i, assignedUsersHTML, progress) {
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
                  <p id="descriptionCardID" class="descriptionCard">${tasks[i].description}</p>
                  <div>
                    <div class="progress  ${progress.emptyClass}">
                      <div class="progressBarContainer">
                        <div id="" class="progressBar" style="width: ${progress.widthPercent}%;"></div>
                      </div>
                      <p class="amountSubtasks">${progress.doneCount} / ${progress.totalCount} subtask(s)</p>
                    </div>
                    <div class="footerCard">
                      <div id="profileBadges${i}" class="profileBadges">
                        ${assignedUsersHTML}
                      </div>
                      <div class="prioImg">
                        <img src="./img/${tasks[i].priority.toLowerCase()}.svg" alt="">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                  `;
}

/** Returns HTML for a contact list item. */
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

/** Returns HTML for an assigned-to dropdown list item. */
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

/** Returns HTML for a subtask list item in the "add task" context. */
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

/** Returns HTML for a subtask list item (edit form context). */
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

/** Returns HTML for a popup-context subtask list item. */
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

/** Reverts a subtask edit input back to its display markup. */
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

/** Popup variant of `changeSubtaskInputFieldBackToListElement`. */
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

/** Returns HTML for a subtask edit input with cancel/confirm buttons. */
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

/** Popup variant of `changeSubtaskContentToInputForEditTemplate`. */
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

/** Returns HTML for a generic list-item edit input (no handlers). */
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

/** Returns HTML for a contacts letter-group header. */
function contactsFirstLetterTemplate(firstLetter) {
  return `<div class="contacts-first-letter-container"><span id="firstLetterOfContactName" class="contacts-first-letter">${firstLetter}</span></div>
                <div class="border-container"> <div class="border"></div></div>`;
}

/** Returns HTML for the attachment lightbox root element. */
function lightboxTemplate() {
  return `
    <div class="lightbox-backdrop" onclick="closeImageViewer()"></div>
    <div class="lightbox-content">
      <button type="button" class="lightbox-close-btn" onclick="closeImageViewer()" aria-label="Schließen">&#x2715;</button>
      <div class="lightbox-nav-wrapper">
        <button type="button" class="lightbox-nav-btn lightbox-prev" onclick="_navigateLightbox(-1)" aria-label="Vorheriges Bild">&#x276E;</button>
        <div class="lightbox-inner">
          <img id="lightboxImg" class="lightbox-img" src="" alt="Anhang">
          <div class="lightbox-meta">
            <span id="lightboxName" class="lightbox-meta-name"></span>
            <span id="lightboxType" class="lightbox-meta-type"></span>
            <span id="lightboxSize" class="lightbox-meta-size"></span>
            <a id="lightboxDownload" class="lightbox-download-btn" href="#" download="">&#x2913; Download</a>
          </div>
        </div>
        <button type="button" class="lightbox-nav-btn lightbox-next" onclick="_navigateLightbox(1)" aria-label="Nächstes Bild">&#x276F;</button>
      </div>
    </div>`;
}

/** Returns HTML for one upload-preview thumbnail. */
function attachmentPreviewItemTemplate(att, i, context) {
  return `<div class="attachment-preview-item">
    <img class="attachment-thumb" src="${att.base64}" alt="${_esc(att.name)}"
         onclick="openUploadPreview('${context}', ${i})" role="button" tabindex="0"
         aria-label="Vorschau öffnen: ${_esc(att.name)}">
    <span class="attachment-file-name">${_esc(att.name)}</span>
    <button type="button" class="attachment-remove-btn"
            onclick="removeAttachment('${context}', ${i})"
            aria-label="${_esc(att.name)} entfernen">&#x2715;</button>
  </div>`;
}

/** Returns HTML for one attachment list item in the task detail view. */
function attachmentListItemTemplate(att, i) {
  return `<li class="attachment-list-item">
    <img class="attachment-list-thumb" src="${att.base64}" alt="${_esc(att.name || 'Bild')}"
         onclick="openImageViewer(${i})" aria-label="Vorschau: ${_esc(att.name || 'Bild')}">
    <span class="attachment-list-name" onclick="openImageViewer(${i})">${_esc(att.name || 'Bild')}</span>
    <a class="attachment-download-btn" href="${att.base64}" download="${_esc(att.name || 'download')}"
       aria-label="${_esc(att.name || 'Bild')} herunterladen">&#x2913;</a>
  </li>`;
}