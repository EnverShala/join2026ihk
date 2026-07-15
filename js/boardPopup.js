/**
 * Filters task cards by the search bar value (min 3 chars).
 *
 * @returns {void}
 */
function searchTasks() {
  const q = document.getElementById("searchBar").value.trim().toLowerCase();
  if (q.length <= 2) { showAllTaskCards(); checkTaskLevels(); return; }
  hideAllTaskCards();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].title.toLowerCase().includes(q) || tasks[i].description.toLowerCase().includes(q)) {
      showTaskCard(i);
    }
  }
  checkTaskLevels();
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

/**
 * Activates the priority button matching `prioName`.
 *
 * @param {string} prioName - The priority label ("Urgent", "Medium", "Low").
 * @param {string} [id=""] - Optional suffix identifying the form context.
 * @returns {void}
 */
function activatePrioButton(prioName, id = "") {
  if (prioName == "Urgent") clickOnUrgent(id);
  if (prioName == "Medium") clickOnMedium(id);
  if (prioName == "Low") clickOnLow(id);
}
