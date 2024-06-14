document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  addTask();
});

function addTask() {
  const taskName = document.getElementById('taskName').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const responsible = document.getElementById('responsible').value;

  if (new Date(startDate) > new Date(endDate)) {
    alert('La fecha de fin no puede ser menor que la fecha de inicio.');
    return;
  }

  const task = {
    taskName,
    startDate,
    endDate,
    responsible,
    resolved: false
  };

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
  document.getElementById('taskForm').reset();
}

function loadTasks() {
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task, index) => {
    const now = new Date().toISOString().split('T')[0];
    const isOverdue = new Date(task.endDate) < new Date(now);

    const taskItem = document.createElement('li');
    taskItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    
    if (isOverdue) {
      taskItem.classList.add('list-group-item-overdue');
    } else if (task.resolved) {
      taskItem.classList.add('list-group-item-resolved');
    } else {
      taskItem.classList.add('list-group-item-pending');
    }

    taskItem.innerHTML = `
      <div>
        <h5 class="${task.resolved ? 'completed-task' : ''}">${task.taskName}</h5>
        <p>Inicio: ${task.startDate} | Fin: ${task.endDate} | Responsable: ${task.responsible}</p>
      </div>
      <div>
        ${!isOverdue ? `<button class="btn btn-success btn-sm" onclick="toggleResolve(${index})">
          ${task.resolved ? 'Desmarcar' : 'Marcar como resuelta'}
        </button>` : ''}
        <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Eliminar</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

function toggleResolve(index) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].resolved = !tasks[index].resolved;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  if (confirm('¿Estás seguro de eliminar esta tarea?')) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
}
