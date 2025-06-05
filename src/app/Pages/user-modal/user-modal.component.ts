import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UserItem } from '../../../shared/interfaces/GetPaginatedUser';
import { CreateUser } from '../../../shared/interfaces/CreateUser';
import { NgSelectModule } from '@ng-select/ng-select';
import { RoleDto } from '../../../shared/interfaces/RoleDto';

@Component({
  selector: 'app-user-modal',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,ModalModule,TabsModule, NgSelectModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
  
export class UserModalComponent implements OnInit, OnChanges {
  
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      userName:['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['']
    },
       {
       validators: [this.passwordMatchValidator]
    }
    );
  }
 

  @ViewChild('createModal', { static: true }) createModal!: ModalDirective;

  @Input() visible = false; 
  @Input() user: UserItem | null = null;
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateUser>();

   userForm!: FormGroup;
  isEditMode = false;
  createUser: CreateUser = new CreateUser();
  showPassword = false;
  showConfirmPassword = false;
  roleList: RoleDto[]=[]
  

    ngOnInit(): void {
     this.setupForm();
  }
    ngOnChanges(changes: SimpleChanges): void {
     if (changes['user'] || changes['visible']) {
      this.setupForm();
    }
  }

   // Custom validator to check if passwords match
  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
  const password = formGroup.get('password')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
  } else {
    const confirmControl = formGroup.get('confirmPassword');
    if (confirmControl?.errors) {
      const errors = { ...confirmControl.errors };
      delete errors['passwordMismatch'];
      confirmControl.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  return null;
  };
  
   private setupForm() {
    this.isEditMode = !!this.user;
    
    if (this.user) {
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        userName: this.user.userName ,
        email: this.user.email,
        password: '',
        confirmPassword: '',
        role:this.user.role
      });
     
    } else {
      this.userForm.reset();
      
    }
  }

   onSubmit() {
    
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      let createUser: CreateUser = new CreateUser()
      createUser = { ...formValue };
      this.save.emit(createUser);
    }
  }

  Close() {
    this.createModal.hide();
  }
  showModal(){
    this.createModal.show();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
