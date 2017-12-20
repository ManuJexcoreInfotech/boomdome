import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetails } from './order-details';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    OrderDetails,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetails),
    TranslateModule.forChild()
  ],
  exports: [
    OrderDetails
  ]
})
export class OrderDetailsModule {}
