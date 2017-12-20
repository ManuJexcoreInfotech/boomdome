import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRegister } from './register';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipeModule } from '../../../pipes/pipe.module'

@NgModule({
  declarations: [
    AccountRegister,
  ],
  imports: [
    KeysPipeModule,
    IonicPageModule.forChild(AccountRegister),
    TranslateModule.forChild()
  ],
  exports: [
    AccountRegister
  ]
})
export class AccountRegisterModule {}
