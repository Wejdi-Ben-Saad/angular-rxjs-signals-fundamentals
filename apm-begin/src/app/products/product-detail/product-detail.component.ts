import { Component, computed, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { catchError, EMPTY, } from 'rxjs';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent{

  

  private productSvc = inject(ProductService)
  private cartSvc = inject(CartService)
  // Product to display
  

  product=this.productSvc.productData
  errorMessage = this.productSvc.productError;
  

  // Set the page title
  // pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = computed(()=>  this.product() ? `Product Detail for: ${this.product()?.productName}` : 'Product Detail')

  addToCart(product: Product) {
    this.cartSvc.addToCart(product)
  }
}
