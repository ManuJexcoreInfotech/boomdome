import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import {Service} from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Home } from '../../home/home';

@IonicPage()
@Component({
    templateUrl: 'register.html'
})
export class AccountRegister {
    registerData: any;
    loadRegister: any;
    countries: any;
    status: any;
    public disableSubmit: boolean = false;
    errors: any;
    loginStatus: any;
    country: any;
    billing_states: any;
    shipping_states: any;
    Register: any;
    constructor(public nav: NavController, public service: Service, public functions: Functions, public values: Values) {
        this.Register = "Register Account";
        this.registerData = {};
        this.countries = {};
        this.registerData.billing = {};
        this.registerData.shipping = {};
        this.service.getNonce()
            .then((results) => this.handleResults(results));
    }
    handleResults(results) {
        this.countries = results;
    }
    getBillingRegion(countryId) {
        this.registerData.billing_state = "";
        this.billing_states = this.countries.state[countryId];
    }
    getShippingRegion(countryId) {
        this.shipping_states = this.countries.state[countryId];
    }
    validateForm() {
        if (this.registerData.first_name == undefined || this.registerData.firstname == "") {
            this.functions.showAlert("ERROR", "Please Enter First Name");
            return false
        }
        if (this.registerData.last_name == undefined || this.registerData.lastname == "") {
            this.functions.showAlert("ERROR", "Please Enter Last Name ");
            return false
        }
        if (this.registerData.email == undefined || this.registerData.email == "") {
            this.functions.showAlert("ERROR", "Please Enter Email ID");
            return false
        }
        if (this.registerData.password == undefined || this.registerData.password == "") {
            this.functions.showAlert("ERROR", "Please Enter Password");
            return false
        }
        this.registerData.username = this.registerData.email;
        this.registerData.billing.email = this.registerData.email;
        this.registerData.billing.first_name = this.registerData.first_name;
        this.registerData.billing.last_name = this.registerData.last_name;
        this.registerData.shipping.first_name = this.registerData.first_name;
        this.registerData.shipping.last_name = this.registerData.last_name;
        this.registerData.shipping.company = this.registerData.billing.company;
        this.registerData.shipping.address_1 = this.registerData.billing.address_1;
        this.registerData.shipping.address_2 = this.registerData.billing.address_2;
        this.registerData.shipping.city = this.registerData.billing.city;
        this.registerData.shipping.state = this.registerData.billing.state;
        this.registerData.shipping.postcode = this.registerData.billing.postcode;
        this.registerData.shipping.country = this.registerData.billing.country;
        return true;
    }
    registerCustomer() {
        if (this.validateForm()) {
            this.disableSubmit = true;
            this.Register = "Registering";
            this.service.registerCustomer(this.registerData)
                .then((results) => this.handleRegister(results));
        }
    }
    handleRegister(results) {
        this.disableSubmit = false;
        this.Register = "Register Account";

        if (results.code) {
            this.errors = results;
        }

        else if (!results.code) {
            this.countries.checkout_login;
            this.service.login(this.registerData, this.countries.checkout_login)
                .then((results) => this.loginStatus = results);
            
            this.registerData.device_id = this.values.deviceId;
            this.registerData.platform = this.values.platform;
            this.registerData.email = this.registerData.email;
            this.registerData.city = this.registerData.billing.city;
            this.registerData.state = this.registerData.billing.state;
            this.registerData.country = this.registerData.billing.country;
            this.registerData.pincode = this.registerData.billing.postcode;

             this.service.pushNotification(this.registerData)
                .then((results) => this.status = results);

            this.nav.setRoot(Home);
        }
    }
}