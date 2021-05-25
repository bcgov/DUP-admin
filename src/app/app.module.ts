import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTabsModule, MatMenuModule } from '@angular/material';

// modules
import { AppRoutingModule } from 'app/app-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';

// components
import { AppComponent } from 'app/app.component';
import { HeaderComponent } from 'app/header/header.component';
import { FooterComponent } from 'app/footer/footer.component';
import { ToggleButtonComponent } from 'app/toggle-button/toggle-button.component';
import { HomeComponent } from 'app/home/home.component';
import { SidebarComponent } from 'app/sidebar/sidebar.component';
import { ParksComponent } from './parks/parks.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { MetricsComponent } from './metrics/metrics.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ParksDetailComponent } from './parks/parks-detail/parks-detail.component';
import { ParksAddComponent } from './parks/parks-add/parks-add.component';
import { ParksEditComponent } from './parks/parks-edit/parks-edit.component';

// services

// feature modules


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SidebarComponent,
    ToggleButtonComponent,
    ParksComponent,
    ReservationsComponent,
    MetricsComponent,
    BreadcrumbComponent,
    ParksDetailComponent,
    ParksAddComponent,
    ParksEditComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EditorModule,
    AppRoutingModule, // <-- module import order matters - https://angular.io/guide/router#module-import-order-matters
    NgbModule,
    BootstrapModalModule.forRoot({ container: document.body }),
    NgSelectModule,
    MatMenuModule,
    MatTabsModule,
  ],
  providers: [
    CookieService,
  ],
  entryComponents: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(applicationRef: ApplicationRef) {
    Object.defineProperty(applicationRef, '_rootComponents', { get: () => applicationRef['components'] });
  }
}
