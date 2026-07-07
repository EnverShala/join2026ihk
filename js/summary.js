/**
 * Loads tasks and calculates summary information (To Do, Done, Urgent, Total, In Progress, Awaiting Feedback).
 * Then, updates the summary information display and greets the user.
 */
async function loadSummaryInfos() {
  await loadTasks();

  let sumTodo = 0, sumDone = 0, sumUrgent = 0, sumTasks = 0, sumProgress = 0, sumFeedback = 0;

  for (let i = 0; i < tasks.length; i++) {
    sumTodo = tasks[i].level == "To do" ? sumTodo + 1 : sumTodo;
    sumDone = tasks[i].level == "Done" ? sumDone + 1 : sumDone;
    sumUrgent = tasks[i].priority == "Urgent" ? sumUrgent + 1 : sumUrgent;
    sumTasks = tasks.length;
    sumProgress = tasks[i].level == "In Progress" ? sumProgress + 1 : sumProgress;
    sumFeedback = tasks[i].level == "Awaiting Feedback" ? sumFeedback + 1 : sumFeedback;
  }

  updateSummaryInfos(sumTodo, sumDone, sumUrgent, sumTasks, sumProgress, sumFeedback);
  greetUser();
}

/**
 * Updates the summary information display with the provided values.
 *
 * @param {number} sumTodo The number of "To Do" tasks.
 * @param {number} sumDone The number of "Done" tasks.
 * @param {number} sumUrgent The number of "Urgent" tasks.
 * @param {number} sumTasks The total number of tasks.
 * @param {number} sumProgress The number of "In Progress" tasks.
 * @param {number} sumFeedback The number of "Awaiting Feedback" tasks.
 */
function updateSummaryInfos(sumTodo, sumDone, sumUrgent, sumTasks, sumProgress, sumFeedback) {
  document.getElementById("summary__todo").innerHTML = sumTodo;
  document.getElementById("summary__done").innerHTML = sumDone;
  document.getElementById("summary__urgent").innerHTML = sumUrgent;
  document.getElementById("summary__tasks").innerHTML = sumTasks;
  document.getElementById("summary__progress").innerHTML = sumProgress;
  document.getElementById("summary__feedback").innerHTML = sumFeedback;

  document.getElementById("summary__date").innerHTML = getUpcomingDeadline();
}

/**
 * Retrieves the upcoming deadline from urgent tasks.
 *
 * @returns {string} The upcoming deadline as a formatted date string, or an empty string if no urgent tasks are found.
 */
function getUpcomingDeadline() {
  let upcomingDeadline = "0";
  let allDates = [];
  let taskDate = "";

  for (let i = 0; i < tasks.length; i++) {    
    if (tasks[i].priority == "Urgent") {
      taskDate = taskDate = tasks[i].date.toString().replace("-", "");
      taskDate = taskDate.replace("-", "");

      allDates.push(taskDate);
    }
  }

  upcomingDeadline = Math.min(...allDates);

  upcomingDeadline = numberToDate(upcomingDeadline.toString());

  if(upcomingDeadline == 0 || allDates.length == 0) {
    return "";
  } else {
    return upcomingDeadline;
  }
}

/**
 * Formats a date represented as a number string (YYYYMMDD) into a human-readable date string.
 *
 * @param {string} numberDate The date as a number string (YYYYMMDD).
 * @returns {string} The formatted date string (e.g., "January 01, 2024"), or "Invalid Date" if the input is invalid.
 */
function numberToDate(numberDate) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return `${months[numberDate.slice(-4, -2) - 1]} ${numberDate.slice(-2)}, ${numberDate.slice(0, 4)}`;
}

/**
 * Sets the greeting message and displays the user's name (or "Guest") in the header.
 */
function greetUser() {
  const now = new Date();
  const hour = now.getHours();
  let greeting;

  let userName = localStorage.getItem("username");

  if (hour < 12) {
      greeting = "Good Morning,";
  } else if (hour < 18) {
      greeting = "Good Afternoon,";
  } else {
      greeting = "Good Evening,";
  }

  document.getElementById("greeting__text").innerText = greeting;

  if(userName) {
    document.getElementById("user__name").innerHTML = userName == "" ? "Guest" : userName;
  }
}

