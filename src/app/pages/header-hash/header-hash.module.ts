import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderHashComponent } from './header-hash.component';
import { HeaderHashRouting } from './header-hash.routing';

@NgModule({
  declarations: [
    HeaderHashComponent
  ],
  imports: [
    CommonModule,
    HeaderHashRouting
  ]
})
export class HeaderHashModule { }
