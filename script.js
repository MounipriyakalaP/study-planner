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

// ✅ Suggestions function
function updateSuggestions() {
  let totalHours = hoursData.reduce((a, b) => a + b, 0);
  let suggestionBox = document.getElementById("suggestions");

  if (totalHours === 0) {
    suggestionBox.innerHTML = "No data yet. Start adding your study time!";
    suggestionBox.style.color = "gray";
    return;
  }

  if (totalHours < 2) {
    suggestionBox.innerHTML = "📖 Good start! Even 30 minutes daily makes a difference.";
    suggestionBox.style.color = "green";
  } else if (totalHours < 5) {
    suggestionBox.innerHTML = "👏 Nice! You're building consistency.";
    suggestionBox.style.color = "orange";
  } else if (totalHours < 10) {
    suggestionBox.innerHTML = "💡 Great job! Keep revising weak areas too.";
    suggestionBox.style.color = "blue";
  } else {
    suggestionBox.innerHTML = "🏆 Excellent! You're putting in solid effort, don’t forget breaks.";
    suggestionBox.style.color = "green";
  }
}


// ✅ Add new study item
form.addEventListener("submit", function(e) {
  e.preventDefault();

  let subject = document.getElementById("subject").value.trim();
  let time = parseFloat(document.getElementById("time").value);
  let unit = document.getElementById("unit").value;

  if (!subject || isNaN(time) || time <= 0) {
    alert("Please enter valid subject and study time.");
    return;
  }

  // Convert everything into hours
  let hours = (unit === "minutes") ? time / 60 : time;

  // Format display time
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

  // ✅ Check if subject already exists
  let index = subjects.indexOf(subject);
  if (index !== -1) {
    // Update existing subject in chart
    hoursData[index] = hours;

    // Update table row (find by looping instead of index math)
    for (let i = 1; i < table.rows.length; i++) { // row[0] is header
      if (table.rows[i].cells[0].innerHTML === subject) {
        table.rows[i].cells[1].innerHTML = displayTime;
      }
    }
  } else {
    // Add new subject
    subjects.push(subject);
    hoursData.push(hours);

    // Add row to table
    let row = table.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = subject;
    cell2.innerHTML = displayTime;
    cell3.innerHTML = `<button onclick="deleteRow(this, '${subject}')">❌</button>`;
  }

  // Update chart + suggestions
  studyChart.update();
  updateSuggestions();

  form.reset();
});

// ✅ Delete study item
function deleteRow(btn, subjectName) {
  let row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);

  // Remove from chart data
  let index = subjects.indexOf(subjectName);
  if (index !== -1) {
    subjects.splice(index, 1);
    hoursData.splice(index, 1);
    studyChart.update();
    updateSuggestions();
  }
}