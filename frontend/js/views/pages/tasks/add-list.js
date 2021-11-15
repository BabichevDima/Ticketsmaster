import Component from '../../../views/component.js';

import Tasks from '../../../models/tasks.js';

class AddAndList extends Component {
  constructor() {
    super();

    this.model = new Tasks();
  }

  getData() {
    return new Promise((resolve) =>
      this.model.getTasksList().then((tasks) => resolve(tasks))
    );
  }

  render(tasks) {
    return new Promise((resolve) => {
      resolve(`
        <div class='container'>
			  	<h1 class="page-title">Список концертов</h1>
      
			  	<div class="concerts">
			  		<div class="concerts__list">
			  			${tasks.map((task) => this.getTaskHTML(task)).join('\n ')}
			  		</div>
			  	</div>
        </div>
			`);
    });
  }

  afterRender() {
    this.setActions();

    // this.countTasksAmount();
  }

  setActions() {
    const concertsContainer = document.querySelector('.concerts__list');

    concertsContainer.addEventListener('click', (event) => {
      const target = event.target;
      const targetClassList = target.classList;

      switch (true) {
        case targetClassList.contains('concert__avatar'):
          this.redirectToTaskInfo(target.dataset.id);
          break;
      }
    });
  }

  getTaskHTML(task) {
    const statusDone = task.status === 'Done';

    return `
      <div class="concert">

        <img class="concert__avatar" src="${task.image}" alt="photo" data-id='${task.id}'/>

        <div class="concert__description">
          <div class="concert__info">
            <div>${task.title}</div>
            <div class="concert__title">
            <span>&#128197</span>
            ${task.data}</div>
          </div>
          
          <div class="concert__text">
          ${task.description}
          </div>
        </div>

      </div>
    `;
  }

  // clearAddTask(addTaskTitle, addTaskDescription, addTaskBtn) {
  //   addTaskTitle.value = '';
  //   addTaskDescription.value = '';
  //   addTaskBtn.disabled = true;
  // }

  // countTasksAmount() {
  //   const tasksCounter = document.getElementsByClassName('tasks__counter')[0],
  //     totalAmount = document.getElementsByClassName('task').length,
  //     doneAmount = document.getElementsByClassName('task_done').length,
  //     toBeVerbForm = doneAmount === 1 ? 'is' : 'are',
  //     taskWordForm = doneAmount === 1 ? 'task' : 'tasks';

  //   tasksCounter.innerHTML = !totalAmount
  //     ? 'Tasks list is empty'
  //     : `There ${toBeVerbForm} <span class="tasks__counter-done">${doneAmount}</span> ${taskWordForm} of <span class="tasks__counter-total">${totalAmount}</span> ${toBeVerbForm} done`;
  // }

  // clearTasksList(tasksList, clearTasksListBtn) {
  //   this.model.removeTask('all').then(() => {
  //     if (confirm('Are you sure?')) {
  //       clearTasksListBtn.disabled = true;
  //       tasksList.innerHTML = '';

  //       this.countTasksAmount();
  //     }
  //   });
  // }

  redirectToTaskInfo(id) {
    location.hash = `#/concert/${id}`;
  }

  // changeTaskStatus(taskContainer, editTaskBtn, doneTaskBtn) {
  //   this.model.editStatusTask(taskContainer.dataset.id).then(() => {
  //     taskContainer.classList.add('task_done');
  //     editTaskBtn.remove();
  //     doneTaskBtn.remove();

  //     this.countTasksAmount();
  //   });
  // }

  // removeTask(tasksList, taskContainer, clearTasksListBtn) {
  //   this.model.removeTask(taskContainer.dataset.id).then(() => {
  //     if (confirm('Are you sure?')) {
  //       taskContainer.remove();
  //       !tasksList.children.length && (clearTasksListBtn.disabled = true);

  //       this.countTasksAmount();
  //     }
  //   });
  // }
}

export default AddAndList;
