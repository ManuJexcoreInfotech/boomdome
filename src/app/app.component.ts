import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Home} from '../pages/home/home';
import {Service} from '../providers/service/service';
import {Values} from '../providers/service/values';
import { TranslateService } from '@ngx-translate/core';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Home;
  status: any;
  pages: Array<{title: string, component: any}>
  menu: Array<{title: string, component: any}>
  configuration: any;
  items: any;
   buttonLanguagesSettings: boolean= false;
   showCategories: boolean= false;

  constructor(statusBar: StatusBar, splashScreen: SplashScreen, public alertCtrl: AlertController, public platform: Platform, public service: Service, public values: Values, public translateService: TranslateService) {
    platform.ready().then(() => {
     statusBar.styleDefault();
     splashScreen.hide();
     // this.pushsetup();

    });

    this.translateService.setDefaultLang('english');
    //this.platform.setDir('rtl', true);
    //this.values.dir = 'right';

  }

    openPage(page) {
        this.nav.setRoot(page);
    }
    getCategory(id, slug, name) {
        this.items = [];
        this.items.id = id;
        this.items.slug = slug;
        this.items.name = name;
        this.items.categories = this.service.categories;
        this.nav.setRoot('ProductsPage', this.items);
    }
    getCart() {
        this.nav.setRoot('CartPage');
    }
    logout() {
        this.service.logout();
    }
  
    login(){
      this.nav.setRoot('AccountLogin');
    }

    register(){
      this.nav.setRoot('AccountRegister');
    }

    address(){
      this.nav.setRoot('Address');
    }


     order(){
      this.nav.setRoot('Orders');
    }


     cart(){
      this.nav.setRoot('CartPage');
    }

  
    wishlist(){
      this.nav.setRoot('WishlistPage');
    }
    

    shop(){
      this.nav.setRoot(Home);
    }

    dropDown(){
      this.showCategories = true;
    }

    dropup(){
      this.showCategories = false;
    }

/*  pushsetup() {

    if (this.platform.is('ios')) {
      this.values.platform = "ios";
    }
    else if (this.platform.is('android')) {
      this.values.platform = "android";
    }
    else if (this.platform.is('windows')) {
      this.values.platform = "windows";
    }
        const options: PushOptions = {
         android: {
             senderID: '456352511209'
         },
         ios: {
             alert: 'true',
             badge: true,
             sound: 'false'
         },
         windows: {}
      };
     
      const pushObject: PushObject = this.push.init(options);
     
      pushObject.on('notification').subscribe((notification: any) => {
        if (notification.additionalData.foreground) {
          let youralert = this.alertCtrl.create({
            title: 'New Push notification',
            message: notification.message
          });
          youralert.present();
        }
      });
     
      pushObject.on('registration').subscribe((registration: any) => {
         this.values.deviceId = registration.registrationId;

         this.service.pushNotify(this.values.deviceId, this.values.platform)
            .then((results) => this.status = results);

     });

      pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }*/
}