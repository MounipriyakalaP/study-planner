const form = document.getElementById("studyForm");
const table = document.getElementById("studyTable");

// Chart setup
const ctx = document.getElementById("studyChart").getContext("2d");
let subjects = [];
let hoursData = [];

let studyChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: subjects,
    datasets: [{
      label: "Study Hours",
      data: hoursData,
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } }
  }
});

// Add new study item
form.addEventListener("submit", function(e) {
  e.preventDefault();

  let subject = document.getElementById("subject").value;
  let time = parseFloat(document.getElementById("time").value);
  let unit = document.getElementById("unit").value;

  if (isNaN(time) || time <= 0) {
    alert("Please enter a valid time.");
    return;
  }

  // Convert everything into hours for the chart
  let hours;
  if (unit === "minutes") {
    hours = time / 60;
  } else {
    hours = time;
  }

  // Format display text for table
  let displayTime;
  if (unit === "minutes") {
    if (time < 60) {
      displayTime = `${time} min`;
    } else {
      let h = Math.floor(time / 60);
      let m = time % 60;
      displayTime = m === 0 ? `${h} hr` : `${h} hr ${m} min`;
    }
  } else {
    displayTime = time === 1 ? `${time} hr` : `${time} hrs`;
  }

  // Add to table
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);

  cell1.innerHTML = subject;
  cell2.innerHTML = displayTime;
  cell3.innerHTML = `<button onclick="deleteRow(this, '${subject}')">❌</button>`;

  // Add to chart
  subjects.push(subject);
  hoursData.push(hours);
  studyChart.update();

  form.reset();
});

// Delete study item
function deleteRow(btn, subjectName) {
  let row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);

  // Remove from chart data
  let index = subjects.indexOf(subjectName);
  if (index !== -1) {
    subjects.splice(index, 1);
    hoursData.splice(index, 1);
    studyChart.update();
  }
}
