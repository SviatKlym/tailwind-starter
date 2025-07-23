import { useBlockProps, RichText } from '@wordpress/block-editor'
import { generatePerformanceConfig, generateDataAttributes } from '../../utils/block-config-generator.js'

export default function save({ attributes }) {
  const {
    videoType,
    videoUrl,
    youtubeId,
    vimeoId,
    uploadedVideo,
    posterImage,
    title,
    description,
    showControls,
    autoplay,
    muted,
    loop,
    enableLazyLoading,
    enablePictureInPicture,
    aspectRatio,
    alignment,
    overlayText,
    overlayPosition,
    backgroundColor,
    settings
  } = attributes

  // Video performance configuration
  const performanceConfig = generatePerformanceConfig('video-section', {
    lazyLoading: { 
      enabled: enableLazyLoading !== false,
      rootMargin: '200px' 
    },
    analytics: {
      enabled: true,
      trackViews: true,
      viewData: { 
        video_type: videoType,
        has_autoplay: autoplay,
        aspect_ratio: aspectRatio 
      }
    }
  })

  const blockProps = useBlockProps.save({
    className: `video-section align-${alignment || 'center'} ${backgroundColor || ''}`,
    ...generateDataAttributes(performanceConfig)
  })

  // Helper function to get optimized poster image
  const getOptimizedPoster = (poster) => {
    if (!poster?.url) return null

    return (
      <picture>
        <source 
          srcSet={poster.url.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
          type="image/webp"
        />
        <img
          src={poster.url}
          alt={poster.alt || 'Video thumbnail'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </picture>
    )
  }

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return null
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  // Helper function to get Vimeo thumbnail (fallback)
  const getVimeoThumbnail = (videoId) => {
    if (!videoId) return null
    // Note: Real implementation would fetch from Vimeo API
    return `https://vumbnail.com/${videoId}.jpg`
  }

  // Helper function to render video element
  const renderVideo = () => {
    const aspectRatioClass = {
      '16:9': 'aspect-video',
      '4:3': 'aspect-4/3',
      '1:1': 'aspect-square',
      'auto': 'aspect-auto'
    }[aspectRatio] || 'aspect-video'

    const isLazy = enableLazyLoading !== false

    // Handle different video types
    switch (videoType) {
      case 'youtube':
        return renderYouTubeVideo(aspectRatioClass, isLazy)
      case 'vimeo':
        return renderVimeoVideo(aspectRatioClass, isLazy)
      case 'uploaded':
        return renderUploadedVideo(aspectRatioClass, isLazy)
      default:
        return renderDefaultVideo(aspectRatioClass, isLazy)
    }
  }

  // YouTube video component
  const renderYouTubeVideo = (aspectRatioClass, isLazy) => {
    if (!youtubeId) return null

    const thumbnailUrl = getYouTubeThumbnail(youtubeId)
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: showControls ? '1' : '0',
      loop: loop ? '1' : '0',
      rel: '0',
      modestbranding: '1'
    })}`

    return (
      <div className={`video-container relative ${aspectRatioClass} bg-black rounded-lg overflow-hidden group`}>
        
        {/* Thumbnail / Poster */}
        <div className="video-thumbnail absolute inset-0">
          {posterImage?.url ? (
            getOptimizedPoster(posterImage)
          ) : (
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
          
          {/* Play button overlay */}
          <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
            <button 
              className="play-button w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              data-video-id={youtubeId}
              data-video-type="youtube"
              aria-label="Play video"
            >
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Lazy-loaded iframe */}
        {!isLazy && (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}

        {/* Data for lazy loading */}
        {isLazy && (
          <div 
            className="video-lazy-data hidden"
            data-video-src={embedUrl}
            data-video-type="youtube"
          />
        )}
      </div>
    )
  }

  // Vimeo video component
  const renderVimeoVideo = (aspectRatioClass, isLazy) => {
    if (!vimeoId) return null

    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?${new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      muted: muted ? '1' : '0',
      controls: showControls ? '1' : '0',
      loop: loop ? '1' : '0',
      title: '0',
      byline: '0',
      portrait: '0'
    })}`

    return (
      <div className={`video-container relative ${aspectRatioClass} bg-black rounded-lg overflow-hidden group`}>
        
        {/* Thumbnail / Poster */}
        <div className="video-thumbnail absolute inset-0">
          {posterImage?.url ? (
            getOptimizedPoster(posterImage)
          ) : (
            <img
              src={getVimeoThumbnail(vimeoId)}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
          
          {/* Play button overlay */}
          <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300">
            <button 
              className="play-button w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
              data-video-id={vimeoId}
              data-video-type="vimeo"
              aria-label="Play video"
            >
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Lazy-loaded iframe */}
        {!isLazy && (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}

        {/* Data for lazy loading */}
        {isLazy && (
          <div 
            className="video-lazy-data hidden"
            data-video-src={embedUrl}
            data-video-type="vimeo"
          />
        )}
      </div>
    )
  }

  // Uploaded video component
  const renderUploadedVideo = (aspectRatioClass, isLazy) => {
    if (!uploadedVideo?.url) return null

    return (
      <div className={`video-container relative ${aspectRatioClass} bg-black rounded-lg overflow-hidden`}>
        <video
          className="w-full h-full object-cover"
          controls={showControls}
          autoPlay={autoplay && !isLazy}
          muted={muted}
          loop={loop}
          poster={posterImage?.url}
          preload={isLazy ? 'none' : 'metadata'}
          {...(enablePictureInPicture && { 'data-pip': 'enabled' })}
        >
          <source src={uploadedVideo.url} type="video/mp4" />
          <source src={uploadedVideo.url.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  // Default video component
  const renderDefaultVideo = (aspectRatioClass, isLazy) => {
    if (!videoUrl) return null

    // Check if it's a direct video file
    const isDirectVideo = /\.(mp4|webm|ogg)$/i.test(videoUrl)

    if (isDirectVideo) {
      return (
        <div className={`video-container relative ${aspectRatioClass} bg-black rounded-lg overflow-hidden`}>
          <video
            className="w-full h-full object-cover"
            controls={showControls}
            autoPlay={autoplay && !isLazy}
            muted={muted}
            loop={loop}
            poster={posterImage?.url}
            preload={isLazy ? 'none' : 'metadata'}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    // Handle as iframe embed
    return (
      <div className={`video-container relative ${aspectRatioClass} bg-black rounded-lg overflow-hidden`}>
        <iframe
          src={videoUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <section {...blockProps}>
      <div className="video-section-container mx-auto max-w-4xl px-4">
        
        {/* Title and description */}
        {(title || description) && (
          <div className="video-content text-center mb-8">
            {title && (
              <RichText.Content
                tagName="h2"
                value={title}
                className="video-title text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                data-animate="title"
              />
            )}
            {description && (
              <RichText.Content
                tagName="p"
                value={description}
                className="video-description text-lg text-gray-600 max-w-2xl mx-auto"
                data-animate="description"
                data-animate-delay="200"
              />
            )}
          </div>
        )}

        {/* Video player */}
        <div className="video-player-wrapper" data-animate="video" data-animate-delay="400">
          {renderVideo()}
        </div>

        {/* Overlay text */}
        {overlayText && (
          <div className={`video-overlay absolute ${
            overlayPosition === 'top' ? 'top-4' :
            overlayPosition === 'bottom' ? 'bottom-4' :
            overlayPosition === 'center' ? 'top-1/2 transform -translate-y-1/2' :
            'bottom-4'
          } left-4 right-4 text-center`}>
            <div className="overlay-content bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <RichText.Content
                tagName="p"
                value={overlayText}
                className="text-lg font-medium"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 