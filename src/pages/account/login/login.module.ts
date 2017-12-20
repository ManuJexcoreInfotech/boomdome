import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountLogin } from './login';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountLogin,
  ],
  imports: [
    IonicPageModule.forChild(AccountLogin),
    TranslateModule.forChild()
  ],
  exports: [
    AccountLogin
  ]
})
export class AccountLoginModule {}
