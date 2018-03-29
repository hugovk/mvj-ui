/**
 * Contact type enumerable.
 *
 * @type {{TENANT: string, BILLING: string, CONTACT: string}}
 */
export const TenantContactType = {
  TENANT: 'tenant',
  BILLING: 'billing',
  CONTACT: 'contact',
};

/**
 * Constructability type enumerable.
 *
 * @type {{PRECONSTRUCTION: string, DEMOLITION: string, POLLLUTED_LAND: string, REPORT: string, OTHER: string}}
 */
export const ConstructabilityType = {
  PRECONSTRUCTION: 'preconstruction',
  DEMOLITION: 'demolition',
  POLLUTED_LAND: 'polluted_land',
  REPORT: 'report',
  OTHER: 'other',
};

/**
 * Constructability status enumerable.
 *
 * @type {{UNVERIFIED: string, REQUIRES_MEASURES: string, COMPLETE: string,}}
 */
export const ConstructabilityStatus = {
  UNVERIFIED: 'unverified',
  REQUIRES_MEASURES: 'requires_measures',
  COMPLETE: 'complete',
};