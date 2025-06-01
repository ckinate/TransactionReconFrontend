import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { PermissionComponent } from '../permission/permission.component';
import { PermissionNode } from '../../../shared/interfaces/PermissionNode';
import { RoleItem } from '../../../shared/interfaces/GetPaginatedRole';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RoleDto } from '../../../shared/interfaces/RoleDto';

@Component({
  selector: 'role-modal',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,ModalModule,TabsModule,PermissionComponent],
  templateUrl: './role-modal.component.html',
  styleUrl: './role-modal.component.css'
})
export class RoleModalComponent implements OnInit, OnChanges {
     constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }
  @Input() visible = false; 
  @Input() role: RoleItem | null = null;
  @Input() permissionNodes: PermissionNode[] = [];
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ name: string; description?: string; permissions: string[] }>();
   @ViewChild('createModal', { static: true }) createModal!: ModalDirective;

  roleForm!: FormGroup;
  selectedPermissions: string[] = [];
  isEditMode = false;
   createRole: RoleDto = new RoleDto();

  ngOnInit() {
    this.setupForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['role'] || changes['visible']) {
      this.setupForm();
    }
  }

   private setupForm() {
    this.isEditMode = !!this.role;
    
    if (this.role) {
      this.roleForm.patchValue({
        name: this.role.name,
        description: this.role.description || ''
      });
      this.selectedPermissions = [...(this.role.rolePermissions || [])];
    } else {
      this.roleForm.reset();
      this.selectedPermissions = [];
    }
  }

  onPermissionsChange(permissions: string[]) {
    this.selectedPermissions = permissions;
  }

  onSubmit() {
    
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;
      this.save.emit({
        name: formValue.name.trim(),
        description: formValue.description,
        permissions: this.selectedPermissions
      });
    }
  }

  Close() {
    this.createModal.hide();
  }
  showModal(){
    this.createModal.show();
  }
 
}
