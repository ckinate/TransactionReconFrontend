// Debug role.component.ts - Enhanced with better debugging
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../../shared/common/_services/role/role.service';
import { GetPaginatedRole, RoleItem } from '../../../shared/interfaces/GetPaginatedRole';
import { GetPaginatedRoleInput } from '../../../shared/interfaces/GetPaginatedRoleInput';
import { FormsModule } from '@angular/forms';
import { PermissionPipe } from '../../../shared/common/_pipes/permission.pipe';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { BusyIfDirective } from '../../../shared/common/_directives/busy-if.directive';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PermissionAnyPipe } from '../../../shared/common/_pipes/permission-any.pipe';
import { RoleDto } from '../../../shared/interfaces/RoleDto';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PermissionComponent } from '../permission/permission.component';
import { RoleModalComponent } from '../role-modal/role-modal.component';
import { PermissionNode } from '../../../shared/interfaces/PermissionNode';

@Component({
  selector: 'app-role',
  imports: [CommonModule, RouterModule, FormsModule, PermissionPipe, PermissionAnyPipe, ModalModule, BusyIfDirective, BsDropdownModule,
    TabsModule, RoleModalComponent
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit, AfterViewInit {
  @ViewChild('createModal', { static: true }) createModal!: ModalDirective;
  @ViewChild('permissionComponent') permissionComponent!: PermissionComponent;
  @ViewChild('editModal', { static: true }) editModal!: ModalDirective;
    @ViewChild('roleModalComponent') roleModalComponent!: RoleModalComponent;

  constructor(
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) { }

  paginatedRoleValues: GetPaginatedRole = {
    hasNextPage: false,
    hasPreviousPage: false,
    items: [],
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
    totalPages: 0
  }
  rolesList: RoleItem[] = [];
  isLoadingRoles: boolean = false;
   filteredRoles: RoleItem[] = [];
  permissionNodes: PermissionNode[] = [];
   modalLoading = false;
  filterValue: string = "";
  createRole: RoleDto = new RoleDto();
  roleId: string = "";
  isEditMode: boolean = false;
 

    // Modal states
  showModal = false;
  selectedRole: RoleItem | null = null;
  showDeleteModal = false;
  roleToDelete: RoleItem | null = null;

  ngOnInit(): void {
    this.getRoles();
     this.loadPermissions();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getRoles() {
    this.isLoadingRoles = true;
    let input: GetPaginatedRoleInput = {
      filter: this.filterValue,
      pageIndex: this.paginatedRoleValues.pageIndex,
      pageSize: this.paginatedRoleValues.pageSize
    }
    this.roleService.paginatedRoles(input).subscribe(
      {
        next: (response) => {
          this.rolesList = response.items;
          console.log(`The roles is ${JSON.stringify(response.items)}`)
          this.paginatedRoleValues = response;
          response.items.map(x => x.id)
          this.isLoadingRoles = false;
        },
        error: (err: any) => {
          this.isLoadingRoles = false;
          console.log(`The errors is ${err}`);
        }
      }
    )
  }
   loadPermissions() {
    this.roleService.getPermissionsTree().subscribe({
      next: (permissions) => {
        this.permissionNodes = permissions;
      },
      error: (error) => {
        console.error('Error loading permissions:', error);
      }
    });
  }

  onChange() {
    if (this.filterValue.length <= 0) {
      this.getRoles();
    }
  }
   editRole(role: RoleItem) {
    this.modalLoading = true;
   // this.openDropdownId = null;

    
    // Load the full role data with permissions
    this.roleService.getRole(role.id).subscribe({
      next: (fullRole) => {
         this.selectedRole = {
           id: '',
            name: '',
             description: '',
             rolePermissions: []
           };
        console.log(`The role at edit is ${JSON.stringify(fullRole)}`);
         this.selectedRole = {
           ...fullRole,
            rolePermissions: fullRole.permissions
          };
        this.showModal = true;
        this.roleModalComponent.showModal();
        this.modalLoading = false;
      },
      error: (error) => {
        console.error('Error loading role details:', error);
        this.modalLoading = false;
        // You might want to show a toast notification here
      }
    });
  }

  openCreateModal() {
    this.selectedRole = null;
    this.showModal = true;
     this.roleModalComponent.showModal();
  }


  closeModal() {
  this.showModal = false;
    this.selectedRole = null;
    this.roleModalComponent.Close();
    
  }

 

  closeEditModal() {
    console.log('❌ Closing edit modal');
    this.editModal.hide();
    this.resetForm();
  }

  resetForm() {
    console.log('🔄 Resetting form');
    this.roleId = "";
    this.isEditMode = false;
  
    this.createRole = new RoleDto();
  }

  

  refresh() {
    this.getRoles();
  }

  previousPage() {
    this.paginatedRoleValues.pageIndex = Number(this.paginatedRoleValues.pageIndex) - 1;
    this.getRoles();
  }

  nextPage() {
    this.paginatedRoleValues.pageIndex = Number(this.paginatedRoleValues.pageIndex) + 1;
    this.getRoles();
  }

  changeSize(num: number) {
    this.paginatedRoleValues.pageSize = num;
    this.paginatedRoleValues.pageIndex = 1;
    this.getRoles();
  }

 

 

  saveRole(roleData: { name: string; description?: string; permissions: string[] }) {
    this.modalLoading = true;

    const request = {
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions
    };

    console.log(`The role Permission is ${JSON.stringify(roleData.permissions)}`)

    // const operation = this.selectedRole 
    //   ? this.roleService.updateRole({ ...request, id: this.selectedRole.id } as UpdateRoleRequest)
    //   : this.roleService.createRole(request as CreateRoleRequest);

    // operation.subscribe({
    //   next: () => {
    //     this.modalLoading = false;
    //     this.closeModal();
    //     this. getRoles();
       
    //   },
    //   error: (error) => {
    //     console.error('Error saving role:', error);
    //     this.modalLoading = false;
      
    //   }
    // });
  }

 
}