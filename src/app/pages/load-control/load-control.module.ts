// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// NgBootstrap
import { LoadControlComponent } from './load-control.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { LoadControlEditComponent } from './load-control-edit.component';
import { RecordService } from '../../services/record.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoadControlComponent
            },
            {
                path: 'edit',
                component: LoadControlEditComponent
            }
        ]),
        TableModule,
        DropdownModule,
        MultiSelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        RecordService
    ],
    declarations: [
        LoadControlComponent,
        LoadControlEditComponent
    ]
})
export class LoadControlModule {
}
