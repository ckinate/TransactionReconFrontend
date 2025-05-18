import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from '../account/login/login.component';
import { RegisterComponent } from '../account/register/register.component';
import { PermissionGuard } from '../shared/common/_guard/permission.guard';
import { UserComponent } from './Pages/user/user.component';
import { RoleComponent } from './Pages/role/role.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [PermissionGuard] },
   { 
      path: 'users', 
      component: UserComponent, 
      canActivate: [PermissionGuard],
      data: { permission: 'Users.View' }
  },
   { 
      path: 'roles', 
      component: RoleComponent, 
      canActivate: [PermissionGuard],
      data: { permission: 'Roles.View' }
    },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
