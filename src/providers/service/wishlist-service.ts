import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class WishlistService {

    wishlist: any;
    url: any;
    cartData: any;

    constructor(private http: Http, private config: Config, private values: Values) {

        this.url = this.config.url;
    }
    loadWishlist() {
      var params = new URLSearchParams();
      params.append("customer_id", this.values.customerId.toString());
        return new Promise(resolve => {
                   this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_wishlist', params).map(res => res.json())
                .subscribe(data => {
                    this.wishlist = data;
                    resolve(this.wishlist);
            });
        });
    }

    deleteItem(id){
  
    var params = new URLSearchParams();
    params.append("product_id", id);
    params.append("customer_id", this.values.customerId.toString());

      return new Promise(resolve => {
      this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-remove_wishlist', params).map(res => res.json())
        .subscribe(data => {

          this.wishlist = data;
          
          resolve(this.wishlist);
        });
    });

  }

  addToCart(id){
    var params = new URLSearchParams();
      params.append("quantity", "1");
      params.append("product_id", id);
        return new Promise(resolve => {
                   this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_to_cart', params).map(res => res.json())
                .subscribe(data => {
                    this.cartData = data;
                    this.values.cartNonce = data.cart_nonce;
                    this.values.updateCartTwo(data.cart);
                    resolve(this.cartData);
            });
        });
  }



}