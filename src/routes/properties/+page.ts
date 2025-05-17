import type { Listing } from "../../lib/types/properties"
import { propertyStore } from '$lib/stores/propertyStore';
import type { PageLoad } from "../$types";
export const load: PageLoad = async ({ fetch }) => {
  await propertyStore.load(fetch);
  return { listings: propertyStore };
};

