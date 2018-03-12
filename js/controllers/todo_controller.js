application.register('todo', class extends Stimulus.Controller {
	static get targets() {
		return [ 'toggle', 'label', 'input' ]
	}

	connect() {
		this.labelTarget.textContent = this.element.dataset.value;
		if (this.element.hasAttribute('data-completed')) {
			this.element.classList.add('completed');
			this.toggleTarget.checked = true;
		}
	}

	toggle(event) {
		if (event.target.checked) {
			this.element.setAttribute('data-completed', '');
			this.element.classList.add('completed');
		} else {
			this.element.removeAttribute('data-completed');
			this.element.classList.remove('completed');
		}
		this.change();
	}

	edit() {
		this.inputTarget.value = this.element.dataset.value;
		this.element.classList.add('editing');
		this.inputTarget.focus();
	}

	update(event) {
		event.preventDefault();
		if (this.inputTarget.value != '') {
			this.element.dataset.value = this.inputTarget.value;
			this.labelTarget.textContent = this.inputTarget.value;
			this.element.classList.remove('editing');
			this.change();
		} else {
			this.destroy();
		}
	}

	keyup(event) {
		var ESC_KEY = 27;

		if (event.keyCode == ESC_KEY) {
			// Cancel edit
			this.inputTarget.value = this.element.dataset.value;
			this.element.classList.remove('editing');
		}
	}

	destroy() {
		this.element.parentNode.removeChild(this.element);
		this.change();
	}

	change() {
		var event = new Event('todo.change');
		this.element.dispatchEvent(event);
	}
})
