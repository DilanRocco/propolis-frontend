import { propertyStore } from '$lib/stores/propertyStore';
import type { PageLoad } from "../$types";
export const load: PageLoad = async ({ fetch }) => {
  await propertyStore.loadListingNames(fetch);
  return { listings: propertyStore };
};

