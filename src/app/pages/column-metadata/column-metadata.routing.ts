import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ColumnMetadataComponent } from './column-metadata.component';
import { AddEditColumnComponent } from './add-edit-column/add-edit-column.component';
import { AllVersionsComponent } from './all-versions/all-versions.component';


const routes: Routes = [
    {
        path: '',
        component: ColumnMetadataComponent
    },
    {
        path: 'all-versions',
        component: AllVersionsComponent
    },
    {
        path: 'add-column',
        component: AddEditColumnComponent
    },
    {
        path: 'view-column/:versionId/:columnId',
        component: AddEditColumnComponent
    },
    {
        path: 'edit-column/:versionId/:columnId',
        component: AddEditColumnComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ColumnMetadataRouting { }
