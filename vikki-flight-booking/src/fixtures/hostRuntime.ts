// Host runtime fixture — stand-in for galaxy-g-web-host-app props
export interface HostRuntime {
  id: { id: string; name: string };
  theme: 'light' | 'dark';
  locale: string;
}

export const FIXTURE_HOST_RUNTIME: HostRuntime = {
  id: { id: 'user_001', name: 'Ngô Minh Hải' },
  theme: 'light',
  locale: 'vi',
};
