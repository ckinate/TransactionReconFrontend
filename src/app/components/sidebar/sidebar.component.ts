import { Component } from '@angular/core';
import { MenuItem } from '../../../shared/interfaces/MenuItem';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
   menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: 'fa-tachometer-alt',
      route: '/dashboard',
      isCollapsed: true,
      subItems: []
    },
    {
      name: 'Customer Trend Analysis',
      icon: 'fa-chart-line',
      route: '/customer-trend-analysis',
      isCollapsed: true,
      permission: 'Pages.CustomerTrendAnalysis',
      subItems: []
    },
    {
      name: 'Setup',
      icon: 'fa-cog',
      route: '/setup',
      isCollapsed: true,
      permission: 'Pages.Setup',
      subItems: []
    },
    {
      name: 'Customer',
      icon: 'fa-users',
      route: '/customer',
      isCollapsed: true,
      permission: 'Pages.Customer',
      subItems: [
        { name: 'Customers', icon: 'fa-user', route: '/customers', isCollapsed: true, permission: 'Pages.Customer.Management'},
        { name: 'Invoice', icon: 'fa-file-invoice', route: '/invoice', isCollapsed: true },
        { name: 'Payments', icon: 'fa-money-bill', route: '/payments', isCollapsed: true },
        { name: 'Verify Online Payments', icon: 'fa-check-circle', route: '/verify-online-payments', isCollapsed: true },
        { name: 'Customer Edit Request', icon: 'fa-edit', route: '/customer-edit-request', isCollapsed: true },
        { name: 'Products', icon: 'fa-box', route: '/products', isCollapsed: true }
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

  toggleSubMenu(item: MenuItem): void {
    item.isCollapsed = !item.isCollapsed;
  }

}
