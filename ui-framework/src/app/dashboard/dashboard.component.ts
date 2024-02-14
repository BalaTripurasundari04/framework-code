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
  clockInDateTime: string | null = null;
  clockOutDateTime: string | null = null;
  showpop = false;
  showpopup = false;
  employee: any;
  
  clockIn() {
    const currentDate = new Date();
    this.clockInDateTime = currentDate.toLocaleString();
    this.clockInEnabled = false;
    this.clockOutEnabled = true;
    this.showpop = true;
    
  }

  clockOut() {
    const currentDate = new Date();
    this.clockOutDateTime = currentDate.toLocaleString();
    this.clockInEnabled = true;
    this.clockOutEnabled = false;
    this.showpopup = true;
    
  }

  close (){
    this.showpop = false;
  }

  closepopup () {
    this.showpopup = false;
  }

  show = false;

  openpop () {
    this.show=true;
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
  
  
}
