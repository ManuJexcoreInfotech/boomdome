import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSummary } from './order-summary';
import { KeysPipeModule } from '../../../pipes/pipe.module'
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    OrderSummary,
  ],
  imports: [
    IonicPageModule.forChild(OrderSummary),
    KeysPipeModule,
    TranslateModule.forChild()

  ],
  exports: [
    OrderSummary
  ]
})
export class OrderSummaryModule {}
