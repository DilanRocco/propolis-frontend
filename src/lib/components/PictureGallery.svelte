<!-- PictureGallery.svelte -->
<script lang="ts">
  // 🚩 FEATURE FLAG: Toggle between full gallery and single image mode
  const ENABLE_FULL_GALLERY = false; // Set to false to show only first image
  
  export let pictures: string[] = [];
  export let title: string = '';
  export let showThumbnails: boolean = true;
  export let maxHeight: string = '400px';


  let currentImageIndex = 0;
  let showLightbox = false;
  let loadedImages = new Set();
  let mainImageLoaded = false;

  // Use feature flag to determine which pictures to show
  $: displayPictures = ENABLE_FULL_GALLERY ? pictures : (pictures.length > 0 ? [pictures[0]] : []);
  
  // Track when the current main image is loaded
  $: {
    if (displayPictures[currentImageIndex]) {
      mainImageLoaded = loadedImages.has(displayPictures[currentImageIndex]);
    }
  }
  
  function handleImageLoad(imageSrc: string) {
    loadedImages.add(imageSrc);
    loadedImages = loadedImages; // Trigger reactivity
    if (imageSrc === displayPictures[currentImageIndex]) {
      mainImageLoaded = true;
    }
  }
  
  function nextImage() {
    if (ENABLE_FULL_GALLERY && displayPictures.length > 1) {
      currentImageIndex = (currentImageIndex + 1) % displayPictures.length;
    }
  }

  function previousImage() {
    if (ENABLE_FULL_GALLERY && displayPictures.length > 1) {
      currentImageIndex = (currentImageIndex - 1 + displayPictures.length) % displayPictures.length;
    }
  }

  function selectImage(index: number) {
    if (ENABLE_FULL_GALLERY) {
      currentImageIndex = index;
    }
  }

  function openLightbox() {
    showLightbox = true;
  }

  function closeLightbox() {
    showLightbox = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showLightbox || !ENABLE_FULL_GALLERY) return;
    
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      previousImage();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if displayPictures && displayPictures.length > 0}
  <div class="picture-gallery">
    <!-- Main Image Display -->
    <div class="main-image-container" style="max-height: {maxHeight};">
      <div class="image-wrapper">
        <!-- Loading skeleton -->
        {#if !mainImageLoaded}
          <div class="image-skeleton">
            <div class="skeleton-content">
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="skeleton-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.293-1.293a1 1 0 011.414 0L20 16m-6-12v4m-2-2h4" />
              </svg>
              <p class="skeleton-text">Loading image...</p>
            </div>
          </div>
        {/if}
        
        <!-- Actual image -->
        <button class="image-button {mainImageLoaded ? 'loaded' : 'loading'}" on:click={openLightbox} aria-label="View image in fullscreen">
          <img 
            src={displayPictures[currentImageIndex]} 
            alt="{title} - Image {currentImageIndex + 1}"
            class="main-image"
            loading="lazy"
            on:load={() => handleImageLoad(displayPictures[currentImageIndex])}
          />
        </button>
      </div>
      
      {#if displayPictures.length > 1}
        <!-- Navigation Arrows -->
        <button class="nav-button prev" on:click={previousImage} aria-label="Previous image">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button class="nav-button next" on:click={nextImage} aria-label="Next image">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Image Counter -->
        <div class="image-counter">
          {currentImageIndex + 1} / {displayPictures.length}
        </div>
      {/if}

      <!-- Expand Button -->
      {#if mainImageLoaded}
        <button class="expand-button" on:click={openLightbox} aria-label="View in fullscreen">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      {/if}
    </div>

    <!-- Thumbnail Navigation -->
    {#if showThumbnails && displayPictures.length > 1}
      <div class="thumbnails">
        {#each displayPictures as picture, index}
          <button 
            class="thumbnail {index === currentImageIndex ? 'active' : ''}"
            on:click={() => selectImage(index)}
          >
            <img 
              src={picture} 
              alt="{title} - Thumbnail {index + 1}"
              loading="lazy"
            />
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Lightbox Modal -->
  {#if showLightbox}
    <div class="lightbox-backdrop" on:click={closeLightbox} on:keydown={(e) => e.key === 'Escape' && closeLightbox()} role="button" tabindex="0" aria-label="Close lightbox">
      <div class="lightbox-content" on:click|stopPropagation on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); } }} role="button" tabindex="0" aria-label="Close lightbox">
        <button class="lightbox-close" on:click={closeLightbox} aria-label="Close lightbox">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <img 
          src={displayPictures[currentImageIndex]} 
          alt="{title} - Image {currentImageIndex + 1}"
          class="lightbox-image"
        />
        
        {#if displayPictures.length > 1}
          <button class="lightbox-nav prev" on:click={previousImage} aria-label="Previous image">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="lightbox-nav next" on:click={nextImage} aria-label="Next image">
            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div class="lightbox-counter">
            {currentImageIndex + 1} / {displayPictures.length}
          </div>
        {/if}
      </div>
    </div>
  {/if}
{:else}
  <div class="no-images">
    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="text-gray-400">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.293-1.293a1 1 0 011.414 0L20 16m-6-12v4m-2-2h4" />
    </svg>
    <p>No images available</p>
  </div>
{/if}

<style>
  .picture-gallery {
    width: 100%;
  }

  .main-image-container {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    background: #f3f4f6;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-skeleton {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .skeleton-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #9ca3af;
  }

  .skeleton-icon {
    margin-bottom: 8px;
    opacity: 0.6;
  }

  .skeleton-text {
    margin: 0;
    font-size: 14px;
    color: #6b7280;
    opacity: 0.8;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .image-button {
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    display: block;
    position: relative;
    z-index: 2;
  }

  .image-button.loading {
    opacity: 0;
    pointer-events: none;
  }

  .image-button.loaded {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.3s ease;
  }

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
    display: block;
  }

  .image-button.loaded:hover .main-image {
    transform: scale(1.02);
  }

 
  .image-placeholder:hover {
    background: #f3f4f6;
  }

  .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #6b7280;
  }





  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    color: #374151;
  }

  .nav-button:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-50%) scale(1.1);
  }

  .nav-button.prev {
    left: 16px;
  }

  .nav-button.next {
    right: 16px;
  }

  .image-counter {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
  }

  .expand-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    color: #374151;
  }

  .expand-button:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  .thumbnails {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    overflow-x: auto;
    padding: 4px;
  }

  .thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 60px;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f3f4f6;
  }

  .thumbnail:hover {
    border-color: #d1d5db;
    transform: scale(1.05);
  }

  .thumbnail.active {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }

  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .lightbox-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .lightbox-content {
    position: relative;
    max-width: 95vw;
    max-height: 95vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  .lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s ease;
  }

  .lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s ease;
  }

  .lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }

  .lightbox-nav.prev {
    left: -80px;
  }

  .lightbox-nav.next {
    right: -80px;
  }

  .lightbox-counter {
    position: absolute;
    bottom: -50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 500;
  }

  .no-images {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 24px;
    background: #f9fafb;
    border-radius: 12px;
    border: 2px dashed #d1d5db;
    color: #6b7280;
  }

  .no-images p {
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .thumbnails {
      flex-wrap: wrap;
    }
    
    .thumbnail {
      width: 60px;
      height: 45px;
    }

    .lightbox-nav.prev {
      left: -60px;
    }

    .lightbox-nav.next {
      right: -60px;
    }
  }
</style> 