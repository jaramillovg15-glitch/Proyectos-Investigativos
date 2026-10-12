document.addEventListener('DOMContentLoaded', function() {
	const searchForm = document.querySelector('.search-form');
	if (searchForm) {
		searchForm.addEventListener('submit', function(event) {
			event.preventDefault();
			const query = this.querySelector('input').value.trim();
			if (query) {
				alert(`Buscando camisetas para: ${query}`);
			}
		});
	}

	const addButtons = document.querySelectorAll('[data-add-cart]');
	addButtons.forEach(function(button) {
		button.addEventListener('click', function(event) {
			event.preventDefault();
			const productName = this.dataset.addCart;
			alert(`"${productName}" se agregó al carrito.`);
		});
	});
});