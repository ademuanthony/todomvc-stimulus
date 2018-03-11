application.register('todos', class extends Stimulus.Controller {
	static get targets() {
		return [ 'newTodo', 'todoList', 'todoTemplate', 'filterAllButton', 'filterActiveButton', 'filterCompletedButton', 'counter', 'main', 'footer', 'clearCompletedButton', 'toggleAll']
	}

	connect() {
		this.load();
		this.filter();
		this.updateLayout();
		this.connectFilter();
	}

	connectFilter() {
		var _this = this
		window.onhashchange = function() {
			_this.filter();
		}
	}

	save() {
		var data = [];
		this.todoListTarget.querySelectorAll('li').forEach(function(li) {
			data.push({title: li.dataset.value, completed: li.hasAttribute('data-completed')})
		})
		localStorage.setItem('todos-stimulus', JSON.stringify(data));
	}

	load() {
		var data = JSON.parse(localStorage.getItem('todos-stimulus'));
		if (data) {
			var _this = this;
			data.forEach(function(todo) {
				_this.appendTodo(todo.title, todo.completed)
			})
		}
	}

	appendTodo(title, completed) {
		var todo = document.importNode(this.todoTemplateTarget.content, true);
		todo.querySelector('li').dataset.value = title
		if (completed) {
			todo.querySelector('li').setAttribute('data-completed', '')
		}
		this.todoListTarget.appendChild(todo);
	}

	updateLayout() {
		this.updateMain();
		this.updateFooter();
	}

	updateMain() {
		if (this.todoListTarget.querySelectorAll('li').length) {
			this.mainTarget.classList.remove('hidden');
		} else {
			this.mainTarget.classList.add('hidden');
		}
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

	createTodo(event) {
		event.preventDefault();

		if (this.newTodoTarget.value != '') {
			this.appendTodo(this.newTodoTarget.value, false);
			this.newTodoTarget.value = '';
			this.todoChange();
		}
	}

	todoChange(event) {
		this.updateLayout();
		this.save();
	}

	toggleAll() {
		if (this.toggleAllTarget.checked) {
			this.todoListTarget.querySelectorAll('[data-action="todo#toggle"]:not(:checked)').forEach(function(toggle) {
				toggle.checked = true;
				toggle.dispatchEvent(new Event('change'));
			})
		} else {
			this.todoListTarget.querySelectorAll('[data-action="todo#toggle"]').forEach(function(toggle) {
				toggle.checked = false;
				toggle.dispatchEvent(new Event('change'));
			})
		}
	}

	filter() {
		switch (window.location.hash) {
			case '#/active':
				this.filterActive();
				break;
			case '#/completed':
				this.filterCompleted();
				break;
			default:
				this.filterAll();
		}
	}

	filterAll() {
		this.todoListTarget.classList.remove('filter-active', 'filter-completed');
		this.updateFilterNavs('#/');
	}

	filterActive() {
		this.todoListTarget.classList.add('filter-active');
		this.todoListTarget.classList.remove('filter-completed');
		this.updateFilterNavs('#/active');
	}

	filterCompleted() {
		this.todoListTarget.classList.add('filter-completed');
		this.todoListTarget.classList.remove('filter-active');
		this.updateFilterNavs('#/completed');
	}

	updateFilterNavs(hash) {
		this.footerTarget.querySelectorAll('.filters a').forEach(function(a) {
			if (a.getAttribute('href') == hash) {
				a.classList.add('selected');
			} else {
				a.classList.remove('selected');
			}
		})
	}

	clearCompleted() {
		this.todoListTarget.querySelectorAll('li[data-completed]').forEach(function(li) {
			li.parentNode.removeChild(li);
		})
		this.todoChange();
	}
})
