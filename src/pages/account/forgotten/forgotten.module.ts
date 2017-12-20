import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountForgotten } from './forgotten';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountForgotten,
  ],
  imports: [
    IonicPageModule.forChild(AccountForgotten),
    TranslateModule.forChild()
  ],
  exports: [
    AccountForgotten
  ]
})
export class AccountForgottenModule {}
