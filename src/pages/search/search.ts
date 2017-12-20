import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ViewController, IonicPage } from 'ionic-angular';
import { SearchService } from '../../providers/service/search-service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';



@Component({
    template: `<ion-header><ion-toolbar color="shadow"> <ion-title text-center>Filter</ion-title> <ion-buttons end> <button ion-button ligth class="has-icon icon-only has-badge" (click)="close()"> <ion-icon name="close"></ion-icon> </button> </ion-buttons></ion-toolbar></ion-header><ion-content><div *ngIf="filters"><div *ngIf="filters.item.length"><div *ngFor="let item of filters.item; let i=index"> <ion-item>{{item.name}}</ion-item> <div *ngIf="item.values.value.length"> <ion-item *ngFor="let value of item.values.value; let j=index"> <ion-label>{{value.label}}({{value.count}})</ion-label> <ion-checkbox [(ngModel)]="filters.item[i].values.value[j].selected"></ion-checkbox> </ion-item> </div><ion-item *ngIf="!item.values.value.length"> <ion-label>{{item.values.value.label}}({{item.values.value.count}})</ion-label> <ion-checkbox [(ngModel)]="filters.item[i].values.value.selected"></ion-checkbox> </ion-item></div></div><div *ngIf="!filters.item.length"> <ion-item>{{filters.item.name}}</ion-item> <div *ngIf="filters.item.values.value.length"> <ion-item *ngFor="let value of filters.item.values.value; let j=index"> <ion-label>{{value.label}}({{value.count}})</ion-label> <ion-checkbox [(ngModel)]="filters.item.values.value[j].selected"></ion-checkbox> </ion-item> </div><ion-item *ngIf="!filters.item.values.value.length"> <ion-label>{{filters.item.values.value.label}}({{filters.item.values.value.count}})</ion-label> <ion-checkbox [(ngModel)]="filters.item.values.value.selected"></ion-checkbox> </ion-item></div></div></ion-content><ion-footer primary *ngIf="filters"><ion-grid no-padding> <ion-row no-padding> <ion-col primary width-50 no-padding> <button ion-button full clear no-padding no-margin (click)="clearAll()"> Clear </button> </ion-col> <ion-col royal width-50 no-padding> <button ion-button full clear color="shadow" no-padding no-margin (click)="apply()"> Apply </button> </ion-col> </ion-row></ion-grid></ion-footer>`,
})
export class MyPopover {
    filters: any;
    select: any;
    constructor(public viewCtrl: ViewController, params: NavParams, public values: Values) {
        this.select = [];
        this.filters = params.data.filters;
    }
    close() {
        this.values.filterUpdate = false;
        this.viewCtrl.dismiss();
    }
    apply() {
        this.values.filterUpdate = true;
        var text = '{';
        var i;
        var j;
        for (i = 0; i < this.filters.item.length; i++) {
            if (this.filters.item[i].values.value.length)
                for (j = 0; j < this.filters.item[i].values.value.length; j++) {
                    if (this.filters.item[i].values.value[j].selected)
                        text += '"' + this.filters.item[i].code + '":"' + this.filters.item[i].values.value[j].id + '",';
                }
            if (!this.filters.item[i].values.value.length) {
                if (this.filters.item[i].values.value.selected)
                    text += '"' + this.filters.item[i].code + '":"' + this.filters.item[i].values.value.id + '",';
            }
        }
        if (!this.filters.item.length) {
            if (this.filters.item.values.value.length)
                for (j = 0; j < this.filters.item.values.value.length; j++) {
                    if (this.filters.item.values.value[j].selected)
                        text += '"' + this.filters.item.code + '":"' + this.filters.item.values.value[j].id + '",';
                }
            if (!this.filters.item.values.value.length) {
                if (this.filters.item.values.value.selected)
                    text += '"' + this.filters.item.code + '":"' + this.filters.item.values.value.id + '",';
            }
        }
        text += '"dd":"' + 'dd"}';
        this.values.filter = text;
        this.values.filter = JSON.parse(text);
        this.viewCtrl.dismiss();
    }
    clearAll() {
        this.values.filterUpdate = true;
        var i;
        var j;
        for (i = 0; i < this.filters.item.length; i++) {
            if (this.filters.item[i].values.value.length)
                for (j = 0; j < this.filters.item[i].values.value.length; j++) {
                    if (this.filters.item[i].values.value[j].selected)
                        this.filters.item[i].values.value[j].selected = false;
                }
            if (!this.filters.item[i].values.value.length) {
                if (this.filters.item[i].values.value.selected)
                    this.filters.item[i].values.value.selected = false;
            }
        }
        if (!this.filters.item.length) {
            if (this.filters.item.values.value.length)
                for (j = 0; j < this.filters.item.values.value.length; j++) {
                    if (this.filters.item.values.value[j].selected)
                        this.filters.item.values.value[j].selected = false;
                }
            if (!this.filters.item.values.value.length) {
                if (this.filters.item.values.value.selected)
                    this.filters.item.values.value.selected = false;
            }
        }
        this.values.filter = {};
        this.viewCtrl.dismiss();
    }
}

@IonicPage()
@Component({
    templateUrl: 'search.html'
})
export class SearchPage {
    search: any;
    slug: any;
    id: any;
    categories: any;
    searchKey: any;
    count: any;
    offset: any;
    has_more_items: boolean = true;
    options: any;
    status: any;
    products: any;
    moreProducts: any;
    quantity: any;
    page: number = 1;
    filter: any;
    myInput: any;
    shouldShowCancel: boolean = true;
    loading : boolean = false;
    subCategories: any;
    constructor(public nav: NavController, public popoverCtrl: PopoverController, public service: SearchService, public values: Values, params: NavParams, public functions: Functions) {
        this.filter = {};
        this.count = 10;
        this.offset = 0;
        this.values.filter = {};
        this.options = [];
        this.quantity = "1";
        this.myInput = "";
        this.filter.page = 1;
    }
    getCart() {
        this.nav.push('CartPage');
    }
    onInput($event) {
        this.loading = true;
        this.filter.search = $event.srcElement.value;
        this.values.filter = {};
        this.service.getSearch(this.filter)
            .then((results) => {this.loading = false; this.products = results;});
 
    }
    onCancel($event) {
        console.log('cancelled');
    }
    getProduct(id) {
        this.nav.push('ProductPage', id);
    }
    doInfinite(infiniteScroll) {
        this.filter.page += 1;
        this.service.getSearch(this.filter)
            .then((results) => this.handleMore(results, infiniteScroll));
    }
    handleMore(results, infiniteScroll) {
        if (results != undefined) {

            for (var i = 0; i < results.length; i++) {
                this.products.push(results[i]);
                
            };
        }
        if (results == 0) {
            this.has_more_items = false;
        }
        infiniteScroll.complete();
    }

    deleteFromCart(id) {
        this.service.deleteFromCart(id)
            .then((results) => this.status = results);
    }
    addToCart(id, type) {

        if (type == 'variable') {
            this.nav.push('ProductPage', id);
        }

        else { var text = '{';
        var i;
        for (i = 0; i < this.options.length; i++) {
            var res = this.options[i].split(":");
            text += '"' + res[0] + '":"' + res[1] + '",';
        }
        text += '"product_id":"' + id + '",';
        text += '"quantity":"' + this.quantity + '"}';
        var obj = JSON.parse(text);
        this.service.addToCart(obj)
            .then((results) => this.updateCart(results));
        }
    }
    updateCart(a) {
    }
    setListView() {
        this.values.listview = true;
    }
    setGridView() {
        this.values.listview = false;
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
        //this.functions.showAlert(a.success, a.message);
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
}