import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, filter, map, Observable, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Product, Result } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ProductData } from './product-data';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import {toObservable, toSignal} from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'api/products';
  private http= inject(HttpClient)
  private errorSvc = inject(HttpErrorService)
  private reviewSvc = inject(ReviewService)
  
  selectedProductId = signal<number|undefined>(undefined)

  private productsResult$ = this.http.get<Product[]>(this.productsUrl)
      .pipe(
        map(p => ({data:p } as Result<Product[]>)),
        tap((p)=> console.log(JSON.stringify(p))),
        shareReplay(1),
        catchError(err => of({data:[], error:this.errorSvc.formatError(err)} as Result<Product[]>))
          
      );

  private productsResult = toSignal(this.productsResult$,{initialValue:{data:[]} as Result<Product[]>}) 
  products = computed(()=> this.productsResult().data)
  productsError = computed(()=> this.productsResult().error)

  // products = toSignal(this.products$, {initialValue: [] as Product[]})
  private productResult1$= toObservable(this.selectedProductId).pipe(
    filter(Boolean),
    switchMap((id)=>{
      const productUrl = this.productsUrl + '/' + id
      return this.http.get<Product>(productUrl)
        .pipe(
          switchMap( product => this.getProductWithReview(product) ),
          
        );
    }),
    map(p => ({data:p} as Result<Product>)),
    catchError(err => of({
      data: undefined,
      error: this.errorSvc.formatError(err)
    } as Result<Product>))
  );

  private foundProduct= computed(()=>{
    const p = this.products()
    const id = this.selectedProductId()
    if (p && id){
      return p.find((product)=> product.id=== id)
    }
    return undefined
  })
  private productResult$ = toObservable(this.foundProduct)
  .pipe(
    filter(Boolean),
    switchMap( product => this.getProductWithReview(product) ),
    map(p => ({data:p} as Result<Product>)),
    catchError(err => of({
      data: undefined,
      error: this.errorSvc.formatError(err)
    } as Result<Product>))
  )

  product = toSignal(this.productResult$, {initialValue:{data:undefined}  as Result<Product>})
  productData= computed(()=> this.product()?.data)
  productError= computed(()=> this.product()?.error);
  
  


  handelError(err:HttpErrorResponse):Observable<never>{
    const errorMessage= this.errorSvc.formatError(err)
    return throwError(()=>errorMessage)
  }

  getProductWithReview(product:Product):Observable<Product>{
    if (product.hasReviews){
      return this.http.get<Review[]>(this.reviewSvc.getReviewUrl(product.id)).pipe(
        map(reviews => ({...product,reviews} as Product) )
      )
    }
    else{
      return of(product)
    }
  }

  productSelected(selectedProductId:number):void{
    this.selectedProductId.set(selectedProductId)
  }

}

