async function getTask() {
    document.getElementById('response').innerHTML = `
        <span id="loader" class="fas fa-spinner fa-spin"></span>
    `;
  
    let data = await fetch('https://api.todoist.com/rest/v2/tasks?project_id=2329941246&search=', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer 59340b3400d6a7225a000a2d21ab92fa25411994'
      },
    });
  
    let output = await data.json();
    console.log(output)
    const markupArray = output.map((task, index) => `
          <div class="task-box" id="task-${task.id}">
              <span>${task.content}</span> &nbsp;
              <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i></button>
              ${task.due ? `<span id="due_date">due_date:${task.due.date}</span>` : ''}
              <button class="edit-btn" onclick="showEditTaskForm(${task.id}, '${task.content}', '${task.due ? task.due.date : ''}')"><i class="fas fa-edit"></i></button>
          </div>
      `);
  
    document.getElementById('response').innerHTML = markupArray.join('');
  }
  
  document.getElementById('searchInput').addEventListener('input', function() {
    const searchText = this.value.toLowerCase();
    const taskBoxes = document.querySelectorAll('.task-box');
  
    taskBoxes.forEach(function(taskBox) {
      const taskContent = taskBox.querySelector('span').textContent.toLowerCase();
      const dueDate = taskBox.querySelector('#due_date');
  
      if (taskContent.includes(searchText) || (dueDate && dueDate.textContent.toLowerCase().includes(searchText))) {
        taskBox.style.display = 'block';
      } else {
        taskBox.style.display = 'none';
      }
    });
  });
  
  
  
  function showEditTaskForm(taskId, currentContent, currentDueDate) {
    const taskBox = document.querySelector(`#task-${taskId}`);
    taskBox.innerHTML = `
      <input type="text" id="edit-content-${taskId}" value="${currentContent}" />
      <input type="date" id="edit-due-${taskId}" value="${currentDueDate}" />
      <button onclick="saveEdit(${taskId})">Save</button>
    `;
  }
  
  async function saveEdit(taskId) {
  
    const updatedContent = document.querySelector(`#edit-content-${taskId}`).value;
    const updatedDueDate = document.querySelector(`#edit-due-${taskId}`).value;
  
    await updateTask(taskId, { content: updatedContent, due_date: updatedDueDate });
  }
  
  
  async function postTask() {
    const taskInput = document.getElementById('taskInput').value;
    const due_date = document.getElementById('due_date').value;
  
  
  
  
  
    document.getElementById('addTaskBtn').disabled = true;
  
    await fetch('https://api.todoist.com/rest/v2/tasks', {
      method: 'POST',
      body: JSON.stringify({
        content: taskInput,
        due_date: due_date,
        project_id: 2329941246,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer 59340b3400d6a7225a000a2d21ab92fa25411994'
      },
    });
  
    document.getElementById('addTaskBtn').disabled = false;
  
    getTask();
  }
  
  async function deleteTask(taskId) {
    await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer 59340b3400d6a7225a000a2d21ab92fa25411994'
      },
    });
  
    getTask();
  }
  getTask(); 
  async function updateTask(taskId, updatedTask) {
    console.log(updatedTask)
    await fetch(`https://api.todoist.com/rest/v2/tasks/${taskId}`, {
      method: 'POST',
      body: JSON.stringify(updatedTask),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer 59340b3400d6a7225a000a2d21ab92fa25411994'
      },
    });
  
    getTask();
  }
  
  