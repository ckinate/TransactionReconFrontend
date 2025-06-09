import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
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

import { EnhancedSpinnerService } from '../../../shared/common/_services/spinner/enhanced-spinner.service';
import { SpinnerModalComponent } from '../../components/spinner-modal/spinner-modal.component';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { GetUserDto } from '../../../shared/interfaces/GetUserDto';
import { CreateUser } from '../../../shared/interfaces/CreateUser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserUpdateDto } from '../../../shared/interfaces/UserUpdateDto';

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

  @ViewChild('userModalComponent') userModalComponent!: UserModalComponent;
  
   private destroyRef = inject(DestroyRef);
  
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
    this.userService.getUser(user.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.selectedUser = res;
        console.log(`The selected user Id is ${JSON.stringify(this.selectedUser)}`)
          this.showModal = true;
        this.userModalComponent.showModal();
        this.modalLoading = false
      },
      error: (error) => {
         this.modalLoading = false
      }
    })

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
    this.selectedUser =null;
    this.userModalComponent.Close();
    
  }

  saveUser(userData: CreateUser) {
    this.modalLoading = false;
    console.log(`The user to be created is ${JSON.stringify(userData)}`)
     this.modalService.openConfirmationModal({
     title: 'Save Role',
     message: 'Are you sure you want proceed?',
     confirmText: 'Save',
    cancelText: 'Cancel',
     }).subscribe(confirmed => {
       if (confirmed) {
         this.modalLoading = true;
        
         let userUpdateDto = new UserUpdateDto();
         userUpdateDto.firstName = userData.firstName;
         userUpdateDto.isActive = this.selectedUser ? this.selectedUser.isActive: false;
         userUpdateDto.lastName = userData.lastName;
         userUpdateDto.role = userData.role;
         
         const operation = this.selectedUser ? this.userService.updateUser(this.selectedUser.id, userUpdateDto)
           : this.userService.createUser(userData);
         
         operation.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
           next: () => {
              this.modalLoading = false;
              this.closeModal();
              this.getUsers();
            this.modalService.openSuccessModal(
             `User  has been saved successfully.`,
             'User Saved'
             ).subscribe();
           },
           error: (error) => {
                 this.modalService.openErrorModal(
               `${error}`,
               'User Error'
              ).subscribe();
              this.modalLoading = false;
           }
         })
     }
   })


  }

}
