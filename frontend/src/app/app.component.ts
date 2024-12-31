import { filter } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  headingText: string = 'Products List';
  buttonText: string = 'Add Product';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateText();
    });

    this.updateText();
  }

  navigateToOtherRoute() {
    const currentRoute = this.router.url;

    if (currentRoute === '/') {
      this.router.navigate(['/product-form']);
    } else if (currentRoute.startsWith('/edit-product/')) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/']);
    }

    this.updateText();
  }

  updateText() {
    const currentRoute = this.router.url;

    if (currentRoute === '/') {
      this.headingText = 'Products List';
      this.buttonText = 'Add Product';
    } else if (currentRoute === '/product-form') {
      this.headingText = 'Product Form';
      this.buttonText = 'Back to Products';
    } else if (currentRoute.startsWith('/edit-product/')) {
      this.headingText = 'Edit Product';
      this.buttonText = 'Back to Products';
    }
  }
}
