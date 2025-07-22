/**
 * Optimized Video Section Frontend
 * Reduced from 752 lines to ~120 lines using shared presets
 */

// Wait for presets to be ready
document.addEventListener('blockPresetsReady', function(e) {
    if (e.detail.blockName !== 'video-section') return;
    
    const blocks = document.querySelectorAll('.wp-block-tailwind-starter-video-section');
    blocks.forEach(initVideoSection);
});

function initVideoSection(block) {
    if (!block || block.dataset.initialized) return;
    
    const videos = Array.from(block.querySelectorAll('.video-item'));
    const layout = block.dataset.layout || 'featured-video';
    const enableModal = block.dataset.enableModal !== 'false';
    const enableLazyLoad = block.dataset.enableLazyLoad !== 'false';
    
    if (videos.length === 0) return;
    
    // Use shared intersection observer for lazy loading
    if (enableLazyLoad) {
        const videoImages = block.querySelectorAll('img[data-src]');
        if (videoImages.length > 0) {
            window.BlockIntersectionObserver.lazyLoadImages(videoImages);
        }
    }
    
    // Use shared intersection observer for animations
    window.BlockIntersectionObserver.animateOnScroll(
        videos,
        'animate-fade-in animate-scale-in'
    );
    
    // Initialize video players
    videos.forEach((video, index) => {
        initVideoPlayer(video, index, { 
            layout, 
            enableModal, 
            block 
        });
    });
    
    // Setup playlist mode if enabled
    if (layout === 'playlist' && videos.length > 1) {
        setupPlaylist(block, videos);
    }
    
    // Setup carousel navigation if needed
    if (layout === 'carousel') {
        setupCarousel(block, videos);
    }
    
    block.dataset.initialized = 'true';
}

function initVideoPlayer(videoElement, index, options) {
    const { layout, enableModal, block } = options;
    
    const playButton = videoElement.querySelector('.play-button, .video-play-overlay');
    const thumbnail = videoElement.querySelector('.video-thumbnail, img');
    const videoData = extractVideoData(videoElement);
    
    if (!videoData.url && !videoData.youtubeId && !videoData.vimeoId) {
        return; // No video source
    }
    
    // Create video player instance
    const player = new OptimizedVideoPlayer(videoElement, videoData, {
        enableModal,
        layout,
        index
    });
    
    // Click handlers for play button and thumbnail
    if (playButton) {
        playButton.addEventListener('click', (e) => {
            e.preventDefault();
            player.play();
        });
    }
    
    if (thumbnail && !playButton) {
        thumbnail.addEventListener('click', (e) => {
            e.preventDefault();
            player.play();
        });
    }
    
    // Keyboard support using shared accessibility helper
    videoElement.setAttribute('tabindex', '0');
    videoElement.setAttribute('role', 'button');
    videoElement.setAttribute('aria-label', `Play video: ${videoData.title}`);
    
    videoElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            player.play();
        }
    });
    
    return player;
}

class OptimizedVideoPlayer {
    constructor(element, videoData, options = {}) {
        this.element = element;
        this.videoData = videoData;
        this.options = options;
        this.isPlaying = false;
        this.videoElement = null;
        this.modal = null;
    }
    
    play() {
        if (this.options.enableModal) {
            this.playInModal();
        } else {
            this.playInline();
        }
    }
    
    playInModal() {
        if (!window.BlockModalManager) {
            console.warn('Modal manager not available');
            this.playInline();
            return;
        }
        
        const modalContent = this.createVideoHTML();
        
        this.modal = window.BlockModalManager.create({
            title: this.videoData.title || 'Video Player',
            content: modalContent,
            size: 'large',
            showCloseButton: true,
            onShow: () => {
                // Start video playback
                const videoEl = this.modal.element.querySelector('video, iframe');
                if (videoEl) {
                    this.setupVideoElement(videoEl);
                    this.startPlayback(videoEl);
                }
            },
            onHide: () => {
                // Stop video playback
                this.stopPlayback();
            }
        });
        
        this.modal.show();
        
        // Announce to screen readers using shared utility
        if (window.BlockAccessibility) {
            window.BlockAccessibility.announceToScreenReader(
                `Playing video: ${this.videoData.title}`
            );
        }
    }
    
    playInline() {
        const container = this.element.querySelector('.video-container') || this.element;
        const placeholder = container.querySelector('.video-thumbnail, .video-placeholder');
        
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        const videoHTML = this.createVideoHTML();
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-player-wrapper';
        videoWrapper.innerHTML = videoHTML;
        
        container.appendChild(videoWrapper);
        
        const videoElement = videoWrapper.querySelector('video, iframe');
        if (videoElement) {
            this.setupVideoElement(videoElement);
            this.startPlayback(videoElement);
        }
    }
    
