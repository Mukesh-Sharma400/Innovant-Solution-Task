import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  productForm: FormGroup;
  productId: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      sku: ['', Validators.required],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      images: [null, Validators.required]
    });

    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.loadProductDetails(this.productId);
      }
    });
  }

  loadProductDetails(productId: number): void {
    this.http.get(`http://localhost:3000/api/products/${productId}`).subscribe({
      next: (response: any) => {
        const product = response;
        const existingImages = product.images || [];

        const imagesWithPreview = existingImages.map((image: any) => ({
          file: null,
          url: image.url,
          name: image.url,
          preview: image.url,
          isNew: false
        }));

        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          price: product.price,
          images: imagesWithPreview
        });

      },
      error: (err) => {
        console.error('Error fetching product details', err);
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      const fileArray = Array.from(event.target.files) as File[];

      const filesWithPreview = fileArray.map((file: File) => ({
        file,
        url: null,
        name: file.name,
        preview: URL.createObjectURL(file),
        isNew: true
      }));

      const currentImages = this.productForm.get('images')?.value || [];

      this.productForm.patchValue({
        images: [...currentImages, ...filesWithPreview]
      });

    }
  }

  removeImage(index: number): void {
    const images = this.productForm.get('images')?.value || [];
    images.splice(index, 1);
    this.productForm.patchValue({ images });
  }


  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      // Append basic fields
      formData.append('sku', this.productForm.value.sku);
      formData.append('name', this.productForm.value.name);
      formData.append('price', this.productForm.value.price);

      // Append new image files
      this.productForm.value.images.forEach((image: any) => {
        if (image.file instanceof File) {
          formData.append('images', image.file);
        }
      });

      // Append existing images (URLs)
      const existingImages = this.productForm.value.images
        .filter((image: any) => !(image.file instanceof File))
        .map((image: any) => image.url);

      formData.append('existingImages', JSON.stringify(existingImages));

      // Determine API endpoint and method
      const apiUrl = this.productId
        ? `http://localhost:3000/api/products/${this.productId}`
        : `http://localhost:3000/api/products`;

      const request = this.productId
        ? this.http.put(apiUrl, formData)
        : this.http.post(apiUrl, formData);

      request.subscribe({
        next: (response) => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product', error);
        }
      });
    } else {
      console.error('Form is invalid:', this.productForm.errors);
    }
  }


}
