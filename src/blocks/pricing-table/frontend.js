/**
 * Frontend JavaScript for pricing table toggle functionality
 */

document.addEventListener('DOMContentLoaded', function() {
	// Handle pricing toggle functionality
	const toggleContainers = document.querySelectorAll('[data-toggle-pricing]');
	
	toggleContainers.forEach(container => {
		const buttons = container.querySelectorAll('button[data-period]');
		const pricingTable = container.closest('.wp-block-tailwind-starter-pricing-table');
		
		buttons.forEach(button => {
			button.addEventListener('click', function() {
				const period = this.getAttribute('data-period');
				
				// Update button states
				buttons.forEach(btn => {
					btn.classList.remove('bg-white', 'text-blue-600', 'shadow');
					btn.classList.add('text-gray-600');
				});
				
				this.classList.add('bg-white', 'text-blue-600', 'shadow');
				this.classList.remove('text-gray-600');
				
				// Update pricing display
				const priceElements = pricingTable.querySelectorAll('[data-monthly-price][data-annual-price]');
				const periodElements = pricingTable.querySelectorAll('[data-monthly-period][data-annual-period]');
				
				priceElements.forEach(priceEl => {
					const monthlyPrice = priceEl.getAttribute('data-monthly-price');
					const annualPrice = priceEl.getAttribute('data-annual-price');
					
					priceEl.textContent = period === 'annual' ? annualPrice : monthlyPrice;
				});
				
				periodElements.forEach(periodEl => {
					const monthlyPeriod = periodEl.getAttribute('data-monthly-period');
					const annualPeriod = periodEl.getAttribute('data-annual-period');
					
					periodEl.textContent = period === 'annual' ? annualPeriod : monthlyPeriod;
				});
			});
		});
	});
});