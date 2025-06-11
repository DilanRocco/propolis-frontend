<!-- PropertyDetails.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DoorloopProperty } from '../types/doorloop';
  import type { ListingData } from '../stores/propertyStore';

  export let property: DoorloopProperty | null = null;
  export let listingData: ListingData[] = [];
  export let show = false;

  const dispatch = createEventDispatcher();

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
</script>

{#if show && property}
  <div class="modal-backdrop" on:click={closeModal} on:keydown={(e) => e.key === 'Escape' && closeModal()} role="button" tabindex="0">
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog" aria-modal="true" tabindex="0">
      <button class="close-button" on:click={closeModal}>×</button>
      
      <div class="property-header">
        <h2>{property.name}</h2>
        <div class="property-type">{property.type.replace(/_/g, ' ')}</div>
      </div>

      {#if property.pictures && property.pictures.length > 0}
        <div class="property-images">
          <img src={property.pictures[0].url} alt={property.name} />
        </div>
      {/if}

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
    max-width: 800px;
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

  .property-images {
    margin-bottom: 1.5rem;
  }

  .property-images img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 8px;
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
    padding: 0.75rem;
    background: #f8f8f8;
    border-radius: 8px;
  }

  .activity-date {
    color: #666;
  }

  .activity-amount {
    font-weight: 500;
    color: #333;
  }

  @media (max-width: 640px) {
    .modal-content {
      padding: 1rem;
      width: 95%;
    }

    .property-images img {
      height: 200px;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 