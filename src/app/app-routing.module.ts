// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LogoutComponent } from './pages/logout/logout.component';
const routes: Routes = [
    { path: 'superlogin', loadChildren: './pages/login/login.module#LoginModule' },
    { path: 'superregister', component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
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
