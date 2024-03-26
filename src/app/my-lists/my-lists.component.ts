import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';
import { ListDetailsComponent } from '../list-details/list-details.component';

@Component({
  selector: 'app-my-lists',
  templateUrl: './my-lists.component.html',
  styleUrls: ['./my-lists.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, ListDetailsComponent]
})
export class MyListsComponent implements OnInit {
  lists: any[] = [];
  selectedLists: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>('/api/users/my-lists').subscribe(
      (lists) => {
        this.lists = lists;
      },
      (error) => {
        console.error('Error fetching lists:', error);
      }
    );
  }

  createNewList() {
    this.router.navigate(['/create-list']);
  }

  selectList(list: any) {
    if (!this.isListSelected(list)) {
      this.selectedLists.push(list);
    }
  }

  closeList(list: any) {
    const index = this.selectedLists.findIndex(selectedList => selectedList._id === list._id);
    if (index !== -1) {
      this.selectedLists.splice(index, 1);
    }
  }

  isListSelected(list: any) {
    return this.selectedLists.some(selectedList => selectedList._id === list._id);
  }
}