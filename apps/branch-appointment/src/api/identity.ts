// Platform capability bridge — host identity

export interface CustomerIdentity {
  customerId: string;
}

export async function getCustomerId(): Promise<CustomerIdentity> {
  // Attempt to use the host SDK bridge
  try {
    const hostSdk = (window as Record<string, unknown>)['__HOST_SDK__'] as
      | { identity?: { getCustomerId?: () => Promise<CustomerIdentity> } }
      | undefined;

    if (hostSdk?.identity?.getCustomerId) {
      const result = await hostSdk.identity.getCustomerId();
      if (result && typeof result.customerId === 'string' && result.customerId.length > 0) {
        return result;
      }
    }
  } catch {
    // capability not available — fall through to fixture
  }

  // Fallback: fixture customer ID for development
  return { customerId: 'fixture-customer-001' };
}