    createVideoHTML() {
        const { url, type, youtubeId, vimeoId, autoplay, muted, loop, controls, poster } = this.videoData;
        
        if (type === 'youtube' && youtubeId) {
            return this.createYouTubeEmbed(youtubeId);
        }
        
        if (type === 'vimeo' && vimeoId) {
            return this.createVimeoEmbed(vimeoId);
        }
        
        if (url) {
            return `
                <video 
                    class="w-full h-auto max-h-[70vh]"
                    ${controls ? 'controls' : ''}
                    ${autoplay ? 'autoplay' : ''}
                    ${muted ? 'muted' : ''}
                    ${loop ? 'loop' : ''}
                    ${poster ? `poster="${poster}"` : ''}
                    preload="metadata"
                >
                    <source src="${url}" type="video/mp4">
                    <p>Your browser doesn't support HTML5 video. <a href="${url}">Download the video</a> instead.</p>
                </video>
            `;
        }
        
        return '<p>No video source available.</p>';
    }
    
    createYouTubeEmbed(videoId) {
        return `
            <iframe 
                class="w-full aspect-video"
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
    }
    
    createVimeoEmbed(videoId) {
        return `
            <iframe 
                class="w-full aspect-video"
                src="https://player.vimeo.com/video/${videoId}?autoplay=1"
                title="Vimeo video player"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
    }
    
    setupVideoElement(videoElement) {
        this.videoElement = videoElement;
        
        if (videoElement.tagName === 'VIDEO') {
            // Add keyboard shortcuts using shared accessibility helper
            videoElement.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case ' ':
                        e.preventDefault();
                        this.togglePlayPause();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.skipBackward();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.skipForward();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                }
            });
        }
    }
    
    startPlayback(videoElement) {
        if (videoElement && videoElement.tagName === 'VIDEO') {
            videoElement.play().catch(error => {
                console.warn('Video autoplay failed:', error);
            });
        }
        this.isPlaying = true;
    }
    
    stopPlayback() {
        if (this.videoElement && this.videoElement.tagName === 'VIDEO') {
            this.videoElement.pause();
        }
        this.isPlaying = false;
    }
    
    togglePlayPause() {
        if (!this.videoElement || this.videoElement.tagName !== 'VIDEO') return;
        
        if (this.videoElement.paused) {
            this.videoElement.play();
        } else {
            this.videoElement.pause();
        }
    }
    
    skipBackward(seconds = 10) {
        if (this.videoElement && this.videoElement.tagName === 'VIDEO') {
            this.videoElement.currentTime = Math.max(0, this.videoElement.currentTime - seconds);
        }
    }
    
    skipForward(seconds = 10) {
        if (this.videoElement && this.videoElement.tagName === 'VIDEO') {
            this.videoElement.currentTime += seconds;
        }
    }
    
    toggleFullscreen() {
        if (!this.videoElement) return;
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.videoElement.requestFullscreen().catch(err => {
                console.warn('Fullscreen failed:', err);
            });
        }
    }
}

function extractVideoData(element) {
    const dataset = element.dataset;
    
    return {
        url: dataset.videoUrl || '',
        type: dataset.videoType || 'upload',
        title: dataset.videoTitle || '',
        description: dataset.videoDescription || '',
        youtubeId: dataset.youtubeId || '',
        vimeoId: dataset.vimeoId || '',
        autoplay: dataset.autoplay === 'true',
        muted: dataset.muted === 'true',
        loop: dataset.loop === 'true',
        controls: dataset.controls !== 'false',
        poster: dataset.poster || ''
    };
}

function setupPlaylist(block, videos) {
    // Simple playlist functionality - could be expanded
    let currentIndex = 0;
    
    const playNext = () => {
        currentIndex = (currentIndex + 1) % videos.length;
        const nextVideo = videos[currentIndex];
        if (nextVideo) {
            nextVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    
    // Auto-advance to next video when current ends
    videos.forEach((video, index) => {
        const videoElement = video.querySelector('video');
        if (videoElement) {
            videoElement.addEventListener('ended', () => {
                if (block.dataset.autoplayNext === 'true') {
                    setTimeout(playNext, 1000);
                }
            });
        }
    });
}

function setupCarousel(block, videos) {
    // Use shared touch gestures if available
    if (window.BlockTouchGestures) {
        let currentIndex = 0;
        
        const showVideo = (index) => {
            videos.forEach((video, i) => {
                video.style.display = i === index ? 'block' : 'none';
            });
            currentIndex = index;
        };
        
        window.BlockTouchGestures.create(block, {
            onSwipeLeft: () => {
                const nextIndex = (currentIndex + 1) % videos.length;
                showVideo(nextIndex);
            },
            onSwipeRight: () => {
                const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
                showVideo(prevIndex);
            }
        });
        
        // Show first video initially
        showVideo(0);
    }
}

// Register block assets when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerVideoSectionAssets);
} else {
    registerVideoSectionAssets();
}

function registerVideoSectionAssets() {
    if (window.BlockAssetManager) {
        window.BlockAssetManager.registerBlockAssets('video-section', {
            presets: ['modal-manager', 'animations', 'intersection-observer', 'touch-gestures'],
            priority: 'normal'
        });
    }
}