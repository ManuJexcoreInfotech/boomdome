import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, IonicPage } from 'ionic-angular';
import { ProductService } from '../../providers/service/product-service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';
import {md5} from './md5';


@IonicPage()
@Component({
    templateUrl: 'product.html'
})
export class ProductPage {
    @ViewChild(Content) content: Content;
    product: any;
    id: any;
    status: any;
    options: any;
    opt: any;
    message: any;
    wishlist: any;
    quantity: any;
    reviews: any;
    reviewForm: any;
    nickname: any;
    details: any;
    AddToCart: any;
    disableSubmit: boolean = false;
    wishlistIcon: boolean = false;
    moreDescription: boolean = false;
    related: any;
    crossSell: any;
    upsell:any;

    constructor(public nav: NavController, public service: ProductService, params: NavParams, public functions: Functions, public values: Values) {
        this.id = params.data;
        this.options = [];
        this.quantity = "1";
        this.AddToCart = "Add To Cart";
        this.service.getProduct(this.id)
            .then((results) => this.handleProductResults(results));
        this.getReviews();

    }

    handleProductResults(results){
        this.product = results;
        this.getRelatedProducts();
        this.getUpsellProducts();
        this.getCrossSellProducts();

    }

    getProduct(id) {
        this.nav.push('ProductPage', id);
    }
    addToCart(id) {
        if (this.product.product.type == 'variable' && this.options.length == 0) {

            this.functions.showAlert('Eroor', 'Please Select Product Option...')
        }
        
        else {
            this.disableSubmit= true;
            var text = '{';
            var i;
            for (i = 0; i < this.options.length; i++) {
                var res = this.options[i].split(":");
                for (var j = 0; j < res.length; j = j + 2) {
                    text += '"' + res[j] + '":"' + res[j + 1] + '",';
                }
            }
            text += '"product_id":"' + id + '",';
            text += '"quantity":"' + this.quantity + '"}';
            var obj = JSON.parse(text);
            this.service.addToCart(obj)
                .then((results) => this.updateCart(results));
        }
    }
    chnageProduct() {
        var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
            var res = this.options[i].split(":");
            for (var j = 0; j < res.length; j = j + 2) {
                text += '"' + res[j] + '":"' + res[j + 1] + '",';
            }
        }
        text += '"quantity":"' + this.quantity + '"}';
        var obj = JSON.parse(text);
        for (let item in this.product.product.variations) {
            if (this.product.product.variations[item].id == obj.variation_id) {
                this.product.product.in_stock = this.product.product.variations[item].in_stock;
                this.product.product.price = this.product.product.variations[item].price;
            }
        }
    }
    updateCart(a) {
        this.disableSubmit= false;
        this.values.count += parseInt(this.quantity);
        this.AddToCart = "Add To Cart";
    }
    getCart() {
        this.nav.push('CartPage');
    }

    mySlideOptions = {
        initialSlide: 1,
        loop: true,
        autoplay: 5800,
        pager: true
    }
    getReviews() {
        this.service.getReviews(this.id)
            .then((results) => this.handleReview(results));
    }
  handleReview(a){
    this.reviews = a;
    for(let item in this.reviews.product_reviews){
       this.reviews.product_reviews[item].avatar = md5(this.reviews.product_reviews[item].reviewer_email);
       console.log(this.reviews.product_reviews[item].avatar);
    }
  }

  addToWishlist(id){
      if(this.values.isLoggedIn){
      this.service.addToWishlist(id)
        .then((results) => this.update(results));
    }
    else{
            this.functions.showAlert("Warning", "You must login to add product to wishlist");
        }


  }

  update(a){
    if(a.success == "Success"){
       this.values.wishlistId[this.product.product.id] =  true;
    }

    else {
        this.functions.showAlert("error", "error");
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

    showMore(){
        this.moreDescription = true;
    }

    showLess(){
        this.moreDescription = false;
    }

    getRelatedProducts(){

        if(this.product.product.related_ids != 0){
            this.service.getRelatedProducts(this.product.product.related_ids)
            .then((results) => this.related = results);
        } 
    }

    getRelatedProduct(id){
        this.nav.push('ProductPage', id);
    }

        getUpsellProducts(){

        if(this.product.product.upsell_ids != 0){
            this.service.getRelatedProducts(this.product.product.upsell_ids)
            .then((results) => this.upsell = results);
        }
    }

    getCrossSellProducts(){

        if(this.product.product.cross_sell_ids != 0){
            this.service.getRelatedProducts(this.product.product.cross_sell_ids)
            .then((results) => this.crossSell = results);
        }
    }
    
}