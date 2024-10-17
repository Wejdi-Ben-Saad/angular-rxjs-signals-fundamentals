import { Component, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';

import { ProductDetailComponent } from '../product-detail/product-detail.component';

import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent  {
  // Just enough here for the template to compile
  pageTitle = 'Products';
  
  ProductSvc = inject(ProductService)
  readonly products = this.ProductSvc.products
  readonly selectedProductId = this.ProductSvc.selectedProductId
  errorMessage = this.ProductSvc.productsError;



  onSelected(productId: number): void {
    this.ProductSvc.productSelected(productId);
  }
}
