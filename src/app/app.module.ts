import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localesRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faEnvelopeOpen,
  faKey,
  faMinus,
  faPlus,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { BathPriceComponent } from './components/bath-price/bath-price.component';
import { CancelOrderComponent } from './components/cancel-order/cancel-order.component';
import {
  CreateDiscountComponent,
} from './components/create-discount/create-discount.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';
import { DiscountComponent } from './components/discount/discount.component';
import {
  FilterOrdersComponent,
} from './components/filter-orders/filter-orders.component';
import { LoginComponent } from './components/login/login.component';
import {
  NavigationMenuComponent,
} from './components/navigation-menu/navigation-menu.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { ProductsComponent } from './components/products/products.component';
import {
  SittingPlacesMenComponent,
} from './components/sitting-places/sitting-places-men/sitting-places-men.component';
import {
  SittingPlacesWomenComponent,
} from './components/sitting-places/sitting-places-women/sitting-places-women.component';
import { UsersComponent } from './components/users/users.component';
import { PlacePriceDirective } from './directives/place-price.directive';
import { PlaceDirective } from './directives/place.directive';
import { AuthGuard } from './services/auth-guard.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthService } from './services/auth.service';
import { FilterOrderService } from './services/filter-order.service';

registerLocaleData(localesRu);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    OrderListComponent,
    UsersComponent,
    SittingPlacesMenComponent,
    NavigationMenuComponent,
    CreateOrderComponent,
    PlaceDirective,
    BathPriceComponent,
    PlacePriceDirective,
    DiscountComponent,
    CreateDiscountComponent,
    AlertComponent,
    CancelOrderComponent,
    FilterOrdersComponent,
    SittingPlacesWomenComponent,
    ProductsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule,
    FontAwesomeModule,
    FormsModule,
  ],
  providers: [
    FilterOrderService,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  entryComponents: [
    CreateOrderComponent,
    CreateDiscountComponent,
    AlertComponent,
    CancelOrderComponent,
    FilterOrdersComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    library.add(faUser, faSignOutAlt, faBars, faEnvelopeOpen, faKey, faPlus, faMinus);
  }
}
