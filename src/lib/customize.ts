/**
 * Products that have a dedicated /customize/<id> page → their route.
 * Single source of truth used by the product card, the product detail view,
 * and collection ordering (these are featured first in their collection).
 * Add new customizable pieces here.
 */
export const CUSTOMIZE_ROUTES: Record<string, string> = {
  'sparkle-studs-silver': '/customize/sparkle-studs-silver',
  'sparkle-drops-silver': '/customize/sparkle-drops-silver',
  'paddle-pave-silver': '/customize/paddle-pave-silver',
};

export function getCustomizeRoute(productId: string): string | undefined {
  return CUSTOMIZE_ROUTES[productId];
}
