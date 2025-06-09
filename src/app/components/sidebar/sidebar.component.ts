import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../../../shared/interfaces/MenuItem';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/common/_services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

   allMenuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: 'fa-tachometer-alt',
      route: '/dashboard',
      isCollapsed: true,
      subItems: []
    },
   
    {
      name: 'Setup',
      icon: 'fa-cog',
      route: '/setup',
      isCollapsed: true,
      permission: '',
      subItems: [
        { name: 'Bank', icon: 'fa-box', route: '/payments', isCollapsed: true },
        { name: 'Bank Account', icon: 'fa-money-bill', route: '/payments', isCollapsed: true }
      ]
    },
    {
      name: 'Administration',
      icon: 'fa-users',
      route: '/users',
      isCollapsed: true,
      permission: 'Users.View',
      subItems: [
        { name: 'Users', icon: 'fa-user', route: '/users', isCollapsed: true, permission: 'Users.View'},
        { name: 'Roles', icon: 'fa-file-invoice', route: '/roles', isCollapsed: true,permission: 'Roles.View' },
        { name: 'Payments', icon: 'fa-money-bill', route: '/payments', isCollapsed: true },
        { name: 'Verify Online Payments', icon: 'fa-check-circle', route: '/verify-online-payments', isCollapsed: true },
        { name: 'Customer Edit Request', icon: 'fa-edit', route: '/customer-edit-request', isCollapsed: true }
      
      ]
    },
    {
      name: 'Legal',
      icon: 'fa-balance-scale',
      route: '/legal',
      isCollapsed: true,
      subItems: [
        { name: 'Legal', icon: 'fa-gavel', route: '/legal', isCollapsed: true },
        { name: 'RM Signatories', icon: 'fa-signature', route: '/rm-signatories', isCollapsed: true }
      ]
    }
  ];
   menuItems: MenuItem[] = [];

   constructor(private authService: AuthService) {}

  ngOnInit(): void {
   this.filterMenuItems();
  }

  toggleSubMenu(item: MenuItem): void {
    item.isCollapsed = !item.isCollapsed;
  }

   filterMenuItems(): void {
    // Filter main menu items
    this.menuItems = this.allMenuItems.filter(item => {
      // Items with no permission or empty string permission are always visible
      if (!item.permission || item.permission === '') {
        // For items with subItems, filter those subItems based on permissions
        if (item.subItems && item.subItems.length > 0) {
          item.subItems = item.subItems.filter(subItem => {
            // If subItem has a permission, check if user has that permission
            if (subItem.permission && subItem.permission !== '') {
              return this.authService.hasPermission(subItem.permission);
            }
            // SubItems with no permission or empty permission are always visible
            return true;
          });
        }
        // Always show the main item, even if it has no visible subitems
        return true;
      }
      
      // Otherwise check if user has permission for this main item
      if (!this.authService.hasPermission(item.permission)) {
        return false;
      }

      // If the item has subitems, filter those too
      if (item.subItems && item.subItems.length > 0) {
        // Filter subitems based on permissions
        item.subItems = item.subItems.filter(subItem => {
          // If subItem has a permission, check if user has that permission
          if (subItem.permission && subItem.permission !== '') {
            return this.authService.hasPermission(subItem.permission);
          }
          // SubItems with no permission or empty permission are always visible
          return true;
        });
        
        // If no subitems are left after filtering, check if the parent should still be shown
        if (item.subItems.length === 0) {
          // If the main item has its own route, it can still be shown without subitems
          return item.route && item.route !== '';
        }
      }
      
      return true;
    });
  }

}
