import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { Config } from './config';
import { Values } from './values';
import { URLSearchParams } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded');

@Injectable()
export class Service {
    data: any;
    url: any;
    categories: any;
    banners: any;
    orders: any;
    order: any;
    isloggedIn: any;
    status: any;
    address: any;
    headers: any;
    products: any;
    product: any;
    cart: any;
    configuration: any;
    loader: any;
    loginStatus: any;
    mainCategories: any;
    country: any;
    user: any;
    login_nonce: any;
    dir: any = 'left';
    googleResponse: any;

    constructor(private http: Http, private config: Config, private values: Values, public loadingCtrl: LoadingController, private nativeStorage: NativeStorage) {
        this.url = this.config.url;
        this.mainCategories = [];
    }
    load() {
        //this.presentLoading(this.values.lan.WaitTitle);
        return new Promise(resolve => {
            this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-keys').map(res => res.json())
                .subscribe(data => {
                    this.config.consumerKey = data.keys.consumerKey;
                    this.config.consumerSecret = data.keys.consumerSecret;
                    this.values.currency = data.currency;
                    this.login_nonce = data.login_nonce;
                    this.banners = data.banners;
                    this.values.max_price = data.max_price;
                    if (data.user.data != undefined) {
                        this.values.isLoggedIn = data.user.data.status;
                        this.values.customerId = data.user.data.ID;
                        this.values.customerName = data.user.data.display_name;
                        this.values.logoutUrl = this.encodeUrl(data.user.data.url);
                    }
                    this.http.get(this.config.setUrl('GET', '/wc-api/v3/products/categories?', false)).map(res => res.json())
                        .subscribe(data => {
                            //this.dismissLoading();
                            this.categories = data;
                            console.log(data);
                            this.mainCategories = [];
                            for (var i = 0; i < this.categories.product_categories.length; i++) {
                                if (this.categories.product_categories[i].parent == '0') {
                                    this.mainCategories.push(this.categories.product_categories[i]);
                                }
                            }
                            this.nativeStorage.getItem('loginData')
                                .then(
                                    data => this.login(data, this.login_nonce),
                                    error => console.error(error)
                                );
                            this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-cart').map(res => res.json())
                                .subscribe(data => {
                                    this.cart = data;
                                    this.values.updateCart(this.cart);
                                });

                             
                            if(this.values.isLoggedIn){ 
                                var params = new URLSearchParams();
                                params.append("customer_id", this.values.customerId.toString());
                                this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_wishlist', params).map(res => res.json())
                                    .subscribe(data => {
                                        for (let item in data) {
                                            this.values.wishlistId[data[item].id] = data[item].id;
                                        }
                                });
                            }

                            resolve(this.categories);
                        });

                });
        });
    }
    getNonce() {
        return new Promise(resolve => {
            this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-nonce').map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
    login(a, nonce) {
        var params = new URLSearchParams();
        params.append("username", a.username);
        params.append("password", a.password);
        params.append("_wpnonce", nonce);
        params.append("login", 'Login');
        params.append("redirect", this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-userdata');
        return new Promise(resolve => {
            this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-login', params).map(res => res.json())
                .subscribe(data => {
                    if (!data.errors) {
                        this.values.isLoggedIn = data.data.status;
                        this.values.customerName = data.data.display_name;
                        this.values.customerId = data.data.ID;
                        this.values.logoutUrl = this.encodeUrl(data.data.url);
                        params = new URLSearchParams();
                        params.append("customer_id", this.values.customerId.toString());
                        this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_wishlist', params).map(res => res.json())
                            .subscribe(data => {
                                for (let item in data) {
                                    this.values.wishlistId[data[item].id] = data[item].id;
                                }
                        });

                        //this.values.avatar = data.data.avatar;
                        this.nativeStorage.setItem('loginData', {
                                username: a.username,
                                password: a.password
                            })
                            .then(
                                data => console.log('Login Details Stored'),
                                error => console.error(error)
                            );
                    }
                    resolve(data);
                }, err => {resolve(JSON.parse(err._body));console.log(err._body)});
        });
    }
    encodeUrl(href) {
        return href.replace(/&amp;/g, '&')
    }
    logout() {
        return new Promise(resolve => {
            this.http.get(this.encodeUrl(this.values.logoutUrl))
                .subscribe(data => {
                    this.values.isLoggedIn = false;
                    this.values.customerName = "";
                    this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-cart').map(res => res.json())
                        .subscribe(data => {
                            this.cart = data;
                            this.values.updateCart(this.cart);
                        });
                    resolve(this.cart);
                });
        });
    }
    passwordreset(email, nonce, url) {
        var params = new URLSearchParams();
        params.append("user_login", email);
        params.append("wc_reset_password", "true");
        params.append("_wpnonce", nonce);
        params.append("_wp_http_referer", '/my-account/lost-password/');
        return new Promise(resolve => {
            this.http.post(this.url + '/my-account/lost-password/', params)
                .subscribe(status => {
                    resolve(status);
                });
        });
    }
    passwordResetNonce() {
        return new Promise(resolve => {
            this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-passwordreset').map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
    getAddress() {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/customers/' + this.values.customerId + '?', false)).map(res => res.json())
                .subscribe(data => {
                    this.address = data;
                    resolve(this.address);
                });
        });
    }
    saveAddress(address) {
        var params =  address;
       
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wp-json/wc/v2/customers/' + this.values.customerId + '?', false), params).map(res => res.json())
                .subscribe(data => {
                    this.products = data;
                    resolve(this.products);
                });
        });
    }

    pushNotification(notification){
        var params = new URLSearchParams();
        params.append("device_id", notification.device_id);
        params.append("platform", notification.platform);
        params.append("email", notification.email);
        params.append("city", notification.city);
        params.append("state", notification.state);
        params.append("country", notification.country);
        params.append("pincode", notification.pincode);

        return new Promise(resolve => {
            this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify', params, {
                    headers: headers
                }).map(res => res.json())
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });

    }

    pushNotify(deviceId, platform){
        var params = new URLSearchParams();
            params.append("device_id", deviceId);
            params.append("platform", platform);

            return new Promise(resolve => {
                this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-user-subcribe-notify', params, {
                        headers: headers
                    }).map(res => res.json())
                    .subscribe(data => {
                        this.status = data;
                        resolve(this.status);
                    });
            });

    }


    getOrder(id) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/orders/' + id + '?', false)).map(res => res.json())
                .subscribe(data => {
                    this.order = data;
                    resolve(this.order);
                });
        });
    }
    getCountry() {
        return new Promise(resolve => {
            this.http.get(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-get_country').map(res => res.json())
                .subscribe(data => {
                    this.country = data;
                    resolve(this.country);
                });
        });
    }
    registerCustomer(customer) {
        var params =  customer
    
        return new Promise(resolve => {
            this.http.post(this.config.setUrl('POST', '/wp-json/wc/v2/customers?', false), params).map(res => res.json())
                .subscribe(data => {
                    this.user = data;
                    resolve(this.user);
                }, err => {resolve(JSON.parse(err._body));console.log(err._body)});
        });
    }

    getOrders(filter) {
        return new Promise(resolve => {
            this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/orders?', filter)).map(res => res.json())
                .subscribe(data => {
                    this.orders = data;
                    resolve(this.orders);
                });
        });
    }
    updateOrder(data, id) {
        return new Promise(resolve => {
            this.http.put(this.config.setUrl('PUT', '/wp-json/wc/v2/orders/' + id + '?', false), data).map(res => res.json())
                .subscribe(data => {
                    this.status = data;
                    resolve(this.status);
                });
        });
    }
    presentLoading(text) {
        this.loader = this.loadingCtrl.create({
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

  getProducts(){
     return new Promise(resolve => {
    this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/?', false)).map(res => res.json())
             .subscribe(data => {
                this.products = data;
                resolve(this.products);
            });
        });
  }

  loadMore(filter){
         return new Promise(resolve => {
    this.http.get(this.config.setUrl('GET', '/wp-json/wc/v2/products/?', filter)).map(res => res.json())
             .subscribe(data => {
                this.products = data;
                resolve(this.products);
            });
        });
  }


  sendToken(token){
    var params = new URLSearchParams();
    params.append("access_token", token);
        return new Promise(resolve => {
        this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-facebook_connect', params).map(res => res.json())
        .subscribe(data => {
            console.log(data);
            if(data.status){

            this.values.isLoggedIn = true;
            this.values.setNavigation = true;
            this.values.customerName = data.last_name;
            this.values.customerId = data.user_id;
            resolve(data);
           // this.values.avatar = data.avatar; 

        }
        });
    });
    }

    googleLogin(token, email, first_name, last_name){
    var params = new URLSearchParams();
    params.append("access_token", token);
    params.append("email", email);
    params.append("first_name", first_name);
    params.append("last_name", last_name);
        return new Promise(resolve => {
        this.http.post(this.url + '/wp-admin/admin-ajax.php?action=mstoreapp-google_connect', params).map(res => res.json())
        .subscribe(data => {
            console.log(data);
            this.googleResponse = data;
            if(data.status){

            this.values.isLoggedIn = true;
            this.values.setNavigation = true;
            this.values.customerName = last_name;
            this.values.customerId = data.user_id;
            resolve(data);
           // this.values.avatar = data.avatar; 

          }
            //this.status = data;
          
        });
    });
    }

}