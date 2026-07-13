/** Loads tasks, computes summary counts, updates UI, greets the user. */
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

/** Writes the summary counts and the upcoming deadline into the DOM. */
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

/** Returns the earliest date across urgent tasks (formatted), or "". */
function getUpcomingDeadline() {
  const dates = tasks
    .filter(t => t.priority == "Urgent")
    .map(t => t.date.toString().replaceAll("-", ""));
  if (dates.length == 0) return "";
  const formatted = numberToDate(Math.min(...dates).toString());
  return formatted == 0 ? "" : formatted;
}

/** Formats a YYYYMMDD string as "Month DD, YYYY". */
function numberToDate(numberDate) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return `${months[numberDate.slice(-4, -2) - 1]} ${numberDate.slice(-2)}, ${numberDate.slice(0, 4)}`;
}

/** Sets the header greeting text and user name (or "Guest"). */
function greetUser() {
  const greetingEl = document.getElementById("greeting__text");
  if (!greetingEl) return;
  const hour = new Date().getHours();
  greetingEl.innerText = hour < 12 ? "Good Morning," : hour < 18 ? "Good Afternoon," : "Good Evening,";
  const userName = localStorage.getItem("username");
  if (userName) document.getElementById("user__name").innerHTML = userName == "" ? "Guest" : userName;
}
