import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebarAdmin/sidebar'; 
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar], 
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css',
})
export class LayoutAdmin {}
