import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerRequestComponent } from './list/customer-request.component';
import { CustomerRequestDetailComponent } from './detail/customer-request-detail.component';
import { CustomerRequestUpdateComponent } from './update/customer-request-update.component';
import { CustomerRequestDeleteDialogComponent } from './delete/customer-request-delete-dialog.component';
import { CustomerRequestRoutingModule } from './route/customer-request-routing.module';

@NgModule({
  imports: [SharedModule, CustomerRequestRoutingModule],
  declarations: [
    CustomerRequestComponent,
    CustomerRequestDetailComponent,
    CustomerRequestUpdateComponent,
    CustomerRequestDeleteDialogComponent,
  ],
  entryComponents: [CustomerRequestDeleteDialogComponent],
})
export class CustomerRequestModule {}
