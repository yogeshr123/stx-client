import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Custom components
import { AppComponent } from './app.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { NotFoundComponent } from './pages/404/404.component';
import { HeaderInterceptor } from './services/headers.interceptor';
import { MessageService } from 'primeng/api';
// import { LoginComponent } from './pages/login/login.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        AppComponent,
        LogoutComponent,
        NotFoundComponent,
        // LoginComponent,
    ],
    imports: [
        AppRoutingModule,
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeaderInterceptor,
            multi: true,
        },
        MessageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
