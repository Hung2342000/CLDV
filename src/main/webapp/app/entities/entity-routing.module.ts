import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerRequestModule } from './customer-request/customer-request.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ticket',
        data: { pageTitle: 'qldvApp.ticket.home.title' },
        loadChildren: () => import('./ticket/ticket.module').then(m => m.TicketModule),
      },
      {
        path: 'report',
        data: { pageTitle: 'qldvApp.report.home.title' },
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
      },
      {
        path: 'customer-request',
        data: { pageTitle: 'qldvApp.report.home.title' },
        loadChildren: () => import('./customer-request/customer-request.module').then(m => m.CustomerRequestModule),
      },
      {
        path: 'shop',
        data: { pageTitle: 'qldvApp.report.home.title' },
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
