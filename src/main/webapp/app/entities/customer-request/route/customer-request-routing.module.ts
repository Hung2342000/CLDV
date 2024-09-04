import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomerRequestComponent } from '../list/customer-request.component';
import { CustomerRequestDetailComponent } from '../detail/customer-request-detail.component';
import { CustomerRequestUpdateComponent } from '../update/customer-request-update.component';
import { CustomerRequestRoutingResolveService } from './customer-request-routing-resolve.service';

const ticketRoute: Routes = [
  {
    path: '',
    component: CustomerRequestComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerRequestDetailComponent,
    resolve: {
      ticket: CustomerRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerRequestUpdateComponent,
    resolve: {
      ticket: CustomerRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerRequestUpdateComponent,
    resolve: {
      ticket: CustomerRequestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ticketRoute)],
  exports: [RouterModule],
})
export class CustomerRequestRoutingModule {}
