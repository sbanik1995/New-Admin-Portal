// Common helper for authenticated API calls.
async function api(url, options = {}) {
  const response = await fetch(url, options);
  if (response.status === 401) {
    window.location.href = '/';
    return null;
  }
  return response;
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleString();
}

function renderList(listId, items) {
  const container = document.getElementById(listId);
  container.innerHTML = items.length ? items.join('') : '<li>No data found.</li>';
}

async function loadOverview() {
  const response = await api('/api/dashboard/overview');
  if (!response) return;
  const data = await response.json();

  const cards = [
    ['Total Tasks', data.totalTasks],
    ['Attendance Status', data.attendanceStatus],
    ['Pending Bugs', data.pendingBugs],
    ['Upcoming Meetings', data.upcomingMeetings],
  ];

  document.getElementById('overviewCards').innerHTML = cards
    .map(([label, value]) => `<article class="card"><h3>${label}</h3><p>${value}</p></article>`)
    .join('');
}

async function loadAttendance() {
  const response = await api('/api/attendance');
  if (!response) return;
  const data = await response.json();
  renderList(
    'attendanceList',
    data.map((item) => `<li><strong>${item.status}</strong> - ${formatDate(item.markedAt)}</li>`)
  );
}

document.getElementById('attendanceForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.getElementById('attendanceStatus').value;

  await api('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  event.target.reset();
  await loadAttendance();
  await loadOverview();
});

async function loadLeaves() {
  const response = await api('/api/leaves');
  if (!response) return;
  const data = await response.json();
  renderList(
    'leaveList',
    data.map(
      (leave) =>
        `<li><strong>${leave.leaveType}</strong> (${leave.status})<br/>${new Date(
          leave.startDate
        ).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</li>`
    )
  );
}

document.getElementById('leaveForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    leaveType: document.getElementById('leaveType').value,
    startDate: document.getElementById('leaveStartDate').value,
    endDate: document.getElementById('leaveEndDate').value,
    reason: document.getElementById('leaveReason').value,
  };

  await api('/api/leaves', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  event.target.reset();
  await loadLeaves();
});

async function loadMeetings() {
  const response = await api('/api/meetings/upcoming');
  if (!response) return;
  const data = await response.json();
  renderList(
    'meetingList',
    data.map(
      (meeting) =>
        `<li><strong>${meeting.title}</strong><br/>${new Date(meeting.date).toLocaleDateString()} ${meeting.time}<br/>${
          meeting.description || ''
        }</li>`
    )
  );
}

document.getElementById('meetingForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById('meetingTitle').value,
    date: document.getElementById('meetingDate').value,
    time: document.getElementById('meetingTime').value,
    description: document.getElementById('meetingDescription').value,
  };

  await api('/api/meetings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  event.target.reset();
  await loadMeetings();
  await loadOverview();
});

async function loadTasks() {
  const response = await api('/api/tasks');
  if (!response) return;
  const data = await response.json();
  renderList(
    'taskList',
    data.map(
      (task) => `<li>
      <strong>${task.title}</strong> (${task.status})<br/>${task.description || ''}
      <div class="inline-actions">
        <button onclick="updateTaskStatus('${task._id}')">Toggle Status</button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    </li>`
    )
  );
}

// We support simple status toggle to keep task operations quick.
window.updateTaskStatus = async (id) => {
  const allTasksResponse = await api('/api/tasks');
  if (!allTasksResponse) return;

  const tasks = await allTasksResponse.json();
  const task = tasks.find((entry) => entry._id === id);
  if (!task) return;

  const sequence = ['Pending', 'In Progress', 'Completed'];
  const nextStatus = sequence[(sequence.indexOf(task.status) + 1) % sequence.length];

  await api(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: nextStatus }),
  });

  await loadTasks();
  await loadOverview();
};

window.deleteTask = async (id) => {
  await api(`/api/tasks/${id}`, { method: 'DELETE' });
  await loadTasks();
  await loadOverview();
};

document.getElementById('taskForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    status: document.getElementById('taskStatus').value,
  };

  await api('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  event.target.reset();
  await loadTasks();
  await loadOverview();
});

async function loadReports() {
  const response = await api('/api/test-reports');
  if (!response) return;
  const data = await response.json();
  renderList(
    'reportList',
    data.map(
      (report) =>
        `<li><strong>${report.title}</strong> (${new Date(report.reportDate).toLocaleDateString()})<br/>${
          report.description || ''
        }<br/><a href="${report.filePath}" target="_blank">${report.originalFileName}</a></li>`
    )
  );
}

document.getElementById('reportForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('reportTitle').value);
  formData.append('reportDate', document.getElementById('reportDate').value);
  formData.append('description', document.getElementById('reportDescription').value);
  formData.append('file', document.getElementById('reportFile').files[0]);

  await api('/api/test-reports', {
    method: 'POST',
    body: formData,
  });

  event.target.reset();
  await loadReports();
});

async function loadDocuments() {
  const response = await api('/api/project-documents');
  if (!response) return;
  const data = await response.json();
  renderList(
    'documentList',
    data.map(
      (document) =>
        `<li><strong>${document.title}</strong><br/>${document.description || ''}<br/><a href="${
          document.filePath
        }" target="_blank">${document.originalFileName}</a></li>`
    )
  );
}

document.getElementById('documentForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('documentTitle').value);
  formData.append('description', document.getElementById('documentDescription').value);
  formData.append('file', document.getElementById('documentFile').files[0]);

  await api('/api/project-documents', {
    method: 'POST',
    body: formData,
  });

  event.target.reset();
  await loadDocuments();
});

async function loadBugs() {
  const response = await api('/api/bugs');
  if (!response) return;
  const data = await response.json();
  renderList(
    'bugList',
    data.map(
      (bug) =>
        `<li><strong>${bug.title}</strong> [${bug.severity}] - ${bug.status}<br/>${bug.description}<br/>${
          bug.screenshotPath
            ? `<a href="${bug.screenshotPath}" target="_blank">${bug.screenshotOriginalName}</a>`
            : 'No screenshot'
        }</li>`
    )
  );
}

document.getElementById('bugForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('bugTitle').value);
  formData.append('description', document.getElementById('bugDescription').value);
  formData.append('severity', document.getElementById('bugSeverity').value);
  formData.append('status', document.getElementById('bugStatus').value);

  const screenshotFile = document.getElementById('bugScreenshot').files[0];
  if (screenshotFile) {
    formData.append('screenshot', screenshotFile);
  }

  await api('/api/bugs', {
    method: 'POST',
    body: formData,
  });

  event.target.reset();
  await loadBugs();
  await loadOverview();
});

async function init() {
  const me = await fetch('/api/auth/me');
  if (me.status !== 200) {
    window.location.href = '/';
    return;
  }

  await Promise.all([
    loadOverview(),
    loadAttendance(),
    loadLeaves(),
    loadMeetings(),
    loadTasks(),
    loadReports(),
    loadDocuments(),
    loadBugs(),
  ]);
}

document.querySelectorAll('.nav-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
    document.querySelectorAll('.section').forEach((section) => section.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.section).classList.add('active');
  });
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
});

init();
