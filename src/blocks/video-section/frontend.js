/**
 * Video Section Block Frontend Functionality
 */

class VideoSectionPlayer {
	constructor(element) {
		this.element = element;
		this.attributes = JSON.parse(element.dataset.attributes || '{}');
		this.layout = this.attributes.layout || 'featured-video';
		this.videos = [];
		this.currentVideoIndex = 0;
		this.modal = null;
		this.currentPlayer = null;
		
		this.init();
	}

	init() {
		// Initialize based on layout
		switch (this.layout) {
			case 'background-video':
				this.initBackgroundVideo();
				break;
			case 'featured-video':
				this.initFeaturedVideo();
				break;
			case 'video-grid':
			case 'popup-player':
				this.initVideoGrid();
				break;
		}

		// Initialize modal if enabled
		if (this.attributes.enableModal) {
			this.initModal();
		}

		// Initialize category filtering
		if (this.attributes.enableCategories) {
			this.initCategoryFilter();
		}

		// Initialize search
		if (this.attributes.enableSearch) {
			this.initSearch();
		}

		// Initialize pagination
		if (this.attributes.enablePagination) {
			this.initPagination();
		}

		// Initialize playlist
		if (this.attributes.playlistMode && this.attributes.showPlaylist) {
			this.initPlaylist();
		}

		// Initialize keyboard shortcuts
		if (this.attributes.enableKeyboardShortcuts) {
			this.initKeyboardShortcuts();
		}

		// Initialize lazy loading
		if (this.attributes.enableLazyLoad) {
			this.initLazyLoading();
		}
	}

	initBackgroundVideo() {
		const videoContainer = this.element.querySelector('.background-video-container');
		if (!videoContainer) return;

		const video = videoContainer.querySelector('video');
		if (video) {
			// Handle autoplay policies
			const playPromise = video.play();
			if (playPromise !== undefined) {
				playPromise.catch(error => {
					console.log('Autoplay prevented:', error);
					// Fallback: show play button
					this.showPlayButton(videoContainer, video);
				});
			}

			// Add intersection observer for performance
			if ('IntersectionObserver' in window) {
				const observer = new IntersectionObserver((entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							if (video.paused) video.play();
						} else {
							if (!video.paused) video.pause();
						}
					});
				}, { threshold: 0.5 });

