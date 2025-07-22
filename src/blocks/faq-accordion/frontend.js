/**
 * FAQ Accordion Block Frontend JavaScript
 * Handles accordion interactions, search functionality, and keyboard navigation
 */

document.addEventListener('DOMContentLoaded', function() {
	// Initialize all FAQ accordion blocks
	const faqBlocks = document.querySelectorAll('.wp-block-tailwind-starter-faq-accordion');
	
	faqBlocks.forEach(initFaqBlock);
});

function initFaqBlock(block) {
	const allowMultiple = block.dataset.allowMultiple === 'true';
	const animationSpeed = block.dataset.animationSpeed || 'medium';
	
	// Initialize accordion functionality
	initAccordion(block, allowMultiple);
	
	// Initialize search functionality
	const searchInput = block.querySelector('[data-faq-search]');
	if (searchInput) {
		initSearch(block, searchInput);
	}
	
	// Initialize keyboard navigation
	initKeyboardNavigation(block);
}

function initAccordion(block, allowMultiple) {
	const toggleButtons = block.querySelectorAll('[data-faq-toggle]');
	
	toggleButtons.forEach(button => {
		button.addEventListener('click', function() {
			const faqItem = this.closest('.faq-item');
			const isOpen = faqItem.classList.contains('faq-open');
			
			if (!allowMultiple) {
				// Close all other FAQs
				const allItems = block.querySelectorAll('.faq-item');
				allItems.forEach(item => {
					if (item !== faqItem) {
						closeFaqItem(item);
					}
				});
			}
			
			// Toggle current FAQ
			if (isOpen) {
				closeFaqItem(faqItem);
			} else {
				openFaqItem(faqItem);
			}
		});
		
		// Add keyboard support
		button.addEventListener('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.click();
			}
		});
	});
}

function openFaqItem(faqItem) {
	const answer = faqItem.querySelector('.faq-answer');
	const toggle = faqItem.querySelector('.faq-toggle');
	const button = faqItem.querySelector('[data-faq-toggle]');
	
	faqItem.classList.add('faq-open');
	
	if (answer) {
		answer.style.maxHeight = answer.scrollHeight + 'px';
		answer.classList.remove('max-h-0', 'opacity-0');
		answer.classList.add('max-h-screen', 'opacity-100');
		answer.setAttribute('aria-hidden', 'false');
	}
	
	if (toggle) {
		toggle.style.transform = 'rotate(180deg)';
	}
	
	if (button) {
		button.setAttribute('aria-expanded', 'true');
	}
	
	// Smooth scroll to question if it's out of view
	setTimeout(() => {
		const rect = faqItem.getBoundingClientRect();
		const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;
		
		if (!isVisible) {
			faqItem.scrollIntoView({ 
				behavior: 'smooth', 
				block: 'start' 
			});
		}
	}, 100);
}

function closeFaqItem(faqItem) {
	const answer = faqItem.querySelector('.faq-answer');
	const toggle = faqItem.querySelector('.faq-toggle');
	const button = faqItem.querySelector('[data-faq-toggle]');
	
	faqItem.classList.remove('faq-open');
	
	if (answer) {
		answer.style.maxHeight = '0px';
		answer.classList.add('max-h-0', 'opacity-0');
		answer.classList.remove('max-h-screen', 'opacity-100');
		answer.setAttribute('aria-hidden', 'true');
	}
	
	if (toggle) {
		toggle.style.transform = 'rotate(0deg)';
	}
	
	if (button) {
		button.setAttribute('aria-expanded', 'false');
	}
}

function initSearch(block, searchInput) {
	const faqItems = block.querySelectorAll('.faq-item');
	const categories = block.querySelectorAll('.faq-category');
	const emptyState = block.querySelector('.faq-empty-state');
	const faqContent = block.querySelector('.faq-content');
	
	// Debounce search function
	let searchTimeout;
	
	searchInput.addEventListener('input', function() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			performSearch(this.value.toLowerCase(), faqItems, categories, emptyState, faqContent);
		}, 150);
	});
	
	// Clear search on escape
	searchInput.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			this.value = '';
			performSearch('', faqItems, categories, emptyState, faqContent);
			this.blur();
		}
	});
}

