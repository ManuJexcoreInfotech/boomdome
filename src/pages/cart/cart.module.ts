import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
import { KeysPipeModule } from '../../pipes/pipe.module'
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    KeysPipeModule,
    TranslateModule.forChild()

  ],
  exports: [
    CartPage
  ]
})
export class CartPageModule {}
