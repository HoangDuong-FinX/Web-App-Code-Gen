interface HostIdentity {
  firstName?: string;
  lastName?: string;
}

interface HostRuntime {
  identity?: HostIdentity;
}

function getHostRuntime(): HostRuntime | null {
  const win = window as unknown as { hostRuntime?: HostRuntime };
  return win.hostRuntime ?? null;
}

export function getIdentity(): { firstName: string; lastName: string } | null {
  const runtime = getHostRuntime();
  if (!runtime?.identity?.firstName || !runtime?.identity?.lastName) {
    return null;
  }
  return {
    firstName: runtime.identity.firstName,
    lastName: runtime.identity.lastName,
  };
}
