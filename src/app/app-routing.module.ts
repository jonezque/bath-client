import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BathPriceComponent } from './components/bath-price/bath-price.component';
import { DiscountComponent } from './components/discount/discount.component';
import { LoginComponent } from './components/login/login.component';
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
import { AuthGuard } from './services/auth-guard.service';
import { Roles } from './services/interfaces';

const routes: Routes = [
  {
    path: 'sittingplacesmen',
    component: SittingPlacesMenComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Manager, Roles.Admin],
    }
  },
  {
    path: 'sittingplaceswomen',
    component: SittingPlacesWomenComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Manager, Roles.Admin],
    }
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Manager, Roles.Admin],
    }
  },
  {
    path: 'bathprice',
    component: BathPriceComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Admin],
    }
  },
  {
    path: 'discount',
    component: DiscountComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Admin],
    }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Manager, Roles.Admin],
    }
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: {
      expectedRole: [Roles.Manager, Roles.Admin],
    }
  },
  {
    path: '',
    redirectTo: 'sittingplacesmen',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
