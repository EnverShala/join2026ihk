/**
 * Deletes a user and removes them from every task's assigned list.
 *
 * @param {string} id - The Firebase id of the user to delete.
 * @returns {Promise<void>}
 */
async function deleteUser(id) {
  await loadTasks("/tasks");
  const user = users.find((u) => u.id == id);
  if (user) await removeUserFromAssignedTasks(user.name);
  await fetch(FIREBASE_URL + `/users/${id}` + ".json", { method: "DELETE" });
  await renderContacts();
  loadUserInformation(-1);
  if (typeof closePopup === "function") closePopup();
}

/**
 * Splits an assigned string into trimmed, non-empty names.
 *
 * @param {string} str - The raw comma-separated assigned string.
 * @returns {string[]} The individual names.
 */
function splitAssignedNames(str) {
  return (str || "").split(",").map((n) => n.trim()).filter(Boolean);
}

/**
 * Strips the given name from every task's `assigned` field and persists.
 * Compares full names (no substring match, so "Tom" never hits "Tom Müller").
 *
 * @param {string} userName - The name to remove from all assigned lists.
 * @returns {Promise<void>}
 */
async function removeUserFromAssignedTasks(userName) {
  for (let j = 0; j < tasks.length; j++) {
    const names = splitAssignedNames(tasks[j].assigned);
    const kept = names.filter((n) => n !== userName);
    if (kept.length === names.length) continue;
    tasks[j].assigned = kept.join(",");
    await editTask(tasks[j].id, tasks[j]);
  }
}

/**
 * Replaces a renamed user in every task's `assigned` field and persists.
 *
 * @param {string} oldName - The name as stored in the tasks so far.
 * @param {string} newName - The new name to write instead.
 * @returns {Promise<void>}
 */
async function renameUserInAssignedTasks(oldName, newName) {
  await loadTasks("/tasks");
  for (let j = 0; j < tasks.length; j++) {
    const names = splitAssignedNames(tasks[j].assigned);
    if (!names.includes(oldName)) continue;
    tasks[j].assigned = names.map((n) => (n === oldName ? newName : n)).join(",");
    await editTask(tasks[j].id, tasks[j]);
  }
}

/**
 * Updates user `id` from the edit form, persists to Firebase and mirrors a
 * name change into all tasks' assigned lists.
 *
 * @param {string} id - The Firebase id of the user to update.
 * @param {Object} [data={}] - The user payload to update, mutated with form values.
 * @returns {Promise<void>}
 */
async function editUser(id, data = {}) {
  const oldName = (data.name || "").trim();
  readEditUserForm(data);
  await fetch(FIREBASE_URL + `/users/${id}` + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (oldName && oldName !== data.name) await renameUserInAssignedTasks(oldName, data.name);
  await renderContacts();
  loadUserInformation(currentUser);
  closePopup();
}

/**
 * Reads the edit-user form fields into the given data object.
 *
 * @param {Object} data - The user payload to be enriched with form values.
 * @returns {void}
 */
function readEditUserForm(data) {
  data.name = document.getElementById("name").value.trim();
  data.email = document.getElementById("email").value.trim();
  data.phone = document.getElementById("phone").value.trim();
}

/**
 * Returns the id of the user with `email`, or -1 if not found.
 *
 * @param {string} email - The email address to look up.
 * @returns {string|number} The user id, or -1 if there are no users.
 */
function getUserId(email) {
  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email == email) return users[i].id;
    }
  } else {
    return -1;
  }
}
