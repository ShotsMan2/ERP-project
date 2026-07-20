import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

export function usePermission() {
  const permissions = useAuthStore((state) => state.permissions);

  const can = useCallback(
    (module: string, action: string) => {
      return permissions.includes(`${module}.${action}`);
    },
    [permissions]
  );

  const canAny = useCallback(
    (checks: [string, string][]) => {
      return checks.some(([module, action]) => permissions.includes(`${module}.${action}`));
    },
    [permissions]
  );

  const canAll = useCallback(
    (checks: [string, string][]) => {
      return checks.every(([module, action]) => permissions.includes(`${module}.${action}`));
    },
    [permissions]
  );

  return { can, canAny, canAll, permissions };
}
