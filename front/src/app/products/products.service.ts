import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.class';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private static productslist: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    private APIUrl = 'http://localhost:3000/products';

    constructor(private http: HttpClient) { }

    // getProducts(): Observable<Product[]> {
    //     if( ! ProductsService.productslist )
    //     {
    //         this.http.get<any>('assets/products.json').subscribe(data => {
    //             ProductsService.productslist = data.data;

    //             this.products$.next(ProductsService.productslist);
    //         });
    //     }
    //     else
    //     {
    //         this.products$.next(ProductsService.productslist);
    //     }

    //     return this.products$;
    // }

    getProducts(): Observable<Product[]> {
        if (!ProductsService.productslist) {
            this.http.get<Product[]>(this.APIUrl).subscribe(data => {
                ProductsService.productslist = data;
                this.products$.next(ProductsService.productslist);
            });
        } else {
            this.products$.next(ProductsService.productslist);
        }

        return this.products$;
    }


    // create(prod: Product): Observable<Product[]> {

    //     ProductsService.productslist.push(prod);
    //     this.products$.next(ProductsService.productslist);

    //     return this.products$;
    // }

    create(prod: Product): Observable<Product[]> {
        this.http.post<Product>(this.APIUrl, prod).subscribe(newProduct => {
            ProductsService.productslist.push(newProduct);
            this.products$.next(ProductsService.productslist);
        });

        return this.products$;
    }

    // update(prod: Product): Observable<Product[]>{
    //     ProductsService.productslist.forEach(element => {
    //         if(element.id == prod.id)
    //         {
    //             element.name = prod.name;
    //             element.category = prod.category;
    //             element.code = prod.code;
    //             element.description = prod.description;
    //             element.image = prod.image;
    //             element.inventoryStatus = prod.inventoryStatus;
    //             element.price = prod.price;
    //             element.quantity = prod.quantity;
    //             element.rating = prod.rating;
    //         }
    //     });
    //     this.products$.next(ProductsService.productslist);

    //     return this.products$;
    // }

    update(prod: Product): Observable<Product[]> {
        this.http.patch<Product>(`${this.APIUrl}/${prod.id}`, prod).subscribe(updatedProduct => {
            ProductsService.productslist.forEach(element => {
                if (element.id === updatedProduct.id) {
                    Object.assign(element, updatedProduct);
                }
            });
            this.products$.next(ProductsService.productslist);
        });

        return this.products$;
    }


    // delete(id: number): Observable<Product[]>{
    //     ProductsService.productslist = ProductsService.productslist.filter(value => { return value.id !== id } );
    //     this.products$.next(ProductsService.productslist);
    //     return this.products$;
    // }

    delete(id: number): Observable<Product[]> {
        this.http.delete(`${this.APIUrl}/${id}`).subscribe(() => {
            ProductsService.productslist = ProductsService.productslist.filter(value => value.id !== id);
            this.products$.next(ProductsService.productslist);
        });

        return this.products$;
    }

}