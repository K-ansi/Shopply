import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class CreateListComponent {
  listName: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const newList = {
      name: this.listName
    };

    this.http.post('/api/users/create-list', newList).subscribe(
      (response) => {
        console.log('List created successfully:', response);
        this.router.navigate(['/my-lists']);
      },
      (error) => {
        console.error('Error creating list:', error);
      }
    );
  }
}