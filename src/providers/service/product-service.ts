import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
@Injectable()
export class ProductService {
    data: any;
    url: any;
    product: any;
    gallery: any;
    status: any;
    headers: any;
    wishlist: any;
    reviews: any;
    related: any;
    reviewForm: any;
    cart: any;
    code: any;
    loader: any;
    upsell: any;
    crossSell: any;

    constructor(private http: Http, private config: Config, private values: Values, private loadingController: LoadingController) {
        this.url = this.config.url;
    }
    getProduct(id) {

        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/' + id + '?', false)).map(res => res.json())
                .subscribe(data => {
                    this.product = data;
                     resolve(this.product);                    
                });
        });
    }
    getReviews(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/' + id + '/reviews/' + '?', false)).map(res => res.json())
                .subscribe(data => {
                    this.reviews = data;
                    resolve(this.reviews);
                });
        });
    }

    getRelatedProducts(relatedProducts) {
        var searchParams = new URLSearchParams();
        searchParams.set('related_ids', relatedProducts);
        return new Promise(resolve => {
            this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-related_products', searchParams).map(res => res.json())
                .subscribe(data => {
                    this.related = data;
                    resolve(this.related);
                });
        });
    }

    getUpsellProducts(upsellProducts) {
        var searchParams = new URLSearchParams();
        searchParams.set('upsell_ids', upsellProducts);
        return new Promise(resolve => {
            this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-upsell_products', searchParams).map(res => res.json())
                .subscribe(data => {
                    this.upsell = data;
                    resolve(this.upsell);
                });
        });
    }

    getCrossSellProducts(crossSellProducts) {
        var searchParams = new URLSearchParams();
        searchParams.set('cross_sell_ids', crossSellProducts);
        return new Promise(resolve => {
            this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-cross_sell_products', searchParams).map(res => res.json())
                .subscribe(data => {
                    this.crossSell = data;
                    resolve(this.crossSell);
                });
        });
    }



    addToCart(params) {
        return new Promise(resolve => {
            var searchParams = new URLSearchParams();
            for (let param in params) {
                searchParams.set(param, params[param]);
                console.log(param);
                console.log(params[param]);
            }
            this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_to_cart', searchParams, {
                    headers: headers
                }).map(res => res.json())
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    presentLoading(text) {
        this.loader = this.loadingController.create({
            content: text,
        });
        this.loader.present();
    }
    dismissLoading() {
        this.loader.dismiss();
    }

    addToWishlist(id) {
    return new Promise(resolve => {
      var params = new URLSearchParams();
      params.append("product_id", id);
      params.append("customer_id", this.values.customerId.toString());
      this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-add_wishlist', params).map(res => res.json())
        .subscribe(data => {
          this.status = data;
          resolve(this.status);
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
          
          resolve(data);
        });
    });

  }
}