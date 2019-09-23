// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from './pages/logout/logout.component';
import { NotFoundComponent } from './pages/404/404.component';
const routes: Routes = [
    { path: 'superlogin', loadChildren: './pages/login/login.module#LoginModule' },
    { path: 'superregister', loadChildren: './pages/register/register.module#RegisterModule' },
    { path: 'logout', component: LogoutComponent },
    { path: '404', component: NotFoundComponent },
    {
        path: '',
        loadChildren: './structure/base/base.module#BaseModule'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
