import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsCondition } from './terms-condition';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TermsCondition,
  ],
  imports: [
    IonicPageModule.forChild(TermsCondition),
    TranslateModule.forChild()
  ],
  exports: [
    TermsCondition
  ]
})
export class TermsConditionModule {}
