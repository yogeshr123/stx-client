import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ColumnMetadataComponent } from './column-metadata.component';
import { AddEditColumnComponent } from './add-edit-column/add-edit-column.component';
import { AllVersionsComponent } from './all-versions/all-versions.component';
import { DimLookupComponent } from './dim-lookup/dim-lookup.component';
import { AuthGuard } from 'src/app/services/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: ColumnMetadataComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessColumnMetadataModule' }
    },
    {
        path: 'all-versions',
        component: AllVersionsComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'accessColumnMetadataModule' }
    },
    {
        path: 'add-column',
        component: AddEditColumnComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'addColumnMetadataModule' }
    },
    {
        path: 'add-column/fhh',
        component: AddEditColumnComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'addColumnMetadataModule' }
    },
    {
        path: 'view-column/fhh',
        component: AddEditColumnComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readColumnMetadataModule' }
    },
    {
        path: 'view-column/:versionId/:columnId',
        component: AddEditColumnComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'readColumnMetadataModule' }
    },
    {
        path: 'edit-column/:versionId/:columnId',
        component: AddEditColumnComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'editColumnMetadataModule' }
    },
    {
        path: 'lookup',
        component: DimLookupComponent,
        canActivate: [AuthGuard],
        data: { expectedPermission: 'editColumnMetadataModule' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ColumnMetadataRouting { }
