import { Component } from '@angular/core';
import { NavController, IonicPage,LoadingController} from 'ionic-angular';
import { Service } from '../../../providers/service/service';
import { Functions } from '../../../providers/service/functions';
import { Values } from '../../../providers/service/values';
import { Home } from '../../home/home';
import { URLSearchParams } from '@angular/http';
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
	loading1:any;
    error: any;
    nonce: any;
    public disableSubmit: boolean = false;
    LogIn: any;
    gres: any;
    fres: any;
    
    constructor(public nav: NavController, public service: Service, public functions: Functions, public values: Values, private googlePlus: GooglePlus, private fb: Facebook,public Loading:LoadingController) {
        var searchParams = new URLSearchParams();
        searchParams.append("topic", "webdev");
        console.log(searchParams);
        this.loginData = [];
        this.LogIn = "LogIn";
        this.service.getNonce()
            .then((results) => this.nonce = results);
    }
    login(a,b) {
        console.log('atloginpage');
        console.log(a);

        console.log(b);
        this.loginData={username:a,password:b};
       //  this.loginData.push({username:a,password:b});
      //  this.loginData.push({password:b});
console.log(this.loginData);

       

        if (this.validateForm()) {
            console.log('loginformvalid');
            this.disableSubmit = true;
            this.LogIn = "Logging In";
            this.service.login(this.loginData, this.nonce.checkout_login)
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
        console.log(results);
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


    facebookLogin() {
     
        this.fb.login(['email']).then((response) => {
            this.fres = response;
            console.log(response.authResponse.accessToken);
            //this.functions.showAlert('token', response.authResponse.accessToken);
            this.service.sendToken(response.authResponse.accessToken).then((results) => {
                
				this.loading1 = this.Loading.create();
				this.loading1.present();
				setTimeout(()=>{    
					this.loading1.dismiss();
					this.functions.showAlert('success', 'Logged in success');
					this.nav.setRoot(Home);
				},3000);
                
                
                //this.nav.pop();
                
                //if (this.values.setNavigation) {
                 //   this.nav.setRoot(Home);
                //}
            });
        }).catch((error) => {
            console.log(error)

            this.functions.showAlert('Error', error);
        });
    }
    gmailLogin() {

        this.googlePlus.login({
            'scopes': '',
            'webClientId': '929662214811-p3fmo7gk14elub2tlaetd48jntss7kud.apps.googleusercontent.com',
            'offline': true
        }).then((res) => {
            
                this.gres = res;
            this.values.avatar = res.imageUrl;
            
            this.service.googleLogin(res).then((results) => {
                this.functions.showAlert('success', 'Logged in success');
                this.nav.setRoot('Home');
            });
        }).catch((err) => {

            this.error = err;
            console.error(err);
        });
    }
    
}