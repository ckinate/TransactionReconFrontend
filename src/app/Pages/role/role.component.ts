import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-role',
  imports: [CommonModule, RouterModule, FormsModule, PermissionPipe, PermissionAnyPipe, ModalModule, BusyIfDirective, BsDropdownModule,
    TabsModule
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit{
   @ViewChild('createModal', {static: true}) createModal!: ModalDirective;

  constructor(private roleService: RoleService) { }
  paginatedRoleValues: GetPaginatedRole ={
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
  filterValue: string = "";
  createRole: RoleDto = new RoleDto();
  
  ngOnInit(): void {
    this.getRoles();
  // this.createRole.description
  }
  getRoles() {
    this.isLoadingRoles = true;
    let input: GetPaginatedRoleInput = {
      filter: this.filterValue,
      pageIndex: this.paginatedRoleValues.pageIndex,
      pageSize:this.paginatedRoleValues.pageSize
    }
    this.roleService.paginatedRoles(input).subscribe(
      {
        next: (response) => {
          this.rolesList = response.items;
          console.log(`The roles is ${JSON.stringify(response.items)}`)
          this.paginatedRoleValues = response;
          this.isLoadingRoles = false;
        },
        error: (err: any) => {
          this.isLoadingRoles = false;
          console.log(`The errors is ${err}`);
        }
      }
    )
    
  }

   onChange() {
    if (this.filterValue.length <= 0) { 
      this.getRoles();
    }
   
  }
  openCreateModal() {
    this.createModal.show();
  }
  closeCreateModal() {
    this.createModal.hide();
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


}
