const SUMMARY_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Lädt Tasks, berechnet die Summary-Kennzahlen, aktualisiert das UI und begrüßt den User.
 *
 * @returns {Promise<void>} Aufgelöst, sobald Tasks geladen und Kennzahlen gerendert sind.
 */
async function loadSummaryInfos() {
  await loadTasks();
  const c = (fn) => tasks.filter(fn).length;
  updateSummaryInfos(
    c(t => t.level == "To do"), c(t => t.level == "Done"),
    c(t => t.priority == "Urgent"), tasks.length,
    c(t => t.level == "In Progress"), c(t => t.level == "Awaiting Feedback")
  );
  greetUser();
}

/**
 * Schreibt die Summary-Kennzahlen und den kommenden Deadline-Termin ins DOM.
 *
 * @param {number} sumTodo - Anzahl der To-do-Tasks.
 * @param {number} sumDone - Anzahl der erledigten Tasks.
 * @param {number} sumUrgent - Anzahl der dringenden Tasks.
 * @param {number} sumTasks - Gesamtanzahl aller Tasks.
 * @param {number} sumProgress - Anzahl der Tasks in Bearbeitung.
 * @param {number} sumFeedback - Anzahl der Tasks im Feedback-Status.
 */
function updateSummaryInfos(sumTodo, sumDone, sumUrgent, sumTasks, sumProgress, sumFeedback) {
  if (!document.getElementById("summary__todo")) return;
  document.getElementById("summary__todo").innerHTML = sumTodo;
  document.getElementById("summary__done").innerHTML = sumDone;
  document.getElementById("summary__urgent").innerHTML = sumUrgent;
  document.getElementById("summary__tasks").innerHTML = sumTasks;
  document.getElementById("summary__progress").innerHTML = sumProgress;
  document.getElementById("summary__feedback").innerHTML = sumFeedback;
  document.getElementById("summary__date").innerHTML = getUpcomingDeadline();
}

/**
 * Liefert das früheste Datum aller dringenden Tasks im Format "Month DD, YYYY".
 *
 * @returns {string} Das formatierte Datum oder ein leerer String.
 */
function getUpcomingDeadline() {
  const dates = tasks
    .filter(t => t.priority == "Urgent")
    .map(t => t.date.toString().replaceAll("-", ""));
  if (dates.length == 0) return "";
  const formatted = numberToDate(Math.min(...dates).toString());
  return formatted == 0 ? "" : formatted;
}

/**
 * Formatiert einen YYYYMMDD-String als "Monat TT, JJJJ".
 *
 * @param {string} numberDate - Datum im Format YYYYMMDD.
 * @returns {string} Das formatierte Datum.
 */
function numberToDate(numberDate) {
  const month = SUMMARY_MONTHS[numberDate.slice(-4, -2) - 1];
  return `${month} ${numberDate.slice(-2)}, ${numberDate.slice(0, 4)}`;
}

/**
 * Liefert den passenden Begrüßungstext abhängig von der Tageszeit.
 *
 * @param {number} hour - Die aktuelle Stunde (0-23).
 * @returns {string} Der Begrüßungstext inklusive Komma.
 */
function _getGreetingByHour(hour) {
  if (hour < 12) return "Good Morning,";
  if (hour < 18) return "Good Afternoon,";
  return "Good Evening,";
}

/**
 * Setzt den Begrüßungstext und den User-Namen (oder "Guest") im Header.
 */
function greetUser() {
  const greetingEl = document.getElementById("greeting__text");
  if (!greetingEl) return;
  greetingEl.innerText = _getGreetingByHour(new Date().getHours());
  const userName = localStorage.getItem("username");
  if (userName) document.getElementById("user__name").innerHTML = userName == "" ? "Guest" : userName;
}
