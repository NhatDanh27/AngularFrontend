import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class DashboardAdmin implements AfterViewInit {

  ngAfterViewInit() {
    new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['Đã làm', 'Chưa làm', 'Trễ hạn'],
        datasets: [{
          label: 'Số lượng Task',
          data: [85, 25, 10],
          backgroundColor: ['#1cc88a', '#4e73df', '#e74a3b']
        }]
      },
      options: { maintainAspectRatio: false }
    });

  
    new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: ['Đúng giờ', 'Đi trễ', 'Vắng'],
        datasets: [{
          data: [40, 3, 2],
          backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b']
        }]
      },
      options: { maintainAspectRatio: false }
    });
  }
}
