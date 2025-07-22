/**
 * Frontend JavaScript for social proof carousel functionality
 * Uses Swiper.js for testimonial carousel
 */

import { Swiper, Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', function() {
	// Initialize Swiper carousels
	const carousels = document.querySelectorAll('.social-testimonial-carousel .swiper');
	
	carousels.forEach(carousel => {
		const autoplay = carousel.getAttribute('data-autoplay') === 'true';
		const autoplaySpeed = parseInt(carousel.getAttribute('data-autoplay-speed')) || 5000;
		
		const swiper = new Swiper(carousel, {
			modules: [Navigation, Pagination, Autoplay],
			loop: true,
			centeredSlides: true,
			spaceBetween: 30,
			
			// Auto play
			autoplay: autoplay ? {
				delay: autoplaySpeed,
				disableOnInteraction: false,
			} : false,
			
			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			
			// Pagination
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			
			// Responsive breakpoints
			breakpoints: {
				640: {
					slidesPerView: 1,
				},
				768: {
					slidesPerView: 1,
				},
				1024: {
					slidesPerView: 1,
				},
			}
		});
	});
	
	// Logo grid hover effects
	const logoItems = document.querySelectorAll('.social-logo-grid .logo-item');
	logoItems.forEach(item => {
		item.addEventListener('mouseenter', function() {
			this.style.transform = 'scale(1.05)';
		});
		
		item.addEventListener('mouseleave', function() {
			this.style.transform = 'scale(1)';
		});
	});
	
	// Trust badge animations
	const trustBadges = document.querySelectorAll('.social-trust-badges .trust-badge');
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);
	
	trustBadges.forEach(badge => {
		badge.style.opacity = '0';
		badge.style.transform = 'translateY(20px)';
		badge.style.transition = 'all 0.6s ease';
		observer.observe(badge);
	});
});