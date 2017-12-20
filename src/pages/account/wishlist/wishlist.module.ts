import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WishlistPage } from './wishlist';
import { KeysPipeModule } from '../../../pipes/pipe.module'
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    WishlistPage,
  ],
  imports: [
    IonicPageModule.forChild(WishlistPage),
    KeysPipeModule,
    TranslateModule.forChild()

  ],
  exports: [
    WishlistPage
  ]
})
export class WishlistPageModule {}
