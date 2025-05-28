import { Component, Input, input, OnInit, SimpleChanges } from '@angular/core';
import { RoleService } from '../../../shared/common/_services/role/role.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionNode } from '../../../shared/interfaces/PermissionNode';

@Component({
  selector: 'app-permission',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit {
  constructor(private roleService: RoleService) { }
  //permissionTree: PermissionNode[] = [];

   private _permissionTree: PermissionNode[] = [];
  searchControl = new FormControl('');
  @Input() roleId: string = '';
  loading = false;

   // Getter/setter to track when permissionTree is accessed or modified
  get permissionTree(): PermissionNode[] {
    return this._permissionTree;
  }

  set permissionTree(value: PermissionNode[]) {
    console.log('🔄 permissionTree setter called with', value.length, 'nodes');
    console.trace('📍 Stack trace for permissionTree assignment:');
    this._permissionTree = value;
  }

  ngOnInit(): void {
     console.log('🚀 ngOnInit() called');
    this.loadPermissions();
  }

  // ngOnChanges(changes: SimpleChanges): void {
   
  //   if (changes['roleId'] && changes['roleId'].currentValue) {
  //     this.loadPermissions();
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('🔄 ngOnChanges() called with changes:', changes);
    if (changes['roleId']) {
      console.log('🔑 roleId changed from', changes['roleId'].previousValue, 'to', changes['roleId'].currentValue);
      if (changes['roleId'].currentValue) {
        this.loadPermissions();
      }
    }
  }

  loadPermissions(): void {
     console.log('🔄 loadPermissions() called - Start');
    console.log('📋 Current roleId:', this.roleId);
    console.log('📊 Current tree state before loading:', this.permissionTree.length, 'nodes');
    this.loading = true;
   // this.roleId = roleId;
    console.log(`The role ID inside loadPermission is ${this.roleId}`);

    // Get permission tree
    this.roleService.getPermissionsTree().subscribe(tree => {
         console.log('🌳 Received tree from service:', tree);
      // Initialize the tree state first
      this.permissionTree = this.initializeTreeState(tree);
        console.log('✅ Tree initialized, nodes:', this.permissionTree.length);

      // If we have a role ID, get its permissions and apply them
      if (this.roleId) {
        console.log(`The role ID is ${this.roleId}`);
        this.roleService.getRole(this.roleId).subscribe(role => {
           console.log('👤 Received role data:', role);
          console.log('🔐 Role permissions:', role.permissions);
          // Apply permissions to the already initialized tree
          this.applyPermissionsToTree(this.permissionTree, role.permissions);

             console.log('✅ Permissions applied to tree');
          console.log('📊 Final tree state:', this.permissionTree);
          
          // Debug: Log the tree state after applying permissions
          console.log('Permission tree after applying permissions:', this.permissionTree);
          console.log('Selected permissions after loading:', this.selectedPermission());
          
          this.loading = false;
            console.log('🔄 loadPermissions() completed with roleId');
        });
      } else {
         console.log('ℹ️ No roleId provided, using empty permissions');
        this.loading = false;
         console.log('🔄 loadPermissions() completed without roleId');
      }
    });
  }

  // Initialize tree state with collapsed groups - FIXED VERSION
  initializeTreeState(nodes: PermissionNode[]): PermissionNode[] {
    console.log('🏗️ initializeTreeState() called with', nodes.length, 'nodes');
    
    const result = nodes.map(node => {
      const newNode = { ...node };
      newNode.expanded = false; // Start collapsed
      newNode.checked = false; // Initialize as unchecked
      newNode.indeterminate = false; // Initialize indeterminate state
      
      if (newNode.children) {
        newNode.children = this.initializeTreeState(newNode.children);
      }
      
      return newNode;
    });
    
    console.log('✅ Tree initialized with', result.length, 'root nodes');
    return result;
  }

  // Toggle expanded state of group nodes
  toggleExpanded(node: PermissionNode): void {
    if (node.isGroup) {
      node.expanded = !node.expanded;
    }
  }

  // FIXED: Recursively apply selected permissions to tree
  applyPermissionsToTree(nodes: PermissionNode[], selectedPermissions: string[]): void {
    nodes.forEach(node => {
      if (node.isGroup && node.children) {
        // First apply to children
        this.applyPermissionsToTree(node.children, selectedPermissions);
        
        // Then set group state based on children
        const allChecked = node.children.every(child => child.checked);
        const someChecked = node.children.some(child => child.checked || child.indeterminate);
        
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
    
    // Debug: Log current selections after toggle
    console.log('Current selections after toggle:', this.selectedPermission());
  }

  // FIXED: Collect all selected permission keys
  collectSelectedPermissions(nodes: PermissionNode[]): string[] {
    let permissions: string[] = [];
    
    nodes.forEach(node => {
      if (node.isGroup && node.children) {
        // Recursively collect from children
        permissions = [...permissions, ...this.collectSelectedPermissions(node.children)];
      } else if (!node.isGroup && node.checked) {
        // Only collect from leaf nodes that are checked
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

  selectedPermission(): string[] {

     console.log('🎯 selectedPermission() called');
    console.log('📊 Current tree length:', this.permissionTree.length);
    console.log('🌳 Tree state summary:');

     // Quick summary of tree state
    this.permissionTree.forEach(node => {
      if (node.isGroup && node.children) {
        const checkedChildren = node.children.filter(child => child.checked).length;
        console.log(`  📁 ${node.name}: ${checkedChildren}/${node.children.length} children checked`);
      }
    });
      console.log(`The Permission Tree inside selected Permission is ${JSON.stringify(this.permissionTree)}`)
    const selectedPermissions = this.collectSelectedPermissions(this.permissionTree);
    console.log('✅ Final selected permissions:', selectedPermissions);
    return selectedPermissions;
  }

  // Save permissions
  savePermissions(): void {
    const selectedPermissions = this.collectSelectedPermissions(this.permissionTree);
    console.log('Saving permissions:', selectedPermissions);
    
    // Uncomment when ready to save
    // this.permissionService.saveRolePermissions({
    //   roleId: this.roleId,
    //   permissionKeys: selectedPermissions
    // }).subscribe(() => {
    //   alert('Permissions saved successfully');
    // }, error => {
    //   console.error('Error saving permissions', error);
    //   alert('Error saving permissions');
    // });
  }
}