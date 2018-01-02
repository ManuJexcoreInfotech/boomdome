import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CheckoutService } from '../../../providers/service/checkout-service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';


@IonicPage()
@Component({
    templateUrl: 'billing-address-form.html'
})
export class BillingAddressForm {
    billingAddressForm: any;
    billing: any;
    regions: any;
    status: any;
    errorMessage: any;
    address: any;
    form: any;
    states: any;
    OrderReview: any;
    loginData: any;
    id: any;
    couponStatus: any;
    showCreateAccont: boolean = false;
    buttonSubmit: boolean = false;
    buttonSubmitLogin: boolean = false;
    buttonSubmitCoupon: boolean = false;
    PlaceOrder: any;
    buttonText1: any;
    LogIn: any;
    mydate: any;
    time: any;
    date: any;
    selectedDate: any;
    shipping: any;
    order: any;
    buttonText : any;
    constructor(public iab: InAppBrowser, public nav: NavController, public service: CheckoutService, params: NavParams, public functions: Functions, public values: Values) {
        this.PlaceOrder = "Place Order";
        this.buttonText1 = "Apply";
        this.LogIn = "LogIn";
        this.loginData = [];
        this.form = params.data;
        this.billing = {};
        //this.billing.shipping = true;
        this.billing.save_in_address_book = true;
        this.getRegion(this.form.billing_country);
        this.getRegion(this.form.shipping_country);
        this.form.shipping = true;
        this.shipping = {};
        this.shipping.save_in_address_book = true;
        this.getRegion(this.form.billing_country);

        this.service.getDate()
           .then((results) => {if(results['success']) this.mydate = results['bookable_dates']});

    }

    getRegion(countryId) {
        //this.form.billing_state = "";
        this.states = this.form.state[countryId];
        this.service.updateOrderReview(this.form)
            .then((results) => this.OrderReview = results);
    }
    checkout() {
        this.buttonSubmit = true;
        this.PlaceOrder = "Placing Order";
        if (this.form.shipping) {
            this.form.shipping_first_name = this.form.billing_first_name;
            this.form.shipping_last_name = this.form.billing_last_name;
            this.form.shipping_company = this.form.billing_company;
            this.form.shipping_address_1 = this.form.billing_address_1;
            this.form.shipping_address_2 = this.form.billing_address_2;
            this.form.shipping_city = this.form.billing_city;
            this.form.shipping_country = this.form.billing_country;
            this.form.shipping_state = this.form.billing_state;
            this.form.shipping_postcode = this.form.billing_postcode;
        }
        if (this.form.payment_method == 'bacs' || this.form.payment_method == 'cheque' || this.form.payment_method == 'cod') {
            this.service.checkout(this.form)
                .then((results) => this.handleBilling(results));
                this.functions.showAlert('', 'Goods will be deliver in one week.')
        }
        else if (this.form.payment_method == 'stripe') {
            this.service.getStripeToken(this.form)
                .then((results) => this.handleStripeToken(results));
        }
        else {
            this.service.checkout(this.form)
                .then((results) => this.handlePayment(results));
                this.functions.showAlert('', 'Goods will be deliver in one week.')
        }
    }
    handlePayment(results) {
        if (results.result == 'success') {
            let browser = this.iab.create(results.redirect, '_blank', 'location=yes');
            browser.show();
            this.values.cart = [];
            this.values.count = 0;
            var str = results.redirect;
            var pos1 = str.lastIndexOf("/order-pay/");
            var pos2 = str.lastIndexOf("?key=wc_order");
            var pos3 = pos2 - (pos1 + 11);
            var order_id = str.substr(pos1 + 11, pos3);
            console.log(order_id);
            let theLoop: (i: number) => void = (i: number) => {
                setTimeout(() => {
                    this.service.getOrderSummary(order_id)
                        .then((results) => {
                            this.order = results;
                            if (this.order.order.status == "processing") {
                                browser.close();
                                this.nav.push('OrderSummary', order_id);
                            }
                            else if (this.order.order.status == "pending") {
                                --i;
                                theLoop(i);
                            }
                        });
                }, 15000);
            };
            theLoop(10);
        }
        else if (results.result == 'failure') {
            this.functions.showAlert("STATUS", results.messages);
            this.buttonSubmit = false;
        }
    }
    checkoutStripe() {
        this.buttonSubmit = true;
        this.PlaceOrder = "Placing Order";
        this.service.getStripeToken(this.form)
            .then((results) => this.handleStripeToken(results));
    }
    handleStripeToken(results) {
        if (results.error) {
            this.buttonSubmit = false;
            this.PlaceOrder = "Place Order";
            this.functions.showAlert("ERROR", results.error.message);
        }
        else {
            this.service.stripePlaceOrder(this.form, results)
                .then((results) => this.handleBilling(results));
                this.buttonSubmit = false;
        }
    }
    handleBilling(results) {
        if (results.result == "success") {
            var str = results.redirect;
            var pos1 = str.lastIndexOf("order-received/");
            var pos2 = str.lastIndexOf("?key=wc_order");
            var pos3 = pos2 - (pos1 + 15);
            var order_id = str.substr(pos1 + 15, pos3);
            this.nav.push('OrderSummary', order_id);
        }
        else if (results.result == "failure") {
            this.functions.showAlert("ERROR", results.messages);
        }
        this.buttonSubmit = false;
        this.PlaceOrder = "Place Order";
    }
    login() {
        if (this.validateForm()) {
            this.buttonSubmitLogin = true;
            this.LogIn = "Please Wait";
            this.service.login(this.form)
                .then((results) => this.handleResults(results));
        }
    }
    validateForm() {
        if (this.form.username == undefined || this.form.username == "") {
            return false
        }
        if (this.form.password == undefined || this.form.password == "") {
            return false
        }
        else {
            return true
        }
    }
    handleResults(a) {
        this.buttonSubmitLogin = false;
        this.LogIn = "LogIn";
        //this.form.shipping = true;
        if (a.user_logged) {
            this.form = a;
            this.states = this.form.state[this.form.billing_country];
            this.values.isLoggedIn = a.user_logged;
            this.values.customerName = a.billing_first_name;
            this.values.customerId = a.user_id;
            this.values.logoutUrl = a.logout_url;
        }
        else {
            this.functions.showAlert("Error", 'Login unsuccessful. try again');
        }
    }

    createAccount() {
        this.showCreateAccont = true;
    }
    changePayment() {
        this.form.payment_instructions = this.form.payment[this.form.payment_method].description;
        this.buttonSubmit = false;
        this.buttonText = "Continue to " + this.form.payment[this.form.payment_method].method_title;
    }

    terms(){
        this.nav.push('TermsCondition', this.form.terms_content);
    }
}