import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { UserRouteAccessService } from '../core/auth/user-route-access.service';

export const HOME_ROUTE: Route = {
  path: 'khaosat/:shopCode',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};