function performSearch(searchTerm, faqItems, categories, emptyState, faqContent) {
	let visibleCount = 0;
	
	faqItems.forEach(item => {
		const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
		const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
		const matches = question.includes(searchTerm) || answer.includes(searchTerm);
		
		if (matches || searchTerm === '') {
			item.style.display = '';
			visibleCount++;
			
			// Highlight search terms
			if (searchTerm !== '') {
				highlightSearchTerms(item, searchTerm);
			} else {
				removeHighlights(item);
			}
		} else {
			item.style.display = 'none';
			// Close item if it's open and hidden
			if (item.classList.contains('faq-open')) {
				closeFaqItem(item);
			}
		}
	});
	
	// Handle category visibility
	categories.forEach(category => {
		const visibleItems = category.querySelectorAll('.faq-item:not([style*="display: none"])');
		category.style.display = visibleItems.length > 0 ? '' : 'none';
	});
	
	// Show/hide empty state
	if (emptyState && faqContent) {
		if (visibleCount === 0 && searchTerm !== '') {
			emptyState.classList.remove('hidden');
			faqContent.classList.add('hidden');
		} else {
			emptyState.classList.add('hidden');
			faqContent.classList.remove('hidden');
		}
	}
}

function highlightSearchTerms(item, searchTerm) {
	const questionElement = item.querySelector('.faq-question h4');
	const answerElement = item.querySelector('.faq-answer');
	
	if (questionElement && !questionElement.dataset.originalText) {
		questionElement.dataset.originalText = questionElement.textContent;
	}
	
	if (answerElement && !answerElement.dataset.originalText) {
		answerElement.dataset.originalText = answerElement.textContent;
	}
	
	if (questionElement) {
		const highlightedQuestion = highlightText(questionElement.dataset.originalText, searchTerm);
		questionElement.innerHTML = highlightedQuestion;
	}
	
	if (answerElement) {
		const highlightedAnswer = highlightText(answerElement.dataset.originalText, searchTerm);
		answerElement.innerHTML = highlightedAnswer;
	}
}

function removeHighlights(item) {
	const questionElement = item.querySelector('.faq-question h4');
	const answerElement = item.querySelector('.faq-answer');
	
	if (questionElement && questionElement.dataset.originalText) {
		questionElement.textContent = questionElement.dataset.originalText;
	}
	
	if (answerElement && answerElement.dataset.originalText) {
		answerElement.textContent = answerElement.dataset.originalText;
	}
}

function highlightText(text, searchTerm) {
	if (!searchTerm) return text;
	
	const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
	return text.replace(regex, '<mark style="background-color: #fef08a; color: #854d0e; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function initKeyboardNavigation(block) {
	const toggleButtons = block.querySelectorAll('[data-faq-toggle]');
	
	toggleButtons.forEach((button, index) => {
		button.addEventListener('keydown', function(e) {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					const nextButton = toggleButtons[index + 1];
					if (nextButton) {
						nextButton.focus();
					}
					break;
					
				case 'ArrowUp':
					e.preventDefault();
					const prevButton = toggleButtons[index - 1];
					if (prevButton) {
						prevButton.focus();
					}
					break;
					
				case 'Home':
					e.preventDefault();
					toggleButtons[0].focus();
					break;
					
				case 'End':
					e.preventDefault();
					toggleButtons[toggleButtons.length - 1].focus();
					break;
			}
		});
	});
}

// Utility function to handle FAQ state changes from external sources
window.faqAccordionAPI = {
	openFaq: function(blockElement, faqId) {
		const faqItem = blockElement.querySelector(`[data-faq-id="${faqId}"]`);
		if (faqItem) {
			openFaqItem(faqItem);
		}
	},
	
	closeFaq: function(blockElement, faqId) {
		const faqItem = blockElement.querySelector(`[data-faq-id="${faqId}"]`);
		if (faqItem) {
			closeFaqItem(faqItem);
		}
	},
	
	searchFaqs: function(blockElement, searchTerm) {
		const searchInput = blockElement.querySelector('[data-faq-search]');
		if (searchInput) {
			searchInput.value = searchTerm;
			searchInput.dispatchEvent(new Event('input'));
		}
	}
}; 