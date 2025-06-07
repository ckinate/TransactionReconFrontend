import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PermissionPipe } from '../../../shared/common/_pipes/permission.pipe';
import { PermissionAnyPipe } from '../../../shared/common/_pipes/permission-any.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BusyIfDirective } from '../../../shared/common/_directives/busy-if.directive';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalService } from '../../../shared/common/_services/modal/modal.service';
import { UserService } from '../../../shared/common/_services/user/user.service';
import { GetPaginatedUser, UserItem } from '../../../shared/interfaces/GetPaginatedUser';
import { GetPaginatedUserInput } from '../../../shared/interfaces/GetPaginatedUserInput';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { SpinnerService } from '../../../shared/common/_services/spinner/spinner.service';
import { EnhancedSpinnerService } from '../../../shared/common/_services/spinner/enhanced-spinner.service';
import { SpinnerModalComponent } from '../../components/spinner-modal/spinner-modal.component';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { GetUserDto } from '../../../shared/interfaces/GetUserDto';
import { CreateUser } from '../../../shared/interfaces/CreateUser';

@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterModule, FormsModule, PermissionPipe, PermissionAnyPipe, ModalModule, BsDropdownModule,TabsModule, SpinnerModalComponent,UserModalComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
   constructor(
      private userService: UserService,
     private modalService: ModalService,
      private spinnerService: EnhancedSpinnerService
  ) { }

   @ViewChild('userModalComponent') userModalComponent!:UserModalComponent;
  
   paginatedUserValues: GetPaginatedUser = {
      hasNextPage: false,
      hasPreviousPage: false,
      items: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 1,
      totalPages: 0
  }
  usersList: UserItem[] = []
  filterValue: string = "";
  loadingUsers: boolean = false;
  showModal: boolean = false;
   selectedUser: GetUserDto | null = null;
    modalLoading = false;

  ngOnInit(): void {
   this.getUsers()
  }

  getUsers() {
  
      this.spinnerService.show('Loading users...');
      this.loadingUsers = true;
      let input: GetPaginatedUserInput = {
        filter: this.filterValue,
        pageIndex: this.paginatedUserValues.pageIndex,
        pageSize: this.paginatedUserValues.pageSize
      }
      this.userService.paginatedUsers(input).subscribe(
        {
          next: (response) => {
            this.usersList = response.items;
            console.log(`The roles is ${JSON.stringify(response.items)}`)
            this.paginatedUserValues = response;
           
            this.loadingUsers = false;
            this.spinnerService.hide();
          },
          error: (err: any) => {
            this.loadingUsers = false;
           this.spinnerService.hide();
            console.log(`The errors is ${err}`);
          }
        }
      )
  }
  
   onChange() {
    if (this.filterValue.length <= 0) {
      this.getUsers();
    }
  }


   refresh() {
    this.getUsers();
  }

  previousPage() {
    this.paginatedUserValues.pageIndex = Number(this.paginatedUserValues.pageIndex) - 1;
   this.getUsers();
  }

  nextPage() {
    this.paginatedUserValues.pageIndex = Number(this.paginatedUserValues.pageIndex) + 1;
    this.getUsers();
  }

  changeSize(num: number) {
    this.paginatedUserValues.pageSize = num;
    this.paginatedUserValues.pageIndex = 1;
    this.getUsers();
  }

  editUser(user:UserItem){
    this.modalLoading = true;

  }

  delete(userId: string) {
    
  }

    openCreateModal() {
    this.selectedUser = null;
    this.showModal = true;
     this.userModalComponent.showModal();
  }


  closeModal() {
  this.showModal = false;
    this.selectedUser = null;
    this.userModalComponent.Close();
    
  }

  saveUser(userData:CreateUser){

  }

}
