import { Component } from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, NavbarComponent]
})
export class AppComponent {}