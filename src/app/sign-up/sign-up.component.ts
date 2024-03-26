import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule, NgIf],
  providers: [AuthService],
})
export class SignUpComponent {
  name: string | undefined;
  email: string | undefined;
  username: string | undefined;
  confirmEmail: string | undefined;
  password: string | undefined;
  emailInUseError: boolean = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (this.email !== this.confirmEmail) {
      return;
    }

    const userData = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.http.post('/api/users/sign-up', userData)
      .subscribe(
        (response: any) => {
          console.log('Registration successful:', response);
          this.emailInUseError = false;
          this.authService.setUser(response);
          this.router.navigate(['/home']);
        },
        (error: any) => {
          console.error('Registration failed:', error);
          if (error.error.message === 'Email already in use') {
            this.emailInUseError = true;
            this.resetForm();
          }
        }
      );
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.confirmEmail = '';
    this.password = '';
  }
}