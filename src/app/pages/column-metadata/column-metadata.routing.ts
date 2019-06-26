import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ColumnMetadataComponent } from './column-metadata.component';


const routes: Routes = [
    {
        path: '',
        component: ColumnMetadataComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ColumnMetadataRouting { }
