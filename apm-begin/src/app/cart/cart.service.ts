import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([])
  cartCount = computed(()=>
    this.cartItems().reduce((accQty,item)=> accQty+item.quantity , 0)
  )
  subTotal = computed(()=>
    this.cartItems().reduce((subTotal,item)=> subTotal+(item.quantity*item.product.price),0)
  )

  deliveryFee = computed(()=> this.subTotal() < 50?5.99:0)
  tax= computed(()=> Math.round(this.subTotal()*10.75) /100) 
  totalPrice = computed(()=>this.subTotal()+this.deliveryFee() + this.tax())

  // If the item is already in the cart, increase the quantity
  addToCart(product: Product): void {
    this.cartItems.update(items => {
        // Find the existing item in the cart
        const existingItem = items.find(item => item.product.id === product.id);

        if (!existingItem) {
            // Not already in the cart, so add with a default quantity of 1
            return [...items, { product, quantity: 1 }];
        }

        // Already in the cart, increase the quantity by 1
        return items.map(item =>
            item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
    });
}


  
  

  removeFromCart(cartItem:CartItem):void{
    this.cartItems.update((items)=> items.filter((item)=> item.product.id != cartItem.product.id))
  }

  updateQuantity(cartItem:CartItem, quantity:number):void{
    this.cartItems.update((items)=> 
      items.map((item)=> item.product.id === cartItem.product.id ? {...item, quantity}:item)
    )
  }


}
