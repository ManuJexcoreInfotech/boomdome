import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Address } from './address';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    Address,
  ],
  imports: [
    IonicPageModule.forChild(Address),
    TranslateModule.forChild()
  ],
  exports: [
    Address
  ]
})
export class AddressModule {}
