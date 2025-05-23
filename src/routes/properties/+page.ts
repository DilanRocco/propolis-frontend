import { propertyStore } from '$lib/stores/propertyStore';
import type { PageLoad } from "../$types";
export const load: PageLoad = async ({ fetch }) => {
  await propertyStore.loadListings(fetch);
  return { listings: propertyStore };
};

