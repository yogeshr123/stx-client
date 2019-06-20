import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadStatusComponent } from './load-status.component';
import { LoadStatusRouting } from './load-status.routing';

@NgModule({
  declarations: [LoadStatusComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadStatusRouting
  ]
})
export class LoadStatusModule { }
