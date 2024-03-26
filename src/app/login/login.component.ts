import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, NgIf],
  providers: [AuthService],
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;
  loginError: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('/api/users/login', loginData)
      .subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          this.loginError = false;
          this.authService.setUser(response.user);
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('Login failed:', error);
          this.loginError = true;
          this.password = '';
        }
      );
  }
}