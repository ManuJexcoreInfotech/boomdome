import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    templateUrl: 'terms-condition.html'
})
export class TermsCondition {
   
	terms: any;
    constructor(public nav: NavController, params: NavParams) {
    	this.terms = params.data;
    }

}