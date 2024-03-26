import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  private authChangedSubject = new Subject<boolean>();
  authChanged$ = this.authChangedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuth().subscribe(
      (response: any) => {
        if (response.authenticated) {
          this.setUser(response.user);
        }
      },
      (error) => {
        console.error('Error checking authentication:', error);
      }
    );
  }

  checkAuth() {
    return this.http.get('/api/users/check-auth');
  }

  setUser(user: any) {
    console.log('Setting user:', user);
    this.userSubject.next(user);
    console.log('Emitting authChanged:', true);
    this.authChangedSubject.next(true);
  }

  logout() {
    return this.http.post('/api/users/logout', {}).pipe(
      tap(() => {
        console.log('Logout successful');
        this.userSubject.next(null);
        console.log('Emitting authChanged:', false);
        this.authChangedSubject.next(false);
      })
    );
  }
}