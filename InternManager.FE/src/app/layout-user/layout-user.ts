import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header} from '../header/header';
import { SidebarUser } from '../sidebar-user/sidebar-user';
@Component({
  selector: 'app-layout-user',
  standalone: true,
  imports: [RouterOutlet, Header, SidebarUser],
  templateUrl: './layout-user.html',
  styleUrl: './layout-user.css',
})
export class LayoutUser {}
