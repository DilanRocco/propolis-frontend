import { propertyStore } from '$lib/stores/propertyStore';
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch }) => {
  // Load both Guesty and Doorloop properties
  await Promise.all([
    propertyStore.loadListings(fetch),
    propertyStore.loadListingNames(fetch)
  ]);
  
  return { listings: propertyStore };
};

