import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home } from './home';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    Home,
  ],
  imports: [
    IonicPageModule.forChild(Home),
    TranslateModule.forChild()
  ],
  exports: [
    Home
  ]
})
export class HomeModule {}
