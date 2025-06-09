import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/common/_services/auth/auth.service';
import { LoginRequest } from '../../shared/interfaces/LoginRequest';
import { finalize } from 'rxjs';
import { MessageModalService } from '../../shared/common/_services/modal/message-modal.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
   constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
     private authService: AuthService,
    private messageModalService: MessageModalService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }
 
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  returnUrl: string = '/';
   showPassword = false;
  showConfirmPassword = false;

   ngOnInit(): void {
       // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() { return this.loginForm.controls; }

    onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const loginRequest: LoginRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value,
      rememberMe: this.f['rememberMe'].value
    };

    this.authService.login(loginRequest)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          
           //  Force a navigation with a redirect to refresh the component tree
          // This will help ensure the layout updates properly
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.returnUrl]);
          });
        },
        error: error => {
          this.errorMessage = error.message;
           this.messageModalService.showError(
            'Unable to process your request.',
             'Error'
           );
        }
      });
  }

    togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
