import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAddressForm } from './edit-address-form';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipeModule } from '../../../pipes/pipe.module'



@NgModule({
  declarations: [
    EditAddressForm,
  ],
  imports: [
    IonicPageModule.forChild(EditAddressForm),
     KeysPipeModule,
    TranslateModule.forChild()
  ],
  exports: [
    EditAddressForm
  ]
})
export class EditAddressFormsModule {}
