application.register('todos', class extends Stimulus.Controller {
	static get targets() {
		return [ 'newTodo', 'todoList', 'todoTemplate', 'filterAllButton', 'filterActiveButton', 'filterCompletedButton', 'counter', 'footer', 'clearCompletedButton']
	}

	connect() {
		this.updateFooter();
	}

	updateFooter() {
		if (this.todoListTarget.querySelectorAll('li').length) {
			this.footerTarget.classList.remove('hidden');
		} else {
			this.footerTarget.classList.add('hidden');
		}

		this.updateCounter();
		this.updateClearButton();
	}

	updateCounter() {
		var count = this.todoListTarget.querySelectorAll('li:not([data-completed])').length;
		var html = '<strong>' + count + '</strong>';
		if (count == 1) {
			html += ' item left';
		} else {
			html += ' items left';
		}
		this.counterTarget.innerHTML = html;
	}

	updateClearButton() {
		if (this.todoListTarget.querySelectorAll('li[data-completed]').length) {
			this.clearCompletedButtonTarget.classList.remove('hidden');
		} else {
			this.clearCompletedButtonTarget.classList.add('hidden');
		}
	}

	appendTodo(event) {
		event.preventDefault();

		var value = this.newTodoTarget.value;
		this.newTodoTarget.value = '';
		var todo = document.importNode(this.todoTemplateTarget.content, true);
		todo.querySelector('li').dataset.value = value
		this.todoListTarget.appendChild(todo);
		this.updateFooter();
	}

	todoChange(event) {
		this.updateFooter();
	}

	filterAll() {
		this.todoListTarget.classList.remove('filter-active', 'filter-completed');
		this.filterAllButtonTarget.classList.add('selected');
		this.filterActiveButtonTarget.classList.remove('selected');
		this.filterCompletedButtonTarget.classList.remove('selected');
	}

	filterActive() {
		this.todoListTarget.classList.add('filter-active');
		this.todoListTarget.classList.remove('filter-completed');
		this.filterAllButtonTarget.classList.remove('selected');
		this.filterActiveButtonTarget.classList.add('selected');
		this.filterCompletedButtonTarget.classList.remove('selected');
	}

	filterCompleted() {
		this.todoListTarget.classList.add('filter-completed');
		this.todoListTarget.classList.remove('filter-active');
		this.filterAllButtonTarget.classList.remove('selected');
		this.filterActiveButtonTarget.classList.remove('selected');
		this.filterCompletedButtonTarget.classList.add('selected');
	}

	clearCompleted() {
		this.todoListTarget.querySelectorAll('li[data-completed]').forEach(function(li) {
			li.parentNode.removeChild(li);
		})
	}
})
