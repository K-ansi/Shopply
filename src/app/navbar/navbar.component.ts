import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [AuthService],
})
export class NavbarComponent implements OnInit {
  user$ = this.authService.user$;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user$.subscribe((user) => {
      console.log('User changed:', user);
    });
  }

  logout() {
    this.authService.logout().pipe(
      tap(() => {
        this.router.navigate(['/login']);
      })
    ).subscribe();
  }
}