				observer.observe(videoContainer);
			}
		}
	}

	initFeaturedVideo() {
		const videoWrapper = this.element.querySelector('.video-player-wrapper');
		if (!videoWrapper) return;

		videoWrapper.addEventListener('click', (e) => {
			e.preventDefault();
			this.playVideo(videoWrapper);
		});

		// Add keyboard support
		videoWrapper.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.playVideo(videoWrapper);
			}
		});

		videoWrapper.setAttribute('tabindex', '0');
		videoWrapper.setAttribute('role', 'button');
		videoWrapper.setAttribute('aria-label', 'Play video');
	}

	initVideoGrid() {
		const videoItems = this.element.querySelectorAll('.video-item');
		
		videoItems.forEach((item, index) => {
			item.addEventListener('click', (e) => {
				e.preventDefault();
				this.playVideo(item, index);
			});

			// Add keyboard support
			item.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					this.playVideo(item, index);
				}
			});

			item.setAttribute('tabindex', '0');
			item.setAttribute('role', 'button');
			item.setAttribute('aria-label', `Play video: ${item.querySelector('.video-info h4')?.textContent || 'Video'}`);
		});

		// Store video data
		this.videos = Array.from(videoItems).map(item => ({
			url: item.dataset.videoUrl,
			type: item.dataset.videoType,
			id: item.dataset.videoId,
			title: item.querySelector('.video-info h4')?.textContent || '',
			description: item.querySelector('.video-info p')?.textContent || '',
			element: item
		}));
	}

	initModal() {
		// Create modal if it doesn't exist
		let modal = this.element.querySelector('#video-modal');
		if (!modal) {
			modal = this.createModal();
			document.body.appendChild(modal);
		}
		
		this.modal = modal;

		// Close modal events
		const closeBtn = modal.querySelector('.modal-close');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => this.closeModal());
		}

		// Close on escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
				this.closeModal();
			}
		});

		// Close on backdrop click
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				this.closeModal();
			}
		});
	}

	createModal() {
		const modal = document.createElement('div');
		modal.className = 'video-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden';
		modal.id = 'video-modal';
		modal.innerHTML = `
			<div class="modal-content relative max-w-4xl w-full mx-4">
				<button class="modal-close absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl" aria-label="Close video">✕</button>
				<div class="modal-video-container aspect-video bg-black rounded-lg overflow-hidden">
					<!-- Video player will be inserted here -->
				</div>
				<div class="modal-video-info mt-4 text-white">
					<h3 class="modal-video-title text-xl font-bold mb-2"></h3>
					<p class="modal-video-description text-gray-300"></p>
				</div>
				${this.attributes.playlistMode ? `
					<div class="modal-playlist mt-4">
						<button class="playlist-toggle bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
							Show Playlist
						</button>
					</div>
				` : ''}
			</div>
		`;
		return modal;
	}

	playVideo(element, index = 0) {
		const videoUrl = element.dataset.videoUrl;
		const videoType = element.dataset.videoType;
		const enableModal = element.dataset.enableModal === 'true';

		if (!videoUrl) {
			console.warn('No video URL found');
			return;
		}

		this.currentVideoIndex = index;

		if (enableModal && this.modal) {
			this.openVideoInModal(videoUrl, videoType, element);
		} else {
			this.playVideoInline(element, videoUrl, videoType);
		}

		// Analytics tracking
		this.trackVideoPlay(videoUrl, videoType);
	}

	openVideoInModal(videoUrl, videoType, element) {
		const modal = this.modal;
		const container = modal.querySelector('.modal-video-container');
		const titleEl = modal.querySelector('.modal-video-title');
		const descEl = modal.querySelector('.modal-video-description');

		// Clear previous content
		container.innerHTML = '';

		// Set video info
		const videoInfo = this.getVideoInfo(element);
		if (titleEl) titleEl.textContent = videoInfo.title;
		if (descEl) descEl.textContent = videoInfo.description;

		// Create video player
		const player = this.createVideoPlayer(videoUrl, videoType, {
			autoplay: this.attributes.autoplayModal,
			controls: true,
			width: '100%',
			height: '100%'
		});

		container.appendChild(player);
		this.currentPlayer = player;

		// Show modal
		modal.classList.remove('hidden');
		document.body.style.overflow = 'hidden';

		// Focus management
		const closeBtn = modal.querySelector('.modal-close');
		if (closeBtn) closeBtn.focus();

		// Announce to screen readers
		this.announceToScreenReader(`Playing video: ${videoInfo.title}`);
	}

	playVideoInline(element, videoUrl, videoType) {
		const thumbnailWrapper = element.querySelector('.video-thumbnail-wrapper, .video-player-wrapper');
		if (!thumbnailWrapper) return;

		// Replace thumbnail with video player
		const player = this.createVideoPlayer(videoUrl, videoType, {
			autoplay: true,
			controls: true,
			width: '100%',
			height: '100%'
		});

		thumbnailWrapper.innerHTML = '';
		thumbnailWrapper.appendChild(player);
		this.currentPlayer = player;
	}

	createVideoPlayer(videoUrl, videoType, options = {}) {
		const {
			autoplay = false,
			controls = true,
			width = '100%',
			height = '100%',
			muted = false
		} = options;

		if (videoType === 'youtube') {
			const iframe = document.createElement('iframe');
			const videoId = this.extractYouTubeId(videoUrl);
			iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&mute=${muted ? 1 : 0}`;
			iframe.width = width;
			iframe.height = height;
			iframe.frameBorder = '0';
			iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
			iframe.allowFullscreen = true;
			return iframe;
		}

		if (videoType === 'vimeo') {
			const iframe = document.createElement('iframe');
			const videoId = this.extractVimeoId(videoUrl);
			iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&muted=${muted ? 1 : 0}`;
			iframe.width = width;
			iframe.height = height;
			iframe.frameBorder = '0';
			iframe.allow = 'autoplay; fullscreen; picture-in-picture';
			iframe.allowFullscreen = true;
			return iframe;
		}

		// HTML5 video
		const video = document.createElement('video');
		video.src = videoUrl;
		video.controls = controls;
		video.autoplay = autoplay;
		video.muted = muted;
		video.style.width = width;
		video.style.height = height;
		video.className = 'w-full h-full object-cover';

		// Add event listeners
		video.addEventListener('loadstart', () => this.showLoading(true));
		video.addEventListener('canplay', () => this.showLoading(false));
		video.addEventListener('error', (e) => this.handleVideoError(e));

		// Picture-in-picture support
		if (this.attributes.enablePictureInPicture && 'pictureInPictureEnabled' in document) {
			video.addEventListener('dblclick', () => {
				if (document.pictureInPictureElement) {
					document.exitPictureInPicture();
				} else {
					video.requestPictureInPicture();
				}
			});
		}

		return video;
	}

	closeModal() {
		if (!this.modal) return;

		// Stop current video
		if (this.currentPlayer) {
			if (this.currentPlayer.tagName === 'VIDEO') {
				this.currentPlayer.pause();
			} else if (this.currentPlayer.tagName === 'IFRAME') {
				this.currentPlayer.src = '';
			}
		}

		this.modal.classList.add('hidden');
		document.body.style.overflow = '';
		
		// Return focus to trigger element
		const currentVideo = this.videos[this.currentVideoIndex]?.element;
		if (currentVideo) currentVideo.focus();

		this.announceToScreenReader('Video closed');
	}

	initCategoryFilter() {
		const categoryBtns = this.element.querySelectorAll('.category-btn');
		const videoItems = this.element.querySelectorAll('.video-item');

		categoryBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				const category = btn.dataset.category;
				this.filterByCategory(category, categoryBtns, videoItems);
			});
		});
	}

	filterByCategory(category, categoryBtns, videoItems) {
		// Update active button
		categoryBtns.forEach(btn => {
			btn.classList.remove('bg-blue-600', 'text-white');
			btn.classList.add('bg-gray-200', 'text-gray-700');
		});

		const activeBtn = this.element.querySelector(`[data-category="${category}"]`);
		if (activeBtn) {
			activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
			activeBtn.classList.add('bg-blue-600', 'text-white');
		}

		// Filter videos
		videoItems.forEach(item => {
			const videoCategory = item.querySelector('.video-info')?.dataset.category || 'general';
			
			if (category === 'all' || videoCategory === category) {
				item.style.display = '';
				item.classList.add('animate-fadeIn');
			} else {
				item.style.display = 'none';
				item.classList.remove('animate-fadeIn');
			}
		});

		this.announceToScreenReader(`Filtered to ${category === 'all' ? 'all videos' : category + ' videos'}`);
	}

	initSearch() {
		const searchInput = this.element.querySelector('.video-search');
		if (!searchInput) return;

		let searchTimeout;

		searchInput.addEventListener('input', (e) => {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				this.performSearch(e.target.value);
			}, 300);
		});
	}

	performSearch(query) {
		const videoItems = this.element.querySelectorAll('.video-item');
		const searchTerm = query.toLowerCase().trim();
		let visibleCount = 0;

		videoItems.forEach(item => {
			const title = item.querySelector('.video-info h4')?.textContent.toLowerCase() || '';
			const description = item.querySelector('.video-info p')?.textContent.toLowerCase() || '';
			
			if (!searchTerm || title.includes(searchTerm) || description.includes(searchTerm)) {
				item.style.display = '';
				item.classList.add('animate-fadeIn');
				visibleCount++;
			} else {
				item.style.display = 'none';
				item.classList.remove('animate-fadeIn');
			}
		});

		this.announceToScreenReader(`${visibleCount} videos found`);
	}

	initPagination() {
		const videosPerPage = this.attributes.videosPerPage || 6;
		const videoItems = Array.from(this.element.querySelectorAll('.video-item'));
		const totalPages = Math.ceil(videoItems.length / videosPerPage);
		
		if (totalPages <= 1) return;

		let currentPage = 1;

		const showPage = (page) => {
			const startIndex = (page - 1) * videosPerPage;
			const endIndex = startIndex + videosPerPage;

			videoItems.forEach((item, index) => {
				if (index >= startIndex && index < endIndex) {
					item.style.display = '';
				} else {
					item.style.display = 'none';
				}
			});

			this.updatePaginationButtons(page, totalPages);
		};

		const prevBtn = this.element.querySelector('.pagination-prev');
		const nextBtn = this.element.querySelector('.pagination-next');

		if (prevBtn) {
			prevBtn.addEventListener('click', () => {
				if (currentPage > 1) {
					currentPage--;
					showPage(currentPage);
				}
			});
		}

		if (nextBtn) {
			nextBtn.addEventListener('click', () => {
				if (currentPage < totalPages) {
					currentPage++;
					showPage(currentPage);
				}
			});
		}

		// Initialize first page
		showPage(1);
	}

	updatePaginationButtons(currentPage, totalPages) {
		const prevBtn = this.element.querySelector('.pagination-prev');
		const nextBtn = this.element.querySelector('.pagination-next');

		if (prevBtn) {
			prevBtn.disabled = currentPage === 1;
		}

		if (nextBtn) {
			nextBtn.disabled = currentPage === totalPages;
		}
	}

	initPlaylist() {
		const playlistToggle = this.element.querySelector('.playlist-toggle');
		const playlistSidebar = document.getElementById('playlist-sidebar');

		if (playlistToggle && playlistSidebar) {
			playlistToggle.addEventListener('click', () => {
				playlistSidebar.classList.toggle('translate-x-full');
			});

			const playlistClose = playlistSidebar.querySelector('.playlist-close');
			if (playlistClose) {
				playlistClose.addEventListener('click', () => {
					playlistSidebar.classList.add('translate-x-full');
				});
			}

			this.populatePlaylist(playlistSidebar);
		}
	}

	populatePlaylist(sidebar) {
		const itemsContainer = sidebar.querySelector('.playlist-items');
		if (!itemsContainer) return;

		this.videos.forEach((video, index) => {
			const item = document.createElement('div');
			item.className = 'playlist-item p-3 border-b cursor-pointer hover:bg-gray-50';
			item.innerHTML = `
				<div class="flex space-x-3">
					<div class="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
					<div class="flex-1 min-w-0">
						<h4 class="text-sm font-medium truncate">${video.title}</h4>
						<p class="text-xs text-gray-500 truncate">${video.description}</p>
					</div>
				</div>
			`;

			item.addEventListener('click', () => {
				this.playVideo(video.element, index);
				sidebar.classList.add('translate-x-full');
			});

			itemsContainer.appendChild(item);
		});
	}

	initKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Only handle shortcuts when modal is open or video is focused
			const modalOpen = this.modal && !this.modal.classList.contains('hidden');
			const videoFocused = document.activeElement?.closest('.video-section') === this.element;

			if (!modalOpen && !videoFocused) return;

			switch (e.key) {
				case ' ':
					e.preventDefault();
					this.togglePlayPause();
					break;
				case 'f':
				case 'F':
					e.preventDefault();
					this.toggleFullscreen();
					break;
				case 'ArrowLeft':
					e.preventDefault();
					this.seekBackward();
					break;
				case 'ArrowRight':
					e.preventDefault();
					this.seekForward();
					break;
				case 'ArrowUp':
					e.preventDefault();
					this.volumeUp();
					break;
				case 'ArrowDown':
					e.preventDefault();
					this.volumeDown();
					break;
			}
		});
	}

	initLazyLoading() {
		if ('IntersectionObserver' in window) {
			const images = this.element.querySelectorAll('img[loading="lazy"]');
			
			const imageObserver = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const img = entry.target;
						img.src = img.dataset.src || img.src;
						img.classList.remove('loading');
						observer.unobserve(img);
					}
				});
			});

			images.forEach(img => imageObserver.observe(img));
		}
	}

	// Utility methods
	extractYouTubeId(url) {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return (match && match[2].length === 11) ? match[2] : null;
	}

	extractVimeoId(url) {
		const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
		const match = url.match(regExp);
		return match ? match[5] : null;
	}

	getVideoInfo(element) {
		return {
			title: element.querySelector('.video-info h4, .video-info h3')?.textContent || '',
			description: element.querySelector('.video-info p')?.textContent || ''
		};
	}

	showLoading(show) {
		const loader = this.element.querySelector('.video-loading');
		if (loader) {
			loader.classList.toggle('hidden', !show);
		}
	}

	handleVideoError(error) {
		console.error('Video error:', error);
		this.announceToScreenReader('Video failed to load');
	}

	trackVideoPlay(videoUrl, videoType) {
		// Analytics tracking
		if (typeof gtag !== 'undefined') {
			gtag('event', 'video_play', {
				video_url: videoUrl,
				video_type: videoType
			});
		}
	}

	togglePlayPause() {
		if (this.currentPlayer && this.currentPlayer.tagName === 'VIDEO') {
			if (this.currentPlayer.paused) {
				this.currentPlayer.play();
			} else {
				this.currentPlayer.pause();
			}
		}
	}

	toggleFullscreen() {
		if (this.currentPlayer) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				this.currentPlayer.requestFullscreen();
			}
		}
	}

	seekBackward() {
		if (this.currentPlayer && this.currentPlayer.tagName === 'VIDEO') {
			this.currentPlayer.currentTime = Math.max(0, this.currentPlayer.currentTime - 10);
		}
	}

	seekForward() {
		if (this.currentPlayer && this.currentPlayer.tagName === 'VIDEO') {
			this.currentPlayer.currentTime = Math.min(this.currentPlayer.duration, this.currentPlayer.currentTime + 10);
		}
	}

	volumeUp() {
		if (this.currentPlayer && this.currentPlayer.tagName === 'VIDEO') {
			this.currentPlayer.volume = Math.min(1, this.currentPlayer.volume + 0.1);
		}
	}

	volumeDown() {
		if (this.currentPlayer && this.currentPlayer.tagName === 'VIDEO') {
			this.currentPlayer.volume = Math.max(0, this.currentPlayer.volume - 0.1);
		}
	}

	showPlayButton(container, video) {
		const playBtn = document.createElement('button');
		playBtn.className = 'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl hover:bg-opacity-70 transition-all duration-200';
		playBtn.innerHTML = '▶️';
		playBtn.addEventListener('click', () => {
			video.play();
			playBtn.remove();
		});
		container.appendChild(playBtn);
	}

	announceToScreenReader(message) {
		const announcement = document.createElement('div');
		announcement.setAttribute('aria-live', 'polite');
		announcement.setAttribute('aria-atomic', 'true');
		announcement.className = 'sr-only';
		announcement.textContent = message;
		
		document.body.appendChild(announcement);
		
		setTimeout(() => {
			document.body.removeChild(announcement);
		}, 1000);
	}
}

// Initialize all video section blocks when DOM is ready
function initVideoSectionBlocks() {
	const blocks = document.querySelectorAll('.wp-block-tailwind-starter-video-section');
	
	blocks.forEach(block => {
		if (!block.dataset.initialized) {
			new VideoSectionPlayer(block);
			block.dataset.initialized = 'true';
		}
	});
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initVideoSectionBlocks);
} else {
	initVideoSectionBlocks();
}

// Re-initialize on dynamic content load
document.addEventListener('videoSectionBlocksUpdate', initVideoSectionBlocks);

// Export for potential external use
window.VideoSectionPlayer = VideoSectionPlayer;

console.log('🎬 Video Section block frontend loaded'); 