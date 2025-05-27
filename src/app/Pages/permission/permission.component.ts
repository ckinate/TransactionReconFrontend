import { Component, Input, input, OnInit } from '@angular/core';
import { RoleService } from '../../../shared/common/_services/role/role.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionNode } from '../../../shared/interfaces/PermissionNode';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, RouterModule, FormsModule,ReactiveFormsModule],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit{
  constructor(private roleService: RoleService) { }
  permissionTree: PermissionNode[] = [];
  searchControl = new FormControl('');
  @Input()roleId: string = '';
  loading = false;

  ngOnInit(): void {
    this.loadPermissions();
  }

   loadPermissions(): void {
     this.loading = true;
      console.log(`The role ID inside loadPermission is ${this.roleId}`);
    
    // Get permission tree
    this.roleService.getPermissionsTree().subscribe(tree => {
      this.permissionTree = this.initializeTreeState(tree);
      
      // If we have a role ID, get its permissions
      if (this.roleId) {
        console.log(`The role ID is ${this.roleId}`);
        this.roleService.getRole(this.roleId).subscribe(role => {
          this.applyPermissionsToTree(this.permissionTree, role.permissions);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

  // Initialize tree state with collapsed groups
  initializeTreeState(nodes: PermissionNode[]): PermissionNode[] {
    return nodes.map(node => ({
      ...node,
      expanded: false, // Start collapsed
      children: node.children ? this.initializeTreeState(node.children) : node.children
    }));
  }

  // Toggle expanded state of group nodes
  toggleExpanded(node: PermissionNode): void {
    if (node.isGroup) {
      node.expanded = !node.expanded;
    }
  }

  // Recursively apply selected permissions to tree
  applyPermissionsToTree(nodes: PermissionNode[], selectedPermissions: string[]): void {
    nodes.forEach(node => {
      if (node.isGroup && node.children) {
        // Process group children
        this.applyPermissionsToTree(node.children, selectedPermissions);
        
        // Set group state based on children
        const allChecked = node.children.every(child => child.checked);
        const someChecked = node.children.some(child => child.checked);
        
        node.checked = allChecked;
        node.indeterminate = !allChecked && someChecked;
      } else {
        // Set checked state for leaf node
        node.checked = selectedPermissions.includes(node.key);
      }
    });
  }

  // Update states of parent nodes
  updateParentStates(nodes: PermissionNode[]): void {
    nodes.forEach(node => {
      if (node.isGroup && node.children && node.children.length > 0) {
        const allChecked = node.children.every(child => child.checked);
        const someChecked = node.children.some(child => child.checked || child.indeterminate);
        
        node.checked = allChecked;
        node.indeterminate = !allChecked && someChecked;
      }
    });
  }

  // Handle node check/uncheck
  toggleNode(node: PermissionNode, checked: boolean): void {
    node.checked = checked;
    node.indeterminate = false;
    
    // If it's a group, apply to all children
    if (node.isGroup && node.children) {
      node.children.forEach(child => {
        this.toggleNode(child, checked);
      });
    }
    
    // Update parent states
    this.updateParentStates(this.permissionTree);
  }

  // Collect all selected permission keys
  collectSelectedPermissions(nodes: PermissionNode[]): string[] {
    let permissions: string[] = [];
    
    nodes.forEach(node => {
      if (node.isGroup && node.children) {
        permissions = [...permissions, ...this.collectSelectedPermissions(node.children)];
      } else if (node.checked) {
        permissions.push(node.key);
      }
    });
    
    
    return permissions;
  }

  // Filter tree based on search input
  searchPermissions(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    // Implement search functionality here
  }

  // Refresh permissions
  refreshPermissions(): void {
    this.loadPermissions();
  }

  onCheckboxChange(event: Event, node: PermissionNode): void {
    const input = event.target as HTMLInputElement;
    this.toggleNode(node, input.checked);
  }

  selectedPermission():string[] {
    const selectedPermissions = this.collectSelectedPermissions(this.permissionTree);
    return selectedPermissions;
  }


   // Save permissions
  savePermissions(): void {
    const selectedPermissions = this.collectSelectedPermissions(this.permissionTree);
    
    // this.permissionService.saveRolePermissions({
    //   roleId: this.roleId,
    //   permissionKeys: selectedPermissions
    // }).subscribe(() => {
    //   // Handle success
    //   alert('Permissions saved successfully');
    // }, error => {
      
    //   console.error('Error saving permissions', error);
    //   alert('Error saving permissions');
    // });
  }


}
