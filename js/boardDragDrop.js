/**
 * Wires drag/drop on all task cards and drop zones (card containers and
 * the empty-state areas above them).
 *
 * @returns {void}
 */
function addDragAndDropEvents() {
  const draggedCards = document.querySelectorAll(".taskCard");
  const dropZones = document.querySelectorAll(".cardContainer, .taskBoard");
  draggedCards.forEach((card) => bindDragStart(card));
  dropZones.forEach((zone) => bindDropZone(zone));
}

/**
 * Wires dragstart/dragend on a task card: sets its id as payload and clears
 * any leftover drop highlights when the drag ends.
 *
 * @param {HTMLElement} card - The task card element to make draggable.
 * @returns {void}
 */
function bindDragStart(card) {
  card.ondragstart = (event) => {
    event.dataTransfer.setData("text", event.target.id);
  };
  card.ondragend = clearDropHighlights;
}

/**
 * Returns the card container belonging to a drop zone element.
 *
 * @param {HTMLElement} zone - The drop zone (card container or empty-state area).
 * @returns {HTMLElement|null} The card container of the zone's board column.
 */
function resolveDropContainer(zone) {
  if (zone.classList.contains("cardContainer")) return zone;
  const statusItem = zone.closest(".statusItem");
  return statusItem ? statusItem.querySelector(".cardContainer") : null;
}

/**
 * Removes the drag highlight from every card container.
 *
 * @returns {void}
 */
function clearDropHighlights() {
  document.querySelectorAll(".cardContainer.highlightDragArea").forEach((zone) => {
    zone.classList.remove("highlightDragArea");
  });
}

/**
 * Wires dragover/dragleave/drop handlers on a single drop zone. Uses a CSS
 * class (transparent outline) for the highlight so no layout shift occurs
 * while dragging over the zone.
 *
 * @param {HTMLElement} zone - The drop zone element to configure.
 * @returns {void}
 */
function bindDropZone(zone) {
  zone.ondragover = (event) => {
    event.preventDefault();
    const container = resolveDropContainer(event.currentTarget);
    if (container) container.classList.add("highlightDragArea");
  };
  zone.ondragleave = (event) => {
    const container = resolveDropContainer(event.currentTarget);
    if (container) container.classList.remove("highlightDragArea");
  };
  zone.ondrop = handleDropZoneDrop;
}

/**
 * Handles a drop: appends the card, resets styles, updates the task level.
 *
 * @param {DragEvent} event - The drop event fired by the drop zone.
 * @returns {void}
 */
function handleDropZoneDrop(event) {
  event.preventDefault();
  const container = resolveDropContainer(event.currentTarget);
  const data = event.dataTransfer.getData("text");
  const card = document.getElementById(data);
  clearDropHighlights();
  if (!container || !card) return;
  container.appendChild(card);
  dragAndDropOnDrop(container.id, data);
}

/**
 * Sets data of the dropped card for drag and drop.
 *
 * @param {string} targetId - The id of the container the card was dropped on.
 * @param {string} data - The id of the dropped card element.
 * @returns {void}
 */
function dragAndDropOnDrop(targetId, data) {
  let newLevel = getNewDragAndDropContainerName(targetId);
  let taskNr = data.split("-")[1];
  tasks[taskNr].level = newLevel;
  editTask(tasks[taskNr].id, tasks[taskNr]);
  checkTaskLevels();
}

/**
 * Moves task at index `i` one level up in the workflow.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Promise<void>} Resolves when the task is persisted and rerendered.
 */
async function moveTaskUp(i) {
  const nextLevel = _levelUp(tasks[i].level);
  if (!nextLevel) return;
  tasks[i].level = nextLevel;
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/**
 * Returns the workflow level directly above the given level.
 *
 * @param {string} level - The current level of the task.
 * @returns {string|null} The next level up, or null when already at the top.
 */
function _levelUp(level) {
  if (level == "In Progress") return "To do";
  if (level == "Awaiting Feedback") return "In Progress";
  if (level == "Done") return "Awaiting Feedback";
  return null;
}

/**
 * Moves task at index `i` one level down in the workflow.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Promise<void>} Resolves when the task is persisted and rerendered.
 */
async function moveTaskDown(i) {
  const nextLevel = _levelDown(tasks[i].level);
  if (!nextLevel) return;
  tasks[i].level = nextLevel;
  await editTask(tasks[i].id, tasks[i]);
  renderTaskCards();
}

/**
 * Returns the workflow level directly below the given level.
 *
 * @param {string} level - The current level of the task.
 * @returns {string|null} The next level down, or null when already at the bottom.
 */
function _levelDown(level) {
  if (level == "Awaiting Feedback") return "Done";
  if (level == "In Progress") return "Awaiting Feedback";
  if (level == "To do") return "In Progress";
  return null;
}

/**
 * Returns the level name for a drop container id.
 *
 * @param {string} targetId - The id of the drop container element.
 * @returns {string|undefined} The workflow level string, or undefined when unknown.
 */
function getNewDragAndDropContainerName(targetId) {
  if (targetId.includes("cardContainertoDo")) return "To do";
  if (targetId.includes("cardContainerinProgress")) return "In Progress";
  if (targetId.includes("cardContainerawaitingFeedback")) return "Awaiting Feedback";
  if (targetId.includes("cardContainerdone")) return "Done";
}

/**
 * Toggles empty-state hints for all four task-level containers.
 *
 * @returns {void}
 */
function checkTaskLevels() {
  toggleEmptyState("cardContainertoDo", "emptyTaskTodo");
  toggleEmptyState("cardContainerinProgress", "emptyTaskInProgress");
  toggleEmptyState("cardContainerawaitingFeedback", "emptyTaskAwait");
  toggleEmptyState("cardContainerdone", "emptyTaskDone");
}

/**
 * Shows the empty-state hint if the container has no child cards, hides otherwise.
 *
 * @param {string} containerId - The id of the card container element.
 * @param {string} emptyHintId - The id of the empty-state hint element.
 * @returns {void}
 */
function toggleEmptyState(containerId, emptyHintId) {
  const isEmpty = document.getElementById(containerId).childElementCount == 0;
  document.getElementById(emptyHintId).classList.toggle("d-none", !isEmpty);
}
