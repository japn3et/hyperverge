
let timer;
let timeLeft;
let isRunning = false;

function toggleMenu() {
  document.getElementById('sidebar').classList.toggle('expanded');
}

function toggleItem(toggle) {
  toggle.classList.toggle('active');
  toggle.parentElement.classList.toggle('enabled', toggle.classList.contains('active'));

  const widgetId = toggle.dataset.widget;
  if (widgetId) {
    const widget = document.getElementById(widgetId);
    if (widget) {
      widget.style.display = toggle.classList.contains('active') ? 'block' : 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.menu-toggle').addEventListener('click', toggleMenu);
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => toggleItem(toggle));
  });
});


function updateTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = hours + ':' + strMinutes + ' ' + ampm;
  document.getElementById('time').textContent = timeString;


  const day = now.getDate();
  const month = now.getMonth() + 1; 
  const year = now.getFullYear();
  const dateString = day + '/' + (month < 10 ? '0' + month : month) + '/' + year;
  document.getElementById('date').textContent = dateString;

  const greeting = getGreeting(hours, ampm);
  document.getElementById('greeting').textContent = greeting;
}

function getGreeting(hours, ampm) {
  if (ampm === 'AM') {
    return hours < 12 ? 'Good Morning!' : 'Good Afternoon!';
  } else {
    return hours < 6 ? 'Good Afternoon!' : 'Good Evening!';
  }
}

function setTimer(minutes) {
  clearInterval(timer);
  timeLeft = minutes * 60;
  updateDisplay();
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timerDisplay').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      playBeep(3); 
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

function playBeep(times) {
  if (times <= 0) return;
  const beep = new AudioContext();
  const oscillator = beep.createOscillator();
  const gainNode = beep.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(beep.destination);
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1000, beep.currentTime);
  oscillator.start();
  oscillator.stop(beep.currentTime + 0.2);
  setTimeout(() => playBeep(times - 1), 300);
}

setInterval(updateTime, 1000); 
updateTime(); 
function resetTIL() {
  localStorage.removeItem('tilList');
  renderTIL();
}

function resetTIL() {
  localStorage.removeItem('tilList');
  renderTIL();
}

function addTIL() {
  const tilInput = document.getElementById('tilInput');
  const tilText = tilInput.value.trim();
  if (tilText) {
    const listItem = document.createElement('li');
    listItem.className = 'til-list-item';

    const textNode = document.createTextNode(tilText);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
      listItem.remove();
      saveTIL(); 
    };

    listItem.appendChild(textNode);
    listItem.appendChild(deleteButton);
    document.getElementById('tilList').appendChild(listItem);

    saveTIL(tilText);
    tilInput.value = ''; 
  }
}

function saveTIL() {
  const tilList = Array.from(document.querySelectorAll('#tilList li'))
    .map(item => item.firstChild.textContent);
  localStorage.setItem('tilList', JSON.stringify(tilList));
}

function renderTIL() {
  const tilList = JSON.parse(localStorage.getItem('tilList')) || [];
  const tilListElement = document.getElementById('tilList');
  tilListElement.innerHTML = '';
  tilList.forEach(til => {
    const listItem = document.createElement('li');
    listItem.className = 'til-list-item';

    const textNode = document.createTextNode(til);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
      listItem.remove();
      saveTIL(); 
    };

    listItem.appendChild(textNode);
    listItem.appendChild(deleteButton);
    tilListElement.appendChild(listItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addTil').addEventListener('click', addTIL);
  renderTIL();

  const now = new Date();
  const timeToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => {
    resetTIL();
    setInterval(resetTIL, 24 * 60 * 60 * 1000);
  }, timeToMidnight);
});

function initIssueTrackerWidget() {
const issueTrackerWidget = document.getElementById('issue-tracker-widget');
const scriptUrl = 'https://script.google.com/macros/s/AKfycbxfQ-9YVp8cAMrPA-D-nTMpdouRJJlXC3s7xrRDdTd2ABDFWiNY-ivX16YesdtA7NuBfg/exec'; 


document.getElementById('issue-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('issue-title').value;
  const description = document.getElementById('issue-description').value;
  const priority = document.getElementById('issue-priority').value;

  fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify({title, description, priority})
  })
  .then(response => response.json())
  .then(data => {
      if (data.result === 'success') {
          document.getElementById('issue-status').textContent = 'Issue submitted successfully!';
          document.getElementById('issue-form').reset();
      } else {
          document.getElementById('issue-status').textContent = 'Error submitting issue. Please try again.';
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('issue-status').textContent = 'Error submitting issue. Please try again.';
  });
});
}
document.addEventListener('DOMContentLoaded', () => {
initIssueTrackerWidget();
});
