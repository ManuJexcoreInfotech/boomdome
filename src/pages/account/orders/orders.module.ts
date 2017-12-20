import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Orders } from './orders';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    Orders,
  ],
  imports: [
    IonicPageModule.forChild(Orders),
    TranslateModule.forChild()
  ],
  exports: [
    Orders
  ]
})
export class OrdersModule {}
