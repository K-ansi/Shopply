import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.css'],
  imports: [NgIf, NgFor, FormsModule],
  standalone: true,
})
export class ListDetailsComponent {
  @Input() list: any;
  @Output() closeList = new EventEmitter<any>();
  showItemSearch = false;
  itemSearchResults: any[] = [];
  itemSearchQuery = new Subject<string>();
  showCreateItem = false;

  constructor(private http: HttpClient, private router: Router) {
    this.itemSearchQuery.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.showCreateItem = query.trim() !== '';
        return this.searchItems(query);
      })
    ).subscribe((results: any[]) => {
      console.log('Search results:', results);
      this.itemSearchResults = results;
    });
  }

  showCreateItemForm = false;
  newItem = {
    name: '',
    store: '',
    price: null
  };

  onCloseList() {
    this.closeList.emit(this.list);
  }

  toggleItemSearch() {
    this.showItemSearch = !this.showItemSearch;
    if (!this.showItemSearch) {
      this.itemSearchResults = [];
      this.itemSearchQuery.next('');
      this.showCreateItem = false;
    }
  }

  searchItems(query: string) {
    if (query.trim() === '') {
      return of([]);
    }

    return this.http.get<any[]>(`/api/users/items?q=${query}`).pipe(
      catchError((error) => {
        console.error('Error searching items:', error);
        return of([]);
      })
    );
  }

  onItemSearchInput(event: any) {
    const query = event.target.value;
    this.itemSearchQuery.next(query);
  }

  createItem() {
    this.showCreateItemForm = true;
  }

  cancelCreateItem() {
    this.showCreateItemForm = false;
    this.resetNewItem();
  }

  onCreateItem() {
    if (this.newItem.name.trim() !== '') {
      this.http.post('/api/users/create-item', this.newItem).subscribe(
        (response: any) => {
          console.log('Item created successfully:', response);
          this.showCreateItemForm = false;
          this.resetNewItem();
          this.fetchListDetails(); // Refresh the list details after creating an item
        },
        (error) => {
          console.error('Error creating item:', error);
        }
      );
    }
  }

  resetNewItem() {
    this.newItem = {
      name: '',
      store: '',
      price: null
    };
  }

  

  addItemToList(item: any) {
    const itemToAdd = {
      item: item._id,
      amount: item.quantity,
      listId: this.list._id
    };

    this.http.post(`/api/users/add-item`, itemToAdd).subscribe(
      (response) => {
        console.log('Item added successfully:', response);
        this.fetchListDetails(); 
        this.toggleItemSearch();
      },
      (error) => {
        console.error('Error adding item:', error);
      }
    );
  }

  ngOnInit() {
    this.fetchListDetails();
  }

  fetchListDetails() {
    const itemToAdd = {listId: this.list._id}
    this.http.post(`/api/users/list-items`, itemToAdd).subscribe(
      (response: any) => {
        this.list = response.list;
      },
      (error) => {
        console.error('Error fetching list details:', error);
      }
    );
  }


}