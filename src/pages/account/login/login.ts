import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Home } from '../../home/home';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';


@IonicPage()
@Component({
    templateUrl: 'login.html'
})
export class AccountLogin {
    loginData: any;
    loadLogin: any;
    status: any;
    error: any;
    nonce: any;
    public disableSubmit: boolean = false;
    LogIn: any;

    constructor(public nav: NavController, public service: Service, public functions: Functions, public values: Values, private googlePlus: GooglePlus, private fb: Facebook) {
        this.loginData = [];
        this.LogIn = "LogIn";
        this.service.getNonce()
            .then((results) => this.nonce = results);
    }
    login(a) {
        if (this.validateForm()) {
            this.disableSubmit = true;
            this.LogIn = "Logging In";
            this.service.login(a, this.nonce.checkout_login)
                .then((results) => this.handleResults(results));
        }
    }
    validateForm() {
        if (this.loginData.username == undefined || this.loginData.username == "") {
            return false
        }
        if (this.loginData.password == undefined || this.loginData.password == "") {
            return false
        }
        else {
            return true
        }
    }
    handleResults(results) {
        this.disableSubmit = false;
        this.LogIn = "LogIn";

        
        if (!results.errors) {
            this.functions.showAlert('success', 'You have successfully logged in');
            this.nav.setRoot(Home);
        }
        else if (results.errors) {
            this.functions.showAlert('error', 'invalid username/password');
        }
    }
    forgotten(loginData) {
        this.nav.push('AccountForgotten');
    }
    signup(){
        this.nav.push('AccountRegister');
    }


    facebookLogin(){
        this.fb.login(['email']).then( (response) => {
            console.log(response.authResponse.accessToken);
             //this.functions.showAlert('token', response.authResponse.accessToken);
          this.service.sendToken(response.authResponse.accessToken)
            .then((results) => {             
               //this.functions.showAlert('success', 'Logged in sus');
               this.nav.pop();
               if(this.values.setNavigation){
                 this.nav.setRoot(Home);
               }

            });              
        }).catch((error) => { console.log(error)
        this.functions.showAlert('Error', error); });
    }


    gmailLogin(){
        this.googlePlus.login({
        'scopes': '',
        'webClientId': '929662214811-p3fmo7gk14elub2tlaetd48jntss7kud.apps.googleusercontent.com',
        'offline': true
      })
          .then((res) =>{ 

            //this.functions.showAlert("er", res);

            this.service.googleLogin(res.userId, res.email, res.displayName, res.displayName)
            .then((results) => {
               //this.functions.showAlert('success', 'Logged in sus');
               this.nav.pop();
            });   


            console.log(res);
            })
          .catch((err) => {
            this.error = err;
            console.error(err);
            });
    }
    
}