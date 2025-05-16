import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';

@Pipe({
  name: 'permission'
})
export class PermissionPipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  transform(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

}
