import {Component,  OnInit} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';
import {Service} from '../../providers/service/service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';

@IonicPage()
@Component({
    templateUrl: 'home.html'
})
export class Home implements OnInit {
    status: any;
    items: any;
    product: any;
    products: any;
    filter: any;
    options: any;
    id: any;
    variationID: any;
    time: any;
    allProducts: any;
    has_more_items: boolean = true;

    constructor(public nav: NavController, public service: Service, public values: Values, public functions: Functions) {
        this.items = [];
        this.options = [];
        this.filter = {};
        this.filter.page = 1;
       }

    ngOnInit(){   

        console.log("data home");

        this.service.load()
         .then((results) => this.handleService(results));


    }
        handleService(results){
        this.service.getProducts()
           .then((results) => this.products = results);

        }
    
    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.name = name;
        this.items.slug = slug;
        this.items.categories = this.service.categories;
        this.nav.push('ProductsPage', this.items);
    }
    getCart() {
        this.nav.push('CartPage');
    }
    getSearch() {
        this.nav.push('SearchPage');
    }
    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: true
    }

    getProduct(id){
    this.nav.push('ProductPage', id);
    }

    getId() {
        var i;
        if (this.options.length >= 1)
            var resa = this.options[0].split(":");
        if (this.options.length >= 2)
            var resb = this.options[1].split(":");
        if (this.options.length >= 1)
            for (i = 0; i < this.product.product.variations.length; i++) {
                if (this.product.product.variations[i].attributes[0].option == resa[1]) {
                    if (this.options.length == 1) {
                        break;
                    }
                    else if (this.product.product.variations[i].attributes[1].option == resb[1]) {
                        break;
                    }
                }
            }
    }

        addToWishlist(id){

        if(this.values.isLoggedIn){
        this.values.wishlistId[id] = true;
         this.service.addToWishlist(id)
        .then((results) => this.update(results, id));
    }
        else{
            this.functions.showAlert("Warning", "You must login to add product to wishlist");
        }


  }

    update(results, id){
    if(results.success == "Success"){
       this.values.wishlistId[id] = true;
    }

    else {

      }

  }

    removeFromWishlist(id){
    this.values.wishlistId[id] = false;
    this.service.deleteItem(id)
    .then((results) => this.updateWish(results, id));
 
    }

    updateWish(results, id){

        if(results.status == "success"){

            this.values.wishlistId[id] = false;
        
        }

    }

    doInfinite(infiniteScroll) {
        this.filter.page += 1;
        this.service.loadMore(this.filter)
            .then((results) => this.handleMore(results, infiniteScroll));
    }
    handleMore(results, infiniteScroll) {
        if (results != undefined) {
            for (var i = 0; i < results.length; i++) {
                this.products.push(results[i]);
            };
        }
        if (results.length == 0) {
            this.has_more_items = false;
        }
        infiniteScroll.complete();
    }
}