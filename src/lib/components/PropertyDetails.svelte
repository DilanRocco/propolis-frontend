<!-- PropertyDetails.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { DoorloopProperty } from '../types/doorloop';
  import type { ListingData } from '../stores/propertyStore';
  import { fetchPropertyById, type DetailedListing } from '../api/properties';
  import PictureGallery from './PictureGallery.svelte';

  export let property: DoorloopProperty | null = null;
  export let listingData: ListingData[] = [];
  export let show = false;

  const dispatch = createEventDispatcher();

  let detailedProperty: DetailedListing | null = null;
  let loadingDetails = false;
  let detailsError: string | null = null;

  function closeModal() {
    dispatch('close');
  }

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format date
  function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Load detailed property information with full-size images when modal opens
  async function loadDetailedProperty() {
    if (!property?.id || detailedProperty?.id === property.id) return;

    loadingDetails = true;
    detailsError = null;

    try {
      detailedProperty = await fetchPropertyById(property.id, fetch);
      console.log('Loaded detailed property with full-size images:', detailedProperty);
    } catch (err) {
      detailsError = err instanceof Error ? err.message : 'Failed to load detailed images';
      console.error('Error loading detailed property:', err);
      // Fallback to existing property pictures
      detailedProperty = null;
    } finally {
      loadingDetails = false;
    }
  }

  // Get pictures from detailed property (full_url) or fallback to property pictures
  $: displayPictures = detailedProperty?.detailed_pictures || [];
  $: fallbackPictures = property?.pictures?.map(pic => pic.url) || [];

  // Watch for property changes to load detailed info
  $: if (show && property?.id) {
    loadDetailedProperty();
  }
</script>

{#if show && property}
  <div class="modal-backdrop" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0">
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog" aria-modal="true" tabindex="0">
      <button class="close-button" on:click={closeModal}>×</button>
      
      <div class="property-header">
        <h2>{property.name}</h2>
        <div class="property-type">{property.type.replace(/_/g, ' ')}</div>
        {#if detailedProperty && detailedProperty.detailed_pictures.length > 0}
          <div class="image-source-indicator">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <span>Full-size images from jd_listing_pictures</span>
          </div>
        {/if}
      </div>

      <!-- Enhanced Picture Gallery with Full-Size Images -->
      <div class="property-images">
        {#if loadingDetails}
          <div class="loading-images">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-600 text-sm mt-2 text-center">Loading full-size images...</p>
          </div>
        {:else if detailsError}
          <div class="error-images">
            <svg class="mx-auto h-8 w-8 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.18 14.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="text-red-600 text-sm text-center">{detailsError}</p>
            <p class="text-gray-500 text-xs text-center mt-1">Using fallback images</p>
          </div>
        {/if}
        
        <PictureGallery 
          pictures={displayPictures.length ? 
            displayPictures.map(p => p.full_url) : 
            fallbackPictures}
          title={property.name}
          showThumbnails={true}
          maxHeight="400px"
        />
      </div>

      <div class="property-details">
        <div class="detail-section">
          <h3>Location</h3>
          <p>{property.address.street1}</p>
          <p>{property.address.city}, {property.address.state} {property.address.zip}</p>
        </div>

        {#if property.description}
          <div class="detail-section">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>
        {/if}

        {#if property.amenities && property.amenities.length > 0}
          <div class="detail-section">
            <h3>Amenities</h3>
            <div class="amenities-list">
              {#each property.amenities as amenity}
                <span class="amenity-tag">{amenity}</span>
              {/each}
            </div>
          </div>
        {/if}

        <div class="detail-section">
          <h3>Property Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Active Units:</span>
              <span class="value">{property.numActiveUnits}</span>
            </div>
            <div class="info-item">
              <span class="label">Created:</span>
              <span class="value">{formatDate(property.createdAt)}</span>
            </div>
            <div class="info-item">
              <span class="label">Last Updated:</span>
              <span class="value">{formatDate(property.updatedAt)}</span>
            </div>
            {#if detailedProperty && detailedProperty.detailed_pictures.length > 0}
              <div class="info-item">
                <span class="label">Images:</span>
                <span class="value">{detailedProperty.detailed_pictures.length} from database</span>
              </div>
            {/if}
          </div>
        </div>

        {#if listingData && listingData.length > 0}
          <div class="detail-section">
            <h3>Recent Activity</h3>
            <div class="activity-list">
              {#each listingData as listing}
                <div class="activity-item">
                  <div class="activity-date">{formatDate(listing.guesty_created_at)}</div>
                  <div class="activity-amount">{formatCurrency(listing.total_paid)}</div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Image Details Section -->
        {#if detailedProperty && detailedProperty.detailed_pictures.length > 0}
          <div class="detail-section">
            <h3>Image Details</h3>
            <div class="image-details-grid">
              {#each detailedProperty.detailed_pictures as picture, index}
                <div class="image-detail-item">
                  <div class="image-preview">
                    <img 
                      src={picture.thumbnail_url || picture.full_url} 
                      alt="Preview {index + 1}"
                      loading="lazy"
                    />
                  </div>
                  <div class="image-info">
                    <div class="image-title">Image {index + 1}</div>
                    <div class="image-meta">
                      <span class="meta-label">Order:</span> {picture.display_order}
                    </div>
                    {#if picture.caption}
                      <div class="image-meta">
                        <span class="meta-label">Caption:</span> {picture.caption}
                      </div>
                    {/if}
                    <div class="image-meta">
                      <span class="meta-label">Type:</span> Full-size image
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  .property-header {
    margin-bottom: 1.5rem;
  }

  .property-header h2 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
  }

  .property-type {
    color: #666;
    font-size: 0.9rem;
    text-transform: capitalize;
  }

  .image-source-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 6px 12px;
    background: rgba(59, 130, 246, 0.1);
    color: #1d4ed8;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .property-images {
    margin-bottom: 1.5rem;
  }

  .loading-images, .error-images {
    padding: 2rem;
    text-align: center;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .property-details {
    display: grid;
    gap: 1.5rem;
  }

  .detail-section {
    border-bottom: 1px solid #eee;
    padding-bottom: 1.5rem;
  }

  .detail-section:last-child {
    border-bottom: none;
  }

  .detail-section h3 {
    color: #333;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  .amenities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .amenity-tag {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.9rem;
    color: #666;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item .label {
    color: #666;
    font-size: 0.9rem;
  }

  .info-item .value {
    color: #333;
    font-weight: 500;
  }

  .activity-list {
    display: grid;
    gap: 0.75rem;
  }

  .activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .activity-date {
    color: #666;
    font-size: 0.9rem;
  }

  .activity-amount {
    color: #059669;
    font-weight: 600;
  }

  .image-details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .image-detail-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .image-preview {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 6px;
    overflow: hidden;
  }

  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-info {
    flex: 1;
    min-width: 0;
  }

  .image-title {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  .image-meta {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.125rem;
  }

  .meta-label {
    font-weight: 500;
    color: #374151;
  }
</style> 