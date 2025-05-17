import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from '../shared/common/_services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SidebarComponent,HeaderComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,OnDestroy {
  isAuthenticated = false;
   private authSubscription?: Subscription;
  constructor(private authService: AuthService) { 
     this.isAuthenticated = this.authService.isLoggedIn;
  }


  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(auth => {
      this.isAuthenticated = !!auth;
    })
  }
    ngOnDestroy(): void {
     // Clean up subscription when component is destroyed
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
