import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingAddressForm } from './billing-address-form';
import { KeysPipeModule } from '../../../pipes/pipe.module'
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    BillingAddressForm,
  ],
  imports: [
    IonicPageModule.forChild(BillingAddressForm),
    KeysPipeModule,
    TranslateModule.forChild()
  ],
  exports: [
    BillingAddressForm
  ]
})
export class BillingAddressFormModule {}
