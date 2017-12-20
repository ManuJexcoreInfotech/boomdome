import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Values } from '../../../providers/service/values';


@IonicPage()
@Component({
    templateUrl: 'address.html',
})
export class Address {
    addresses: any;
    address: any;
    status: any;
    form: any;
    constructor(public nav: NavController, public service: Service, public values: Values) {
        this.service.getAddress()
            .then((results) => this.addresses = results);
    }
    editAddress() {
        this.nav.push('EditAddressForm', this.addresses);
    }
}