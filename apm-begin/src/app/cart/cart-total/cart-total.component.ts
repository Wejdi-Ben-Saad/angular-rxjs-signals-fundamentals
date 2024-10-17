import { Component, inject } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-total',
  templateUrl: './cart-total.component.html',
  standalone: true,
  imports: [NgIf, CurrencyPipe]
})
export class CartTotalComponent {
  private cartSvc = inject(CartService)
  cartItems = this.cartSvc.cartItems;

  subTotal = this.cartSvc.subTotal;
  deliveryFee = this.cartSvc.deliveryFee;
  tax = this.cartSvc.tax;
  totalPrice = this.cartSvc.totalPrice;

}
