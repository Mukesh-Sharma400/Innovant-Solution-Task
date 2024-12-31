import { Routes } from '@angular/router';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';

export const routes: Routes = [
    { path: '', component: ProductListingComponent },
    { path: 'product-form', component: ProductFormComponent },
    { path: 'edit-product/:id', component: ProductFormComponent },
];
