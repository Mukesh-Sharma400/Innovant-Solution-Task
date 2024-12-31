import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-listing',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.css'
})
export class ProductListingComponent {
  products: any[] = [];
  apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  editProduct(productId: number): void {
    this.router.navigate([`edit-product/${productId}`]);
  }

  deleteProduct(productId: number): void {
    this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
      next: () => {
        this.products = this.products.filter(product => product.id !== productId);
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      }
    });
  }
}
