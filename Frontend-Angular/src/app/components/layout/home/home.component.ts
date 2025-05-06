import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem("token") == null) {
      this.router.navigate(['/login']);
    }
  }
}
