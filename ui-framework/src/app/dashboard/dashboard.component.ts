import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexDataLabels,
  ApexChart,
  ApexTitleSubtitle
} from "ng-apexcharts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {

  attendanceData: any[] = [];
  employee_id: string = '';
  Month: string = '';

  chartSeries: ApexNonAxisChartSeries = [20, 5, 25];

  chartDetails: ApexChart = {
    type: 'pie',
  };

  chartLabels = ["Working days", "Leaves", "Total Working Days"];
  chartDataLabels: ApexDataLabels = {
    enabled: true
  };

  clockInEnabled: boolean = true;
  clockOutEnabled: boolean = false;
  clockInDate : string | null = null;
  clockOutDate : string | null = null;
  clockInTime : string | null = null;
  clockOutTime : string | null = null;
  showpop = false;
  showpopup = false;
  employee: any;
  
  clockIn() {
    const currentDate = new Date();
    this.clockInDate = currentDate.toISOString().split('T')[0];
    this.clockInTime = currentDate.toLocaleTimeString('en-US', {hour12:false});
    this.clockInEnabled = false;
    this.clockOutEnabled = true;
    this.showpop = true;
    
  }

  clockOut() {
    const currentDate = new Date();
    this.clockOutDate = currentDate.toISOString().split('T')[0];
    this.clockOutTime = currentDate.toLocaleTimeString('en-US', {hour12:false});
    this.clockInEnabled = true;
    this.clockOutEnabled = false;
    this.showpopup = true;
    
  }

  close (){
    this.showpop = false;
    const data = {
      employee_id: this.employee.employee_id,
      clockin_date: this.clockInDate,
      clockin_time: this.clockInTime,
    }
    this.http.post('http://localhost:8080/api/clockin',data).subscribe((response)=>{

    });
  }

  closepopup () {
    this.showpopup = false;
    const data = {
      employee_id: this.employee.employee_id,
      clockout_date: this.clockOutDate,
      clockout_time: this.clockOutTime,
    }
    this.http.post('http://localhost:8080/api/clockout',data).subscribe((response)=>{

    });
  }

  show = false;

  openpop () {
    this.show=true;
    this.loadAttendanceData();
  }

  closepop () {
    this.show = false;
  }

  constructor(private route: Router,
    private http: HttpClient
    ){}

  private daysArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  private date = new Date();
  public hour: any;
  public minute!: string;
  public second!: string;
  public ampm!: string;
  public day!: string;

  ngOnInit(): void {
    
    this.get_details();
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000);
    
    
  }
  private updateDate(date: Date){
    const hours = date.getHours();
    this.ampm =hours >=12 ? 'PM' :'AM';
    this.hour = hours %12;
    this.hour = this.hour ? this.hour :12;
    this.hour = this.hour < 10 ? '0' + this.hour : this.hour;
    
    const minutes = date.getMinutes();
    this.minute = minutes < 10 ? '0' + minutes : minutes.toString() ;

    const seconds = date.getSeconds();
    this.second = seconds < 10 ? '0' + seconds : seconds.toString() ;
  }

  logout(){
    this.route.navigateByUrl('/')
  }
  get_details() {
    this.http.get('http://localhost:8080/api/employee',{withCredentials:true}).subscribe((res:any) => {
      this.employee = res;
    });
  }
  
  loadAttendanceData() {
    // Customize this URL according to your backend API
    const url = 'http://localhost:8080/api/attendance/?employee_id=${this.employee_id}&month=${this.Month}';
    
    this.http.get<any[]>(url)
      .subscribe(data => {
        this.attendanceData = data;
      });
  }
}
