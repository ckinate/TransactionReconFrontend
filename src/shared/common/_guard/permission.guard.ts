import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth/auth.service';

export const PermissionGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredPermission = route.data['permission'];
  const requiredPermissions = route.data['permissions'];
  const requiredRole = route.data['role'];

  // Check if user is logged in
  if (!authService.isLoggedIn) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  // Check single permission
  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    return router.createUrlTree(['/unauthorized']);
  }

  // Check multiple permissions (if ANY is required)
  if (requiredPermissions?.any && !authService.hasAnyPermission(requiredPermissions.any)) {
    return router.createUrlTree(['/unauthorized']);
  }

  // Check multiple permissions (if ALL are required)
  if (requiredPermissions?.all && !authService.hasAllPermissions(requiredPermissions.all)) {
    return router.createUrlTree(['/unauthorized']);
  }

  // Check role
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return router.createUrlTree(['/unauthorized']);
  }



  return true;
};
