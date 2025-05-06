import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  hayToken!: boolean;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("token") !== null) {
      this.hayToken = true;
    } else {
      this.hayToken = false;
    }
  }
}
