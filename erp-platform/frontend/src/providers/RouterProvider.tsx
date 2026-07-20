import { useRoutes } from 'react-router-dom';
import { routes } from '@/routes';

export function RouterProvider() {
  return useRoutes(routes);
}
