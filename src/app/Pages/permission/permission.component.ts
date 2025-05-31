// Fixed permission.component.ts - Debug version to identify the reset issue
import { Component, Input, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
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

  private _permissionTree: PermissionNode[] = [];
  searchControl = new FormControl('');
  // @Input() roleId: string = '';
  // @Output() permissionsLoaded = new EventEmitter<void>();
  loading = false;
  private isInitialized = false;
  private lastRoleId: string = '';

  @Input() permissionNodes: PermissionNode[] = [];
  @Input() selectedPermissions: string[] = [];
  @Output() permissionsChange = new EventEmitter<string[]>();

  ngOnInit(): void {
     this.initializeExpandedState();
    this.updateCheckStates();
  }
   ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPermissions'] || changes['permissionNodes']) {
      this.updateCheckStates();
    }
  }
   private initializeExpandedState() {
    this.permissionNodes.forEach(node => {
      if (node.isGroup) {
        node.expanded = true; // Default to expanded
      }
    });
  }
   private updateCheckStates() {
    this.permissionNodes.forEach(node => {
      if (node.isGroup && node.children) {
        this.updateGroupCheckState(node);
      } else {
        node.checked = this.selectedPermissions.includes(node.key);
      }
    });
  }
   private updateGroupCheckState(groupNode: PermissionNode) {
    if (!groupNode.children) return;

    // Update children first
    groupNode.children.forEach(child => {
      child.checked = this.selectedPermissions.includes(child.key);
    });

    // Update group state based on children
    const checkedChildren = groupNode.children.filter(child => child.checked).length;
    const totalChildren = groupNode.children.length;

    if (checkedChildren === 0) {
      groupNode.checked = false;
      groupNode.indeterminate = false;
    } else if (checkedChildren === totalChildren) {
      groupNode.checked = true;
      groupNode.indeterminate = false;
    } else {
      groupNode.checked = false;
      groupNode.indeterminate = true;
    }
  }

  onNodeChange(node: PermissionNode, event: any) {
    const isChecked = event.target.checked;

    if (node.isGroup && node.children) {
      // Handle group selection - select/deselect all children
      node.children.forEach(child => {
        child.checked = isChecked;
        this.updateSelectedPermissions(child.key, isChecked);
      });
      node.checked = isChecked;
      node.indeterminate = false;
    } else {
      // Handle individual node selection
      node.checked = isChecked;
      this.updateSelectedPermissions(node.key, isChecked);

      // Update parent group state if this is a child node
      const parentGroup = this.findParentGroup(node);
      if (parentGroup) {
        this.updateGroupCheckState(parentGroup);
      }
    }

    this.emitPermissionsChange();
  }

   private findParentGroup(childNode: PermissionNode): PermissionNode | null {
    for (const node of this.permissionNodes) {
      if (node.isGroup && node.children?.includes(childNode)) {
        return node;
      }
    }
    return null;
  }

  private updateSelectedPermissions(key: string, isSelected: boolean) {
    if (isSelected && !this.selectedPermissions.includes(key)) {
      this.selectedPermissions.push(key);
    } else if (!isSelected) {
      const index = this.selectedPermissions.indexOf(key);
      if (index > -1) {
        this.selectedPermissions.splice(index, 1);
      }
    }
  }

    toggleExpand(node: PermissionNode) {
    node.expanded = !node.expanded;
  }

  private emitPermissionsChange() {
    this.permissionsChange.emit([...this.selectedPermissions]);
  }

 

  
}