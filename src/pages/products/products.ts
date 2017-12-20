import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, IonicPage } from 'ionic-angular';
import { CategoryService } from '../../providers/service/category-service';
import { Values } from '../../providers/service/values';
import { Functions } from '../../providers/service/functions';


@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html'
})
export class ProductsPage {
    products: any;
    moreProducts: any;
    count: any;
    offset: any;
    category: any;
    filters: any;
    has_more_items: boolean = true;
    listview: boolean = false;
    noProducts: boolean = false;
    status: any;
    options: any;
    pop: any;
    categories: any;
    subCategories: any;
    items: any;
    quantity: any;
    filter: any;
    q: any;
    shouldShowCancel: boolean = true;
    showFilters: boolean = false;
    showSortFilters: boolean = false;    data: any;
    sort: number = 0;
    categoryName: any;
    price: any = {lower: 1, upper: this.values.max_price};
    attributes: any;
    attributeTerms: any = [];
    termsOption: any;

    filterTypes: any;
    selectedFilter: any = {};
    filterType: any;

    constructor(public nav: NavController, public popoverCtrl: PopoverController, public service: CategoryService, params: NavParams, public values: Values, public functions: Functions) {
        this.data = {};
        this.termsOption = {};
        this.filter = {};
        //this.price = {lower: 1, upper: 150};
        this.categoryName = params.data.name;
        this.q = "";
        this.filter.category = params.data.id;
        this.filter.page = 1;
        this.categories = params.data.categories;
        this.count = 10;
        this.offset = 0;
        this.values.filter = {};
        this.options = [];
        this.subCategories = [];
        this.items = [];
        this.quantity = "1";

        if(params.data.attributeSlug){
             this.filter.attribute = params.data.attributeSlug; 
        }
        if(params.data.attributeId){
             this.filter.attribute_term = params.data.attributeId; 
        }

        this.service.load(this.filter)
            .then((results) => this.handleProducts(results));

        this.service.getAttributes()
          .then((results) => {
            this.attributes = results;
            if(this.attributes.length){
    this.attributes.forEach(item => {
      item.selected = false;
    });
                this.getAttributeTerms(this.attributes[0].id);
                this.selectedFilter = this.attributes[0];
                this.attributes[0].selected = true;
                this.filter.attribute = this.attributes[0].id;
            }
        });    

        for (var i = 0; i < this.categories.product_categories.length; i++) {
            if (this.categories.product_categories[i].parent == this.filter.category) {
                this.subCategories.push(this.categories.product_categories[i]);
            }
        }
    }

    handleProducts(results){
        this.products = results;
    }

  chooseTab(filterTitle) {

    this.filter.attribute = filterTitle.slug;
    console.log(this.filter.attribute);
    this.getAttributeTerms(filterTitle.id);
    this.attributes.forEach(item => {
      item.selected = false;
    });

    filterTitle.selected = true;
    this.selectedFilter = filterTitle;
  }

   updateTerms(id) {

    this.filter.attribute_term = id;
   
  }


    getCategory(id, slug, name) {
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.categories;
        this.nav.push('ProductsPage', this.items);
    }
    parseText(id, count, offset, obj2) {
        var text = '{';
        text += '"category' + '":"' + id + '"}';
        var obj1 = JSON.parse(text);
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }
    getProducts(id) {
        this.nav.push('ProductsPage', id);
    }
    getProduct(id) {
        this.nav.push('ProductPage', id);
    }
    getCart() {
        this.nav.push('CartPage');
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

    setListView() {
        this.values.listview = true;
    }

    setGridView() {
        this.values.listview = false;
    }

    deleteFromCart(id) {
        this.service.deleteFromCart(id)
            .then((results) => this.status = results);
    }

    updateToCart(id) {
        this.service.updateToCart(id)
            .then((results) => this.status = results);
    }

    addToCart(id, type) {
        if (type == 'variable') {
            this.nav.push('ProductPage', id);
        }
        else {
            var text = '{';
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

    onInput($event) {
        this.filter = "";
        this.filter = {};
        this.filter.page = 1;
        this.filter.search = $event.srcElement.value;
        //this.filter.order = "DESC";
        this.service.search(this.filter)
            .then((results) => this.handleSearchResults(results));
    }

    handleSearchResults(results){
        this.products = results;

    }

    onCancel($event) {
        console.log('cancelled');
    }

    getFilter() {
        this.showFilters = true;
        this.has_more_items = false;

    }

    cancel() {
        this.showFilters = false;
        this.has_more_items = true;
    }

    clearAll(){
        this.showFilters = false;
        this.has_more_items = true;
        this.filter.min_price = undefined;
        this.filter.max_price = undefined; 
        this.filter.name = undefined; 
        this.filter.attribute = undefined;
        this.filter.attribute_term = undefined;

        this.service.load(this.filter)
            .then((results) => this.handleProducts(results));
    }

    cancelSort() {
        this.showSortFilters = false;
        this.has_more_items = true;
    }

    getSortFilter(){
       this.showSortFilters = true;
       this.has_more_items = false;  
    }


    changeFilter(sort) {
        this.showSortFilters = false;
        this.has_more_items = true;
        this.filter.page = 1;
        if (sort == 0) {
            this.filter.order = "asc";
            this.filter.orderby = "date";
        }
        if (sort == 1) {
            this.filter.order = "asc";
            this.filter.orderby = "title";
        }
        else if (sort == 2) {
            this.filter.order = "desc";
            this.filter.orderby = "title";
        }
        /*else if (sort == 3) {
            this.filter.order = "asc";
            this.filter.orderby= "_price";
        }
        else if (sort == 4) {
            this.filter.order = "desc";
            this.filter.orderby = "price";
        }*/
        this.service.load(this.filter)
            .then((results) => this.products = results);
    }
         

    applyFilter(){        

        this.showFilters = false;
        this.has_more_items = true;
        this.filter.page = 1;
        this.filter.min_price = this.price.lower;
        this.filter.max_price = this.price.upper;



        this.products = null;
        this.service.load(this.filter)
            .then((results) => this.handleFilterResults(results));

    }

    handleFilterResults(results){
        console.log(results);
    this.products = results;
       
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


    getAttributeTerms(id){

        if(!this.attributeTerms[id]){
            this.service.attributeTerms(id)
              .then((results) => this.attributeTerms[id] = results);
        }
      
    }
